"use client"

import { useRef, useState } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, PerspectiveCamera } from "@react-three/drei"
import type * as THREE from "three"
import { motion } from "framer-motion"

type Category = "visuals" | "artifact" | "compose"

interface InteractiveObjectProps {
  position: [number, number, number]
  category: Category
  selectedCategory: Category
  onSelect: (category: Category) => void
  geometry: "camera" | "shapes" | "guitar"
}

function InteractiveObject({ position, category, selectedCategory, onSelect, geometry }: InteractiveObjectProps) {
  const meshRef = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState(false)
  const isSelected = selectedCategory === category

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005
      if (hovered) {
        meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.1
      } else {
        meshRef.current.position.y = position[1]
      }
    }
  })

  const color = isSelected ? "#D5370B" : hovered ? "#FF6B35" : "#ffffff"

  return (
    <group
      ref={meshRef}
      position={position}
      onClick={() => onSelect(category)}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {geometry === "camera" && (
        <group>
          <mesh>
            <boxGeometry args={[1.5, 1, 0.8]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={isSelected ? 0.5 : 0.2} />
          </mesh>
          <mesh position={[0.6, 0.3, 0]}>
            <cylinderGeometry args={[0.3, 0.3, 0.6, 32]} rotation={[0, 0, Math.PI / 2]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={isSelected ? 0.5 : 0.2} />
          </mesh>
        </group>
      )}
      {geometry === "shapes" && (
        <group>
          <mesh position={[0, 0.5, 0]}>
            <octahedronGeometry args={[0.6]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={isSelected ? 0.5 : 0.2} wireframe />
          </mesh>
          <mesh position={[0, -0.3, 0]}>
            <torusGeometry args={[0.4, 0.15, 16, 32]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={isSelected ? 0.5 : 0.2} />
          </mesh>
        </group>
      )}
      {geometry === "guitar" && (
        <group>
          <mesh position={[0, 0.5, 0]}>
            <capsuleGeometry args={[0.3, 1.5, 8, 16]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={isSelected ? 0.5 : 0.2} />
          </mesh>
          <mesh position={[0, -0.5, 0]}>
            <boxGeometry args={[0.8, 1, 0.2]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={isSelected ? 0.5 : 0.2} />
          </mesh>
        </group>
      )}
    </group>
  )
}

interface Gallery3DNavProps {
  onCategoryChange: (category: Category) => void
}

export function Gallery3DNav({ onCategoryChange }: Gallery3DNavProps) {
  const [selectedCategory, setSelectedCategory] = useState<Category>("visuals")

  const handleSelect = (category: Category) => {
    setSelectedCategory(category)
    onCategoryChange(category)
  }

  const categories = [
    {
      id: "visuals" as Category,
      label: "Visuals",
      geometry: "camera" as const,
      position: [-3, 0, 0] as [number, number, number],
    },
    {
      id: "artifact" as Category,
      label: "3D Artifact",
      geometry: "shapes" as const,
      position: [0, 0, 0] as [number, number, number],
    },
    {
      id: "compose" as Category,
      label: "Compose",
      geometry: "guitar" as const,
      position: [3, 0, 0] as [number, number, number],
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative h-[400px] w-full overflow-hidden rounded-lg bg-background/50 backdrop-blur-sm"
    >
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 8]} />
        <OrbitControls enableZoom={false} enablePan={false} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        {categories.map((cat) => (
          <InteractiveObject
            key={cat.id}
            position={cat.position}
            category={cat.id}
            selectedCategory={selectedCategory}
            onSelect={handleSelect}
            geometry={cat.geometry}
          />
        ))}
      </Canvas>

      <div className="pointer-events-none absolute bottom-8 left-0 right-0 flex justify-center gap-8">
        {categories.map((cat) => (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + categories.indexOf(cat) * 0.1 }}
            className={`text-center ${selectedCategory === cat.id ? "text-accent" : "text-muted-foreground"}`}
          >
            <p className="font-mono text-sm font-semibold uppercase tracking-wider">{cat.label}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
