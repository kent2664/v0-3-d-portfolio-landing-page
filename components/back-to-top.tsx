"use client"

import { useEffect, useState, useRef } from "react"
import { ArrowUp } from "lucide-react"
import { Canvas, useFrame } from "@react-three/fiber"
import { motion } from "framer-motion"
import * as THREE from "three"

function Particles({ scrollProgress }: { scrollProgress: number }) {
  const particlesRef = useRef<THREE.Points>(null)
  const maxParticles = 40 // Reduced from 80 for better spacing with larger particles
  const particleCount = Math.floor(maxParticles * scrollProgress) // Density synced to scroll progress
  
  const positions = useRef(
    new Float32Array(
      Array.from({ length: maxParticles * 3 }, (_, i) => {
        // Initialize Y position from top (1.5 to 2.0) instead of spread across entire space
        if (i % 3 === 1) return 1.8 + Math.random() * 0.4
        // Constrain X and Z to button viewport (-1.2 to 1.2)
        return (Math.random() - 0.5) * 2.4
      })
    )
  )
  
  const velocities = useRef(
    new Float32Array(
      Array.from({ length: maxParticles * 3 }, (_, i) => {
        // Only Y velocity matters (falling down)
        if (i % 3 === 1) return Math.random() * 0.025 + 0.015
        return 0
      })
    )
  )
  
  const settled = useRef(new Array(maxParticles).fill(false))

  useFrame(() => {
    if (!particlesRef.current) return
    
    const posArray = particlesRef.current.geometry.attributes.position.array as Float32Array
    
    for (let i = 0; i < maxParticles; i++) {
      const i3 = i * 3
      
      // Show/hide particles based on scroll progress
      if (i > particleCount) {
        // Inactive particles stay at top
        posArray[i3] = (Math.random() - 0.5) * 2.4
        posArray[i3 + 1] = 1.8
        posArray[i3 + 2] = (Math.random() - 0.5) * 2.4
        settled.current[i] = false
        continue
      }
      
      if (!settled.current[i]) {
        // Particles fall down
        posArray[i3 + 1] -= velocities.current[i3 + 1]
        
        // Constrain X and Z to stay within button bounds
        if (Math.abs(posArray[i3]) > 1.2) posArray[i3] *= 0.95
        if (Math.abs(posArray[i3 + 2]) > 1.2) posArray[i3 + 2] *= 0.95
        
        // Accumulate at bottom when scroll is near end
        if (scrollProgress > 0.85 && posArray[i3 + 1] < -0.5) {
          posArray[i3 + 1] = Math.max(posArray[i3 + 1], -1.2)
          settled.current[i] = true
        }
        
        // Reset particle if it falls too far
        if (posArray[i3 + 1] < -1.5) {
          posArray[i3 + 1] = 1.8 + Math.random() * 0.4
          posArray[i3] = (Math.random() - 0.5) * 2.4
          posArray[i3 + 2] = (Math.random() - 0.5) * 2.4
          settled.current[i] = false
        }
      }
    }
    
    particlesRef.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={maxParticles}
          array={positions.current}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.85}
        color="#ff7846"
        transparent
        opacity={1}
        sizeAttenuation
        emissive="#ff7846"
        emissiveIntensity={0.8}
      />
    </points>
  )
}

export function BackToTop() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      const currentScroll = window.scrollY
      const progress = Math.min(currentScroll / scrollHeight, 1)
      
      setScrollProgress(progress)
      setIsVisible(currentScroll > 300)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  if (!isVisible) return null

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="fixed bottom-8 right-8 z-50"
    >
      <button
        onClick={scrollToTop}
        className="relative w-16 h-16 rounded-full overflow-hidden backdrop-blur-sm border-2 border-accent/40 hover:border-accent transition-all duration-300 group"
        aria-label="Back to top"
        style={{
          background: scrollProgress >= 0.95 
            ? 'radial-gradient(circle, rgba(213, 55, 11, 1) 0%, rgba(213, 55, 11, 0.85) 100%)' 
            : 'rgba(38, 48, 68, 0.6)',
          boxShadow: scrollProgress >= 0.95 
            ? '0 0 30px rgba(213, 55, 11, 0.8), inset 0 0 20px rgba(255, 255, 255, 0.1)' 
            : '0 0 10px rgba(213, 55, 11, 0.3)'
        }}
      >
        {/* 3D Canvas Background */}
        <div className="absolute inset-0 pointer-events-none">
          <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
            <Particles scrollProgress={scrollProgress} />
          </Canvas>
        </div>
        
        {/* Glow Layer */}
        <motion.div
          className="absolute inset-0 rounded-full opacity-0"
          animate={
            scrollProgress >= 0.85
              ? {
                  boxShadow: [
                    "0 0 0px rgba(213, 55, 11, 0)",
                    "0 0 20px rgba(213, 55, 11, 0.6)",
                    "0 0 0px rgba(213, 55, 11, 0)",
                  ],
                }
              : {}
          }
          transition={{
            duration: 1.5,
            repeat: scrollProgress >= 0.85 ? Infinity : 0,
            ease: "easeInOut",
          }}
        />
        
        {/* Arrow Icon */}
        <div className="relative z-10 flex items-center justify-center w-full h-full">
          <ArrowUp 
            className="w-6 h-6 transition-transform group-hover:-translate-y-1" 
            style={{ 
              color: scrollProgress >= 0.95 ? '#ffffff' : '#d5370b' 
            }}
          />
        </div>
      </button>
    </motion.div>
  )
}
