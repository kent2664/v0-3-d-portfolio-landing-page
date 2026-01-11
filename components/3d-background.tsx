"use client"

import { useEffect, useRef, useState } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import * as THREE from "three"
import { MouseTrail } from "./mouse-trail"

const vertexShader = `
  attribute float size;
  attribute float opacity;
  attribute float depth;
  varying float vOpacity;
  varying float vDepth;
  
  void main() {
    vOpacity = opacity;
    vDepth = depth;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    
    float perspectiveScale = 400.0 / length(mvPosition.xyz);
    // Additional depth-based scaling to make vanishing point more pronounced
    float depthScale = 1.0 - clamp((500.0 + vDepth) / 1000.0, 0.0, 0.85);
    gl_PointSize = size * perspectiveScale * (0.15 + depthScale);
    
    gl_Position = projectionMatrix * mvPosition;
  }
`

const fragmentShader = `
  varying float vOpacity;
  varying float vDepth;
  uniform vec3 color;
  uniform vec3 backgroundColor;
  
  void main() {
    vec2 center = gl_PointCoord - vec2(0.5, 0.5);
    float dist = length(center);
    if (dist > 0.5) discard;
    
    float softEdge = 1.0 - smoothstep(0.4, 0.5, dist);
    
    // Particles fade much more aggressively as they recede into distance
    float depthFog = mix(1.0, 0.05, clamp((500.0 + vDepth) / 1000.0, 0.0, 0.95));
    
    // Additional dimming for far particles to create "infinite" feeling
    float distanceDim = 1.0 - smoothstep(-400.0, -500.0, vDepth);
    
    float finalAlpha = vOpacity * softEdge * depthFog * distanceDim;
    
    gl_FragColor = vec4(color, finalAlpha);
  }
`

const Starfield = () => {
  const ref = useRef<THREE.Points>(null)
  const raycasterRef = useRef(new THREE.Raycaster())
  const mouseRef = useRef(new THREE.Vector2())
  const positionsRef = useRef<Float32Array | null>(null)
  const sizesRef = useRef<Float32Array | null>(null)
  const velocitiesRef = useRef<Float32Array | null>(null)
  const opacitiesRef = useRef<Float32Array | null>(null)
  const depthsRef = useRef<Float32Array | null>(null)
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
  const collisionRadius = 8
  const particleCollisionRadius = 1
  const gridCellSize = 50
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
    const particleCount = 3000
    const positions = new Float32Array(particleCount * 3)
    const sizes = new Float32Array(particleCount)
    const velocities = new Float32Array(particleCount * 3)
    const opacities = new Float32Array(particleCount)
    const depths = new Float32Array(particleCount)

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 600
      positions[i * 3 + 1] = (Math.random() - 0.5) * 600
      positions[i * 3 + 2] = Math.random() * 1000 - 500

      sizes[i] = Math.random() * 3.0 + 0.6

      velocities[i * 3] = (Math.random() - 0.5) * 0.4
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.4
      velocities[i * 3 + 2] = Math.random() * 0.5 + 0.2

      opacities[i] = Math.random() * 0.7 + 0.5
      depths[i] = positions[i * 3 + 2]
    }

    positionsRef.current = positions
    sizesRef.current = sizes
    velocitiesRef.current = velocities
    opacitiesRef.current = opacities
    depthsRef.current = depths

    const burstState = burstStateRef.current
    burstState.burstStartTime = new Array(particleCount).fill(-1)
    burstState.burstDuration = new Array(particleCount).fill(0)
    burstState.originalSize = new Array(particleCount).fill(0).map(() => Math.random() * 3.0 + 0.6)
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
    positions[i * 3] = (Math.random() - 0.5) * 600
    positions[i * 3 + 1] = (Math.random() - 0.5) * 600
    positions[i * 3 + 2] = 500
  }

  useFrame((state) => {
    if (!ref.current || !positionsRef.current || !velocitiesRef.current) return

    const positions = positionsRef.current
    const velocities = velocitiesRef.current
    const sizes = sizesRef.current
    const depths = depthsRef.current
    const particleCount = positions.length / 3
    const burstState = burstStateRef.current
    const currentTime = state.clock.elapsedTime

    raycasterRef.current.setFromCamera(mouseRef.current, camera)
    raycasterRef.current.ray.at(50, worldMousePosRef.current)

    const baseSpeed = 2.0
    const spatialGrid = spatialGridRef.current
    spatialGrid.clear()

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3 + 2] -= baseSpeed + velocities[i * 3 + 2] * 0.1
      positions[i * 3] += velocities[i * 3]
      positions[i * 3 + 1] += velocities[i * 3 + 1]

      if (positions[i * 3 + 2] < -500) {
        respawnParticle(positions, i)
        burstState.hasCollided[i] = false
      }

      depths[i] = positions[i * 3 + 2]

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

        // Ease-out curve for smooth deceleration
        const easeOut = 1 - Math.pow(1 - burstProgress, 3)

        if (burstProgress < 1) {
          const shimmer = Math.sin(burstProgress * Math.PI * 4) * 0.5 + 0.5
          sizes[i] = burstState.originalSize[i] * (1 + easeOut * 30 + shimmer * 0.5)
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
    if (ref.current.geometry.attributes.depth) {
      ref.current.geometry.attributes.depth.needsUpdate = true
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
        <bufferAttribute
          attach="attributes-depth"
          array={depthsRef.current!}
          count={depthsRef.current!.length}
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
          color: { value: new THREE.Color("#ff7231") },
          backgroundColor: { value: new THREE.Color("#263044") },
        }}
      />
    </points>
  )
}

