"use client"

import { useRef, useState } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, PerspectiveCamera, Environment, ContactShadows } from "@react-three/drei"
import * as THREE from "three"
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
  const groupRef = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState(false)
  const isSelected = selectedCategory === category

  const targetScaleRef = useRef(isSelected ? 1.3 : 1.65)
  const targetEmissiveRef = useRef(isSelected ? 1.0 : 0.2)
  const currentScaleRef = useRef(isSelected ? 1.3 : 1.65)
  const currentEmissiveRef = useRef(isSelected ? 1.0 : 0.2)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.003

      targetScaleRef.current = isSelected ? 1.65 : hovered ? 1.65 : 1.5
      targetEmissiveRef.current = isSelected ? 1.0 : hovered ? 0.5 : 0.2

      currentScaleRef.current += (targetScaleRef.current - currentScaleRef.current) * 0.12
      currentEmissiveRef.current += (targetEmissiveRef.current - currentEmissiveRef.current) * 0.1

      groupRef.current.scale.set(currentScaleRef.current, currentScaleRef.current, currentScaleRef.current)

      if (hovered || isSelected) {
        groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 1.5) * 0.15
      } else {
        groupRef.current.position.y = position[1]
      }

      groupRef.current.children.forEach((child) => {
        if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
          child.material.emissiveIntensity = currentEmissiveRef.current
        }
      })
    }
  })

  const accentColor = "#D5370B"
  const materialColor = isSelected ? accentColor : hovered ? "#FF6B35" : "#E8E8E8"

  return (
    <group
      ref={groupRef}
      position={position}
      onClick={() => onSelect(category)}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <mesh position={[0, -1.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.8, 1.1, 64]} />
        <meshStandardMaterial
          color={isSelected ? accentColor : "#4A5568"}
          emissive={isSelected ? accentColor : "#2D3748"}
          emissiveIntensity={isSelected ? 0.6 : 0.2}
          transparent
          opacity={0.5}
        />
      </mesh>

      {geometry === "camera" && (
        <group>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[1.8, 1.1, 0.7]} />
            <meshStandardMaterial
              color={materialColor}
              metalness={0.6}
              roughness={0.3}
              emissive={isSelected ? accentColor : "#000"}
              emissiveIntensity={isSelected ? 0.8 : 0.1}
            />
          </mesh>

          <group position={[0, 0, 0.4]}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.55, 0.58, 0.5, 32]} />
              <meshStandardMaterial color={materialColor} metalness={0.7} roughness={0.2} />
            </mesh>
            <mesh position={[0, 0, 0.15]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.45, 0.45, 0.08, 32]} />
              <meshStandardMaterial color="#B0D4FF" metalness={0.3} roughness={0.1} transparent opacity={0.7} />
            </mesh>
            <mesh position={[0, 0, -0.1]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.42, 0.42, 0.06, 32]} />
              <meshStandardMaterial color="#D4E8FF" metalness={0.2} roughness={0.05} transparent opacity={0.6} />
            </mesh>
          </group>

          <mesh position={[0, 0.65, -0.15]}>
            <boxGeometry args={[0.6, 0.3, 0.35]} />
            <meshStandardMaterial color={materialColor} metalness={0.5} roughness={0.4} />
          </mesh>

          <mesh position={[-0.6, 0.55, 0]}>
            <cylinderGeometry args={[0.12, 0.12, 0.25, 16]} />
            <meshStandardMaterial color={isSelected ? accentColor : "#C0C0C0"} metalness={0.8} roughness={0.2} />
          </mesh>

          <mesh position={[0, 0.75, -0.3]}>
            <boxGeometry args={[0.3, 0.1, 0.15]} />
            <meshStandardMaterial color={materialColor} metalness={0.6} roughness={0.3} />
          </mesh>
        </group>
      )}

      {geometry === "shapes" && (
        <group>
          <mesh position={[0, 0.3, 0]} rotation={[0.4, 0.6, 0.2]}>
            <icosahedronGeometry args={[0.7, 1]} />
            <meshStandardMaterial
              color={materialColor}
              metalness={0.4}
              roughness={0.4}
              wireframe={false}
              emissive={isSelected ? accentColor : "#000"}
              emissiveIntensity={isSelected ? 0.7 : 0.05}
            />
          </mesh>

          <mesh position={[0, 0.3, 0]} rotation={[0.4, 0.6, 0.2]}>
            <icosahedronGeometry args={[0.72, 1]} />
            <meshStandardMaterial color={materialColor} wireframe transparent opacity={0.3} />
          </mesh>

          <mesh position={[0, 0.3, 0]} rotation={[Math.PI / 2.2, 0.3, 0]}>
            <torusGeometry args={[1.0, 0.05, 16, 100]} />
            <meshStandardMaterial
              color={materialColor}
              metalness={0.7}
              roughness={0.2}
              emissive={isSelected ? accentColor : "#000"}
              emissiveIntensity={isSelected ? 0.3 : 0}
            />
          </mesh>

          <mesh position={[0, 0.3, 0]} rotation={[0.2, Math.PI / 3, 0.4]}>
            <torusGeometry args={[0.75, 0.04, 16, 100]} />
            <meshStandardMaterial color={materialColor} metalness={0.6} roughness={0.3} />
          </mesh>

          <mesh position={[0, -0.5, 0]}>
            <cylinderGeometry args={[0.8, 0.8, 0.1, 8]} />
            <meshStandardMaterial color={materialColor} metalness={0.4} roughness={0.5} opacity={0.6} transparent />
          </mesh>

          <mesh position={[0, 0.3, 0]}>
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshStandardMaterial
              color={isSelected ? accentColor : "#FFD700"}
              emissive={isSelected ? accentColor : "#FFB700"}
              emissiveIntensity={isSelected ? 1.2 : 0.5}
            />
          </mesh>
        </group>
      )}

      {geometry === "guitar" && (
        <group rotation={[0, 0, Math.PI / 5]}>
          <mesh position={[0, -0.3, 0]}>
            <boxGeometry args={[0.5, 0.6, 0.12]} />
            <meshStandardMaterial
              color={materialColor}
              metalness={0.3}
              roughness={0.6}
              emissive={isSelected ? accentColor : "#000"}
              emissiveIntensity={isSelected ? 0.6 : 0}
            />
          </mesh>

          <mesh position={[0, -0.25, 0.061]}>
            <circleGeometry args={[0.18, 32]} />
            <meshStandardMaterial color="#1a1a1a" emissive="#1a1a1a" emissiveIntensity={0.2} />
          </mesh>

          <mesh position={[0, 0.35, 0]}>
            <boxGeometry args={[0.14, 1.4, 0.09]} />
            <meshStandardMaterial color={materialColor} metalness={0.2} roughness={0.7} />
          </mesh>

          <mesh position={[0, 0.35, 0.045]}>
            <boxGeometry args={[0.13, 1.35, 0.01]} />
            <meshStandardMaterial color="#2a2a2a" metalness={0.4} roughness={0.5} />
          </mesh>

          {[...Array(6)].map((_, i) => (
            <mesh key={i} position={[0, 0.35 - i * 0.2, 0.052]}>
              <boxGeometry args={[0.15, 0.02, 0.008]} />
              <meshStandardMaterial color="#C0A080" metalness={0.8} roughness={0.2} />
            </mesh>
          ))}

          <mesh position={[0, 1.15, 0]}>
            <boxGeometry args={[0.25, 0.3, 0.1]} />
            <meshStandardMaterial color={materialColor} metalness={0.3} roughness={0.6} />
          </mesh>

          {[...Array(3)].map((_, i) => (
            <group key={`peg-left-${i}`}>
              <mesh position={[-0.15, 1.25 - i * 0.1, 0.12]}>
                <cylinderGeometry args={[0.05, 0.05, 0.08, 12]} />
                <meshStandardMaterial color="#888888" metalness={0.7} roughness={0.3} />
              </mesh>
            </group>
          ))}
          {[...Array(3)].map((_, i) => (
            <group key={`peg-right-${i}`}>
              <mesh position={[0.15, 1.25 - i * 0.1, 0.12]}>
                <cylinderGeometry args={[0.05, 0.05, 0.08, 12]} />
                <meshStandardMaterial color="#888888" metalness={0.7} roughness={0.3} />
              </mesh>
            </group>
          ))}

          {[...Array(6)].map((_, i) => (
            <mesh key={`string-${i}`} position={[0, 0.35, 0.065]}>
              <boxGeometry args={[0.002, 1.5, 0.001]} />
              <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.1} />
            </mesh>
          ))}
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
      position: [-4, 0, 0] as [number, number, number],
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
      position: [4, 0, 0] as [number, number, number],
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative h-[400px] w-full overflow-hidden rounded-lg bg-background/20 backdrop-blur-md"
    >
      <Canvas shadows dpr={[1, 1.5]}>
        <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={50} />
        <OrbitControls enableZoom={false} enablePan={false} />

        <ambientLight intensity={0.3} />
        <spotLight
          position={[8, 10, 8]}
          angle={Math.PI / 3}
          penumbra={1}
          intensity={1.5}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <spotLight position={[-8, 8, -8]} angle={Math.PI / 4} penumbra={1} intensity={1.0} castShadow />
        <pointLight position={[0, 5, 0]} intensity={0.5} />

        <Environment preset="night" />

        <ContactShadows
          position={[0, -1.5, 0]}
          opacity={0.4}
          scale={15}
          blur={2.5}
          far={4}
          resolution={512}
          color="#000000"
        />

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
