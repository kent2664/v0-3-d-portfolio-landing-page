"use client"

import { useEffect, useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Points, PointMaterial } from "@react-three/drei"

const ParticleField = () => {
  const ref = useRef<any>(null)
  const mouseX = useRef(0)
  const mouseY = useRef(0)
  const positions = useRef<Float32Array | null>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.current = (e.clientX / window.innerWidth) * 2 - 1
      mouseY.current = -(e.clientY / window.innerHeight) * 2 + 1
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  useFrame(() => {
    if (!ref.current) return
    ref.current.rotation.x = mouseY.current * 0.3
    ref.current.rotation.y = mouseX.current * 0.3
  })

  useEffect(() => {
    const particleCount = 5000
    const posArray = new Float32Array(particleCount * 3)

    for (let i = 0; i < particleCount * 3; i += 3) {
      // Random point in sphere using standard math
      let x, y, z, magnitude
      do {
        x = Math.random() * 2 - 1
        y = Math.random() * 2 - 1
        z = Math.random() * 2 - 1
        magnitude = Math.sqrt(x * x + y * y + z * z)
      } while (magnitude > 1.2)

      posArray[i] = x
      posArray[i + 1] = y
      posArray[i + 2] = z
    }

    positions.current = posArray
  }, [])

  return (
    <Points ref={ref} positions={positions.current} stride={3} frustumCulled={false}>
      <PointMaterial transparent color="#D5370B" size={0.006} sizeAttenuation={true} depthWrite={false} />
    </Points>
  )
}

export function ThreeDBackground() {
  return (
    <div className="fixed inset-0 z-0 h-screen w-screen">
      <Canvas
        camera={{ position: [0, 0, 1], fov: 75 }}
        gl={{ antialias: true, alpha: true }}>
        <color attach="background" args={["#263044"]} />
        <ParticleField />
      </Canvas>
    </div>
  )
}
