"use client"

import { useEffect, useRef } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import * as THREE from "three"

const trailVertexShader = `
  attribute float trailLife;
  attribute float trailTwinkle;
  varying float vTrailLife;
  varying float vTwinkle;
  
  void main() {
    vTrailLife = trailLife;
    vTwinkle = trailTwinkle;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = 2.5 * (300.0 / length(mvPosition.xyz)) * vTrailLife;
    gl_Position = projectionMatrix * mvPosition;
  }
`

const trailFragmentShader = `
  varying float vTrailLife;
  varying float vTwinkle;
  uniform vec3 trailColor;
  
  void main() {
    vec2 center = gl_PointCoord - vec2(0.5, 0.5);
    float dist = length(center);
    if (dist > 0.5) discard;
    
    float softGlow = (1.0 - dist * dist) * 1.5;
    float twinkleEffect = vTwinkle * 0.6 + 0.4; // Oscillates between 0.4 and 1.0
    
    gl_FragColor = vec4(trailColor, vTrailLife * softGlow * twinkleEffect * 0.6);
  }
`

export function MouseTrail() {
  const pointsRef = useRef<THREE.Points>(null)
  const mouseRef = useRef(new THREE.Vector2())
  const lastMousePosRef = useRef(new THREE.Vector2())
  const trailParticlesRef = useRef<
    {
      pos: THREE.Vector3
      velocity: THREE.Vector3
      createdAt: number
      life: number
      twinkleOffset: number
    }[]
  >([])
  const positionsRef = useRef<Float32Array | null>(null)
  const lifetimesRef = useRef<Float32Array | null>(null)
  const twinklesRef = useRef<Float32Array | null>(null)
  const raycasterRef = useRef(new THREE.Raycaster())
  const { camera } = useThree()
  const maxTrailParticles = 3000
  const trailLifetime = 0.5 // seconds

  // Initialize buffers
  useEffect(() => {
    positionsRef.current = new Float32Array(maxTrailParticles * 3)
    lifetimesRef.current = new Float32Array(maxTrailParticles)
    twinklesRef.current = new Float32Array(maxTrailParticles)
  }, [])

  // Track mouse movement
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1

      const distance = mouseRef.current.distanceTo(lastMousePosRef.current)
      if (distance > 0.01) {
        const steps = Math.ceil(distance / 0.01)
        for (let i = 0; i < steps; i++) {
          const t = i / steps
          const intermediatePos = new THREE.Vector2().lerpVectors(lastMousePosRef.current, mouseRef.current, t)

          // Project 2D mouse to 3D world space
          raycasterRef.current.setFromCamera(intermediatePos, camera)
          const worldPos = new THREE.Vector3()
          raycasterRef.current.ray.at(50, worldPos)

          worldPos.x += (Math.random() - 0.5) * 2
          worldPos.y += (Math.random() - 0.5) * 2
          worldPos.z += (Math.random() - 0.5) * 1

          const velocity = new THREE.Vector3(
            (Math.random() - 0.5) * 15,
            (Math.random() - 0.5) * 15,
            (Math.random() - 0.5) * 5,
          )

          trailParticlesRef.current.push({
            pos: worldPos,
            velocity,
            createdAt: Date.now(),
            life: 1,
            twinkleOffset: Math.random() * Math.PI * 2,
          })
        }

        lastMousePosRef.current.copy(mouseRef.current)
      }
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [camera])

  useFrame((state) => {
    if (!pointsRef.current || !positionsRef.current || !lifetimesRef.current || !twinklesRef.current) return

    const positions = positionsRef.current
    const lifetimes = lifetimesRef.current
    const twinkles = twinklesRef.current
    const trailParticles = trailParticlesRef.current
    const currentTime = state.clock.elapsedTime

    for (let i = trailParticles.length - 1; i >= 0; i--) {
      const particle = trailParticles[i]
      const age = (Date.now() - particle.createdAt) / 1000
      particle.life = Math.max(0, 1 - age / trailLifetime)

      particle.pos.add(particle.velocity.clone().multiplyScalar(0.016)) // ~16ms per frame

      if (particle.life <= 0) {
        trailParticles.splice(i, 1)
      }
    }

    // Update geometry with active particles
    const activeCount = Math.min(trailParticles.length, maxTrailParticles)
    for (let i = 0; i < activeCount; i++) {
      const particle = trailParticles[trailParticles.length - activeCount + i]
      positions[i * 3] = particle.pos.x
      positions[i * 3 + 1] = particle.pos.y
      positions[i * 3 + 2] = particle.pos.z
      lifetimes[i] = particle.life

      twinkles[i] = Math.sin(
        (state.clock.elapsedTime - (Date.now() - particle.createdAt) / 1000) * 8 + particle.twinkleOffset,
      )
    }

    // Update geometry
    if (pointsRef.current.geometry.attributes.position) {
      pointsRef.current.geometry.attributes.position.needsUpdate = true
      pointsRef.current.geometry.setDrawRange(0, activeCount)
    }
    if (pointsRef.current.geometry.attributes.trailLife) {
      pointsRef.current.geometry.attributes.trailLife.needsUpdate = true
    }
    if (pointsRef.current.geometry.attributes.trailTwinkle) {
      pointsRef.current.geometry.attributes.trailTwinkle.needsUpdate = true
    }
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry drawRange={{ start: 0, count: maxTrailParticles }}>
        <bufferAttribute
          attach="attributes-position"
          array={positionsRef.current || new Float32Array(maxTrailParticles * 3)}
          count={maxTrailParticles}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-trailLife"
          array={lifetimesRef.current || new Float32Array(maxTrailParticles)}
          count={maxTrailParticles}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-trailTwinkle"
          array={twinklesRef.current || new Float32Array(maxTrailParticles)}
          count={maxTrailParticles}
          itemSize={1}
        />
      </bufferGeometry>
      <shaderMaterial
        transparent={true}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        fragmentShader={trailFragmentShader}
        vertexShader={trailVertexShader}
        uniforms={{
          trailColor: { value: new THREE.Color("#B8860B") },
        }}
      />
    </points>
  )
}
