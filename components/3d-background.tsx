"use client"

import { useEffect, useRef, useState } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import type * as THREE from "three"

const Starfield = () => {
  const ref = useRef<THREE.Points>(null)
  const mouseX = useRef(0)
  const mouseY = useRef(0)
  const positionsRef = useRef<Float32Array | null>(null)
  const sizesRef = useRef<Float32Array | null>(null)
  const velocitiesRef = useRef<Float32Array | null>(null)
  const opacitiesRef = useRef<Float32Array | null>(null)
  const burstStateRef = useRef<{
    burstStartTime: number[]
    burstDuration: number[]
    originalSize: number[]
    hasCollided: boolean[]
    shimmerIntensity: number[]
  }>({
    burstStartTime: [],
    burstDuration: [],
    originalSize: [],
    hasCollided: [],
    shimmerIntensity: [],
  })
  const { size } = useThree()
  const collisionRadius = 15
  const particleCollisionRadius = 2.5
  const [buffersReady, setBuffersReady] = useState(false)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.current = (e.clientX / window.innerWidth) * 2 - 1
      mouseY.current = -(e.clientY / window.innerHeight) * 2 + 1
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  useEffect(() => {
    const particleCount = 10000
    const positions = new Float32Array(particleCount * 3)
    const sizes = new Float32Array(particleCount)
    const velocities = new Float32Array(particleCount * 3)
    const opacities = new Float32Array(particleCount)

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 200
      positions[i * 3 + 1] = (Math.random() - 0.5) * 200
      positions[i * 3 + 2] = Math.random() * 400 - 200

      sizes[i] = Math.random() * 0.5 + 0.1

      velocities[i * 3] = (Math.random() - 0.5) * 0.2
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.2
      velocities[i * 3 + 2] = Math.random() * 0.15 + 0.05

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
    setBuffersReady(true)
  }, [])

  useFrame(() => {
    if (!ref.current || !positionsRef.current || !velocitiesRef.current) return

    const positions = positionsRef.current
    const velocities = velocitiesRef.current
    const sizes = sizesRef.current
    const opacities = opacitiesRef.current
    const particleCount = positions.length / 3
    const burstState = burstStateRef.current
    const currentTime = Date.now() / 1000

    const mouseInfluence = Math.sqrt(mouseX.current ** 2 + mouseY.current ** 2)
    const baseSpeed = 2.0
    const speed = baseSpeed + mouseInfluence * 0.2

    for (let i = 0; i < particleCount; i++) {
      // Update particle position
      positions[i * 3 + 2] -= speed + velocities[i * 3 + 2] * mouseInfluence
      positions[i * 3] += mouseX.current * 0.05
      positions[i * 3 + 1] += mouseY.current * 0.05

      // Reset if particle goes too far back
      if (positions[i * 3 + 2] < -200) {
        positions[i * 3 + 2] = 200
        positions[i * 3] = (Math.random() - 0.5) * 200
        positions[i * 3 + 1] = (Math.random() - 0.5) * 200
        burstState.hasCollided[i] = false
      }

      // Check collision with mouse cursor
      const dx = positions[i * 3] - mouseX.current * 50
      const dy = positions[i * 3 + 1] - mouseY.current * 50
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance < collisionRadius && !burstState.hasCollided[i]) {
        burstState.burstStartTime[i] = currentTime
        burstState.burstDuration[i] = Math.random() * 0.3 + 0.2
        burstState.hasCollided[i] = true
        burstState.shimmerIntensity[i] = 1
      }

      for (let j = i + 1; j < particleCount; j++) {
        const dx2 = positions[i * 3] - positions[j * 3]
        const dy2 = positions[i * 3 + 1] - positions[j * 3 + 1]
        const dz2 = positions[i * 3 + 2] - positions[j * 3 + 2]
        const distance2 = Math.sqrt(dx2 * dx2 + dy2 * dy2 + dz2 * dz2)

        if (distance2 < particleCollisionRadius) {
          // Trigger burst for both particles
          if (!burstState.hasCollided[i]) {
            burstState.burstStartTime[i] = currentTime
            burstState.burstDuration[i] = Math.random() * 0.25 + 0.15
            burstState.hasCollided[i] = true
            burstState.shimmerIntensity[i] = 1.2
          }
          if (!burstState.hasCollided[j]) {
            burstState.burstStartTime[j] = currentTime
            burstState.burstDuration[j] = Math.random() * 0.25 + 0.15
            burstState.hasCollided[j] = true
            burstState.shimmerIntensity[j] = 1.2
          }
        }
      }

      // Handle burst animation with shimmer effect
      if (burstState.burstStartTime[i] > 0) {
        const timeSinceBurst = currentTime - burstState.burstStartTime[i]
        const burstProgress = Math.min(timeSinceBurst / burstState.burstDuration[i], 1)

        if (burstProgress < 1) {
          const shimmer = Math.sin(burstProgress * Math.PI * 4) * 0.5 + 0.5
          sizes[i] = burstState.originalSize[i] * (1 + burstProgress * 4 + shimmer * 0.5)
          opacities[i] = Math.max(0, 1 - burstProgress * 1.2) * (1 + shimmer * 0.3)
        } else {
          // Respawn particle after burst completes
          positions[i * 3] = (Math.random() - 0.5) * 200
          positions[i * 3 + 1] = (Math.random() - 0.5) * 200
          positions[i * 3 + 2] = 200
          sizes[i] = burstState.originalSize[i]
          opacities[i] = Math.random() * 0.5 + 0.4
          burstState.burstStartTime[i] = -1
          burstState.hasCollided[i] = false
          burstState.shimmerIntensity[i] = 0
        }
      } else {
        sizes[i] = burstState.originalSize[i]
        opacities[i] = Math.random() * 0.5 + 0.4
      }
    }

    ref.current.geometry.attributes.position.needsUpdate = true
    ref.current.geometry.attributes.size.needsUpdate = true

    ref.current.rotation.x = mouseY.current * 0.2
    ref.current.rotation.y = mouseX.current * 0.2
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
      </bufferGeometry>
      <pointsMaterial
        size={0.5}
        sizeAttenuation={true}
        color="#D5370B"
        transparent={true}
        opacity={0.8}
        depthWrite={false}
        sizeRange={[0.1, 2]}
      />
    </points>
  )
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
