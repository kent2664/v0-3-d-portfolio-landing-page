"use client"

import { useEffect, useRef, useState } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import * as THREE from "three"

const vertexShader = `
  attribute float size;
  attribute float opacity;
  varying float vOpacity;
  void main() {
    vOpacity = opacity;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    // 300.0 の値を大きくすると星が全体的に大きくなります
    gl_PointSize = size * (300.0 / length(mvPosition.xyz)); 
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const fragmentShader = `
  varying float vOpacity;
  uniform vec3 color;
  void main() {
    // 粒子を丸く描画する
    if (length(gl_PointCoord - vec2(0.5, 0.5)) > 0.5) discard;
    gl_FragColor = vec4(color, vOpacity);
  }
`;

const Starfield = () => {
  const ref = useRef<THREE.Points>(null)
  const raycasterRef = useRef(new THREE.Raycaster())
  const mouseRef = useRef(new THREE.Vector2())
  const positionsRef = useRef<Float32Array | null>(null)
  const sizesRef = useRef<Float32Array | null>(null)
  const velocitiesRef = useRef<Float32Array | null>(null)
  const opacitiesRef = useRef<Float32Array | null>(null)
  const worldMousePosRef = useRef(new THREE.Vector3())
  const burstStateRef = useRef<{
    burstStartTime: number[]
    burstDuration: number[]
    originalSize: number[]
    hasCollided: boolean[]
    shimmerIntensity: number[]
    shouldBurst: boolean[]
    lastCollisionTime: number[]
  }>({
    burstStartTime: [],
    burstDuration: [],
    originalSize: [],
    hasCollided: [],
    shimmerIntensity: [],
    shouldBurst: [],
    lastCollisionTime: [],
  })

  const spatialGridRef = useRef<Map<number, number[]>>(new Map())
  const { size, camera } = useThree()
  const collisionRadius = 15
  const particleCollisionRadius = 5
  const gridCellSize = 10
  const [buffersReady, setBuffersReady] = useState(false)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  useEffect(() => {
    const particleCount = 1000
    const positions = new Float32Array(particleCount * 3)
    const sizes = new Float32Array(particleCount)
    const velocities = new Float32Array(particleCount * 3)
    const opacities = new Float32Array(particleCount)

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 200
      positions[i * 3 + 1] = (Math.random() - 0.5) * 200
      positions[i * 3 + 2] = Math.random() * 400 - 200

      sizes[i] = Math.random() * 0.5 + 0.1

      velocities[i * 3] = (Math.random() - 0.5) * 0.4
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.4
      velocities[i * 3 + 2] = Math.random() * 0.2 + 0.08

      opacities[i] = Math.random() * 0.5 + 0.4
    }

    positionsRef.current = positions
    sizesRef.current = sizes
    velocitiesRef.current = velocities
    opacitiesRef.current = opacities

    const burstState = burstStateRef.current
    burstState.burstStartTime = new Array(particleCount).fill(-1)
    burstState.burstDuration = new Array(particleCount).fill(0)
    burstState.originalSize = new Array(particleCount).fill(0).map(() => Math.random() * 0.5 + 0.1)
    burstState.hasCollided = new Array(particleCount).fill(false)
    burstState.shimmerIntensity = new Array(particleCount).fill(0)
    burstState.shouldBurst = new Array(particleCount).fill(false)
    burstState.lastCollisionTime = new Array(particleCount).fill(-1)
    setBuffersReady(true)
  }, [])

  const getGridKey = (x: number, y: number, z: number): number => {
    const gridX = Math.floor(x / gridCellSize)
    const gridY = Math.floor(y / gridCellSize)
    const gridZ = Math.floor(z / gridCellSize)
    // Encode 3D coordinates into a single number using bit shifting
    return ((gridX & 0xfff) << 20) | ((gridY & 0xfff) << 10) | (gridZ & 0xfff)
  }

  const getNeighboringCellKeys = (x: number, y: number, z: number): number[] => {
    const gridX = Math.floor(x / gridCellSize)
    const gridY = Math.floor(y / gridCellSize)
    const gridZ = Math.floor(z / gridCellSize)
    const keys: number[] = []

    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        for (let dz = -1; dz <= 1; dz++) {
          keys.push((((gridX + dx) & 0xfff) << 20) | (((gridY + dy) & 0xfff) << 10) | ((gridZ + dz) & 0xfff))
        }
      }
    }
    return keys
  }

  const shouldTriggerBurst = (): boolean => {
    return Math.random() < 0.5
  }

  const respawnParticle = (positions: Float32Array, i: number) => {
    positions[i * 3] = (Math.random() - 0.5) * 200
    positions[i * 3 + 1] = (Math.random() - 0.5) * 200
    positions[i * 3 + 2] = 250
  }

  useFrame(() => {
    if (!ref.current || !positionsRef.current || !velocitiesRef.current) return

    const positions = positionsRef.current
    const velocities = velocitiesRef.current
    const sizes = sizesRef.current
    const particleCount = positions.length / 3
    const burstState = burstStateRef.current
    const currentTime = Date.now() / 1000

    raycasterRef.current.setFromCamera(mouseRef.current, camera)
    raycasterRef.current.ray.at(50, worldMousePosRef.current)

    const baseSpeed = 2.0
    const spatialGrid = spatialGridRef.current
    spatialGrid.clear()

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3 + 2] -= baseSpeed + velocities[i * 3 + 2] * 0.1
      positions[i * 3] += velocities[i * 3]
      positions[i * 3 + 1] += velocities[i * 3 + 1]

      if (positions[i * 3 + 2] < -200) {
        respawnParticle(positions, i)
        burstState.hasCollided[i] = false
      }

      const gridKey = getGridKey(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2])
      if (!spatialGrid.has(gridKey)) {
        spatialGrid.set(gridKey, [])
      }
      spatialGrid.get(gridKey)!.push(i)

      const dx = positions[i * 3] - worldMousePosRef.current.x
      const dy = positions[i * 3 + 1] - worldMousePosRef.current.y
      const dz = positions[i * 3 + 2] - worldMousePosRef.current.z
      const distance = Math.sqrt(dx * dx + dy * dy + dz * dz)

      if (distance < collisionRadius && !burstState.hasCollided[i]) {
        burstState.hasCollided[i] = true
        burstState.lastCollisionTime[i] = currentTime
        if (shouldTriggerBurst()) {
          burstState.shouldBurst[i] = true
          burstState.burstStartTime[i] = currentTime
          burstState.burstDuration[i] = Math.random() * 0.3 + 0.2
          burstState.shimmerIntensity[i] = 1
        }
      }

      const neighboringKeys = getNeighboringCellKeys(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2])
      const checkedParticles = new Set<number>()

      for (const cellKey of neighboringKeys) {
        const cellParticles = spatialGrid.get(cellKey)
        if (!cellParticles) continue

        for (const j of cellParticles) {
          if (i === j || checkedParticles.has(j)) continue
          checkedParticles.add(j)

          const dx2 = positions[i * 3] - positions[j * 3]
          const dy2 = positions[i * 3 + 1] - positions[j * 3 + 1]
          const dz2 = positions[i * 3 + 2] - positions[j * 3 + 2]
          const distance2 = Math.sqrt(dx2 * dx2 + dy2 * dy2 + dz2 * dz2)

          if (distance2 < particleCollisionRadius) {
            const cooldownTime = 0.1
            if (currentTime - burstState.lastCollisionTime[i] > cooldownTime && shouldTriggerBurst()) {
              if (!burstState.hasCollided[i]) {
                burstState.shouldBurst[i] = true
                burstState.burstStartTime[i] = currentTime
                burstState.burstDuration[i] = Math.random() * 0.25 + 0.15
                burstState.hasCollided[i] = true
                burstState.shimmerIntensity[i] = 1.2
                burstState.lastCollisionTime[i] = currentTime
              }
            }
            if (currentTime - burstState.lastCollisionTime[j] > cooldownTime && shouldTriggerBurst()) {
              if (!burstState.hasCollided[j]) {
                burstState.shouldBurst[j] = true
                burstState.burstStartTime[j] = currentTime
                burstState.burstDuration[j] = Math.random() * 0.25 + 0.15
                burstState.hasCollided[j] = true
                burstState.shimmerIntensity[j] = 1.2
                burstState.lastCollisionTime[j] = currentTime
              }
            }
          }
        }
      }

      if (burstState.burstStartTime[i] > 0 && burstState.shouldBurst[i]) {
        const timeSinceBurst = currentTime - burstState.burstStartTime[i]
        const burstProgress = Math.min(timeSinceBurst / burstState.burstDuration[i], 1)

        if (burstProgress < 1) {
          const shimmer = Math.sin(burstProgress * Math.PI * 4) * 0.5 + 0.5
          sizes[i] = burstState.originalSize[i] * (1 + burstProgress * 30 + shimmer * 0.5)
        } else {
          respawnParticle(positions, i)
          sizes[i] = burstState.originalSize[i]
          burstState.burstStartTime[i] = -1
          burstState.hasCollided[i] = false
          burstState.shouldBurst[i] = false
          burstState.shimmerIntensity[i] = 0
        }
      } else {
        sizes[i] = burstState.originalSize[i]
      }
    }

    if (ref.current.geometry.attributes.size) {
      ref.current.geometry.attributes.size.needsUpdate = true
    }
    if (ref.current.geometry.attributes.opacity) {
      ref.current.geometry.attributes.opacity.needsUpdate = true
    }
    ref.current.geometry.attributes.position.needsUpdate = true

    ref.current.rotation.x = mouseRef.current.y * 0.2
    ref.current.rotation.y = mouseRef.current.x * 0.2
  })

  if (!buffersReady) return null

  return (
  <points ref={ref}>
    <bufferGeometry>
      <bufferAttribute
        attach="attributes-position"
        array={positionsRef.current!}
        count={positionsRef.current!.length / 3}
        itemSize={3}
      />
      <bufferAttribute
        attach="attributes-size"
        array={sizesRef.current!}
        count={sizesRef.current!.length}
        itemSize={1}
      />
      <bufferAttribute
        attach="attributes-opacity"
        array={opacitiesRef.current!}
        count={opacitiesRef.current!.length}
        itemSize={1}
  　　　/>
    </bufferGeometry>
    <shaderMaterial
      transparent={true}
      blending={THREE.AdditiveBlending}
      depthWrite={false}
      fragmentShader={fragmentShader}
      vertexShader={vertexShader}
      uniforms={{
        color: { value: new THREE.Color("#D5370B") },
      }}
    />
  </points>
　);
}

export function ThreeDBackground() {
  return (
    <div className="fixed inset-0 -z-10 h-screen w-screen overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 50], fov: 75 }}
        gl={{ antialias: true, alpha: true }}
        style={{ width: "100%", height: "100%" }}
      >
        <color attach="background" args={["#263044"]} />
        <Starfield />
      </Canvas>
    </div>
  )
}