const Satellite = () => {
  const groupRef = useRef<THREE.Group>(null)
  const hitboxRef = useRef<THREE.Mesh>(null)
  const [orbitAngle, setOrbitAngle] = useState(0)
  const [isDestroyed, setIsDestroyed] = useState(false)
  const healthRef = useRef(100)
  const [visualHealth, setVisualHealth] = useState(100)
  const isHoveringRef = useRef(false)
  const [damageRedTint, setDamageRedTint] = useState(0)
  const debrisRef = useRef<Array<{ position: THREE.Vector3; velocity: THREE.Vector3; life: number }>>([])

  const handlePointerOver = () => {
    isHoveringRef.current = true
  }

  const handlePointerOut = () => {
    isHoveringRef.current = false
  }

  useFrame((state) => {
    if (!groupRef.current) return

    if (isHoveringRef.current && !isDestroyed && healthRef.current > 0) {
      healthRef.current = Math.max(healthRef.current - 10 * state.clock.deltaTime, 0)
      setVisualHealth(healthRef.current)

      const damageProgress = 1 - healthRef.current / 100
      setDamageRedTint(damageProgress * 0.8)

      if (healthRef.current <= 0 && !isDestroyed) {
        setIsDestroyed(true)
        for (let i = 0; i < 20; i++) {
          const theta = Math.random() * Math.PI * 2
          const phi = Math.random() * Math.PI
          const speed = 4 + Math.random() * 3
          debrisRef.current.push({
            position: groupRef.current.position.clone(),
            velocity: new THREE.Vector3(
              Math.sin(phi) * Math.cos(theta) * speed,
              Math.sin(phi) * Math.sin(theta) * speed,
              Math.cos(phi) * speed,
            ),
            life: 2,
          })
        }

        setTimeout(() => {
          healthRef.current = 100
          setVisualHealth(100)
          setIsDestroyed(false)
          setDamageRedTint(0)
          debrisRef.current = []
        }, 2000)
      }
    } else {
      setDamageRedTint((prev) => Math.max(prev - state.clock.deltaTime * 1.5, 0))
    }

    debrisRef.current = debrisRef.current.filter((debris) => {
      debris.life -= state.clock.deltaTime
      debris.position.add(debris.velocity.clone().multiplyScalar(state.clock.deltaTime))
      debris.velocity.multiplyScalar(0.97)
      return debris.life > 0
    })

    groupRef.current.scale.set(0.8, 0.8, 0.8)

    if (!isDestroyed) {
      const newAngle = orbitAngle + 0.0005
      setOrbitAngle(newAngle)

      const orbitRadius = 300
      groupRef.current.position.x = Math.cos(newAngle) * orbitRadius
      groupRef.current.position.y = Math.sin(newAngle * 0.5) * 80
      groupRef.current.position.z = -150

      groupRef.current.rotation.x += 0.0005
      groupRef.current.rotation.y += 0.001
      groupRef.current.rotation.z += 0.0003

      if (damageRedTint > 0) {
        const jitterIntensity = damageRedTint * 2
        groupRef.current.position.x += (Math.random() - 0.5) * jitterIntensity
        groupRef.current.position.y += (Math.random() - 0.5) * jitterIntensity
      }
    } else {
      const destroyProgress = Math.min((state.clock.elapsedTime % 2) / 2, 1)
      const shrinkScale = 0.8 * (1 - destroyProgress)
      groupRef.current.scale.set(shrinkScale, shrinkScale, shrinkScale)
    }
  })

  if (isDestroyed) {
    return null
  }

  const damageProgress = 1 - visualHealth / 100
  const emissiveIntensity = damageProgress * 0.5

  return (
    <group ref={groupRef}>
      <mesh ref={hitboxRef} onPointerOver={handlePointerOver} onPointerOut={handlePointerOut} visible={false}>
        <sphereGeometry args={[12, 16, 16]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      <mesh>
        <boxGeometry args={[6, 3.5, 3.5]} />
        <meshPhysicalMaterial
          color={`#${Math.round(139 + damageRedTint * 116)
            .toString(16)
            .padStart(2, "0")}${Math.round(134 + damageRedTint * 122)
            .toString(16)
            .padStart(2, "0")}${Math.round(128 + damageRedTint * 127)
            .toString(16)
            .padStart(2, "0")}`}
          metalness={0.95}
          roughness={0.25}
          clearcoat={0.8}
          clearcoatRoughness={0.2}
          emissive="#ff3333"
          emissiveIntensity={emissiveIntensity}
        />
      </mesh>

      <group position={[-5, 0, 0]}>
        <mesh position={[-8, 0, 0]}>
          <boxGeometry args={[16, 0.1, 7]} />
          <meshPhysicalMaterial
            color="#0d1b2a"
            metalness={0.7}
            roughness={0.35}
            emissive="#ff2222"
            emissiveIntensity={emissiveIntensity * 0.3}
          />
        </mesh>
        {[...Array(4)].map((_, i) => (
          <mesh key={`solar-left-${i}`} position={[-8 + i * 4, 0.15, 0]}>
            <boxGeometry args={[3.5, 0.05, 6.5]} />
            <meshPhysicalMaterial
              color="#1a3a4f"
              metalness={0.6}
              roughness={0.2}
              emissive="#ff1111"
              emissiveIntensity={emissiveIntensity * 0.2}
            />
          </mesh>
        ))}
      </group>

      <group position={[5, 0, 0]}>
        <mesh position={[8, 0, 0]}>
          <boxGeometry args={[16, 0.1, 7]} />
          <meshPhysicalMaterial
            color="#0d1b2a"
            metalness={0.7}
            roughness={0.35}
            emissive="#ff2222"
            emissiveIntensity={emissiveIntensity * 0.3}
          />
        </mesh>
        {[...Array(4)].map((_, i) => (
          <mesh key={`solar-right-${i}`} position={[8 - i * 4, 0.15, 0]}>
            <boxGeometry args={[3.5, 0.05, 6.5]} />
            <meshPhysicalMaterial
              color="#1a3a4f"
              metalness={0.6}
              roughness={0.2}
              emissive="#ff1111"
              emissiveIntensity={emissiveIntensity * 0.2}
            />
          </mesh>
        ))}
      </group>

      <group position={[0, 2.5, 0]}>
        <mesh position={[-1.5, 0, 0]}>
          <cylinderGeometry args={[0.15, 0.15, 8, 12]} />
          <meshPhysicalMaterial
            color="#d4af37"
            metalness={0.92}
            roughness={0.15}
            clearcoat={0.7}
            clearcoatRoughness={0.3}
          />
        </mesh>
        <mesh position={[1.5, 0, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 6.5, 12]} />
          <meshPhysicalMaterial
            color="#c0a028"
            metalness={0.9}
            roughness={0.18}
            clearcoat={0.7}
            clearcoatRoughness={0.3}
          />
        </mesh>
        <mesh position={[0, -0.5, 0]}>
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshPhysicalMaterial color="#8b7220" metalness={0.85} roughness={0.25} />
        </mesh>
      </group>

      <mesh position={[0, -2, 2.5]} rotation={[Math.PI / 6, 0, 0]}>
        <cylinderGeometry args={[2.5, 2.5, 0.4, 32]} />
        <meshPhysicalMaterial
          color="#d95a4d"
          metalness={0.88}
          roughness={0.2}
          emissive="#8b3a35"
          emissiveIntensity={emissiveIntensity * 0.2}
        />
      </mesh>
      {[...Array(3)].map((_, i) => (
        <mesh key={`dish-strut-${i}`} position={[Math.cos((i / 3) * Math.PI * 2) * 1.8, -1.2, 2.2]}>
          <cylinderGeometry args={[0.08, 0.08, 1.2, 8]} />
          <meshPhysicalMaterial color="#8b8680" metalness={0.85} roughness={0.3} />
        </mesh>
      ))}

      <mesh position={[0, 0, -2.2]}>
        <boxGeometry args={[4, 2.5, 0.15]} />
        <meshPhysicalMaterial
          color="#2a4a6a"
          metalness={0.7}
          roughness={0.4}
          emissive="#0a0a0a"
          emissiveIntensity={emissiveIntensity * 0.1}
        />
      </mesh>

      {[...Array(4)].map((_, i) => (
        <mesh key={`port-${i}`} position={[2.8, 1.2 - i * 0.8, 1.7]}>
          <cylinderGeometry args={[0.12, 0.15, 0.3, 8]} />
          <meshPhysicalMaterial color="#555555" metalness={0.7} roughness={0.35} />
        </mesh>
      ))}

      <pointLight position={[6, 3, 4]} color="#ffffff" intensity={12} distance={50} decay={1.5} />
      <pointLight position={[-6, -2, -4]} color="#ff6b4a" intensity={6} distance={40} decay={1.5} />
      <pointLight position={[0, -3, 3]} color="#4a9eff" intensity={4} distance={35} decay={1.5} />
    </group>
  )
}

export function ThreeDBackground() {
  return (
    <div className="fixed inset-0 -z-10 h-screen w-screen overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 50], fov: 80 }}
        gl={{ antialias: true, alpha: true }}
        style={{ width: "100%", height: "100%" }}
      >
        <color attach="background" args={["#263044"]} />
        <ambientLight intensity={0.3} />
        <directionalLight position={[100, 100, 50]} intensity={1.5} color="#ffffff" />
        <Starfield />
        <MouseTrail />
        <Satellite />
      </Canvas>
    </div>
  )
}
