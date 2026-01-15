"use client"

import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface Particle {
  x: number
  y: number
  z: number
  size: number
  color: string
}

export function WarpLoading({ isLoading = true }: { isLoading?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [progress, setProgress] = useState(0)
  const [shouldRender, setShouldRender] = useState(false) // 初回判定用
  const progressRef = useRef(0)
  const particlesRef = useRef<Particle[]>([])
  const animationIdRef = useRef<number>()

  // 1. セッションストレージを確認して、ギャラリー遷移時などは表示しないようにする
  useEffect(() => {
    const hasLoaded = sessionStorage.getItem("hasVisited")
    if (!hasLoaded && isLoading) {
      setShouldRender(true)
    } else {
      setShouldRender(false)
    }
  }, [isLoading])

  useEffect(() => {
    progressRef.current = progress
    if (progress >= 100) {
      sessionStorage.setItem("hasVisited", "true")
    }
  }, [progress])

  // 2. アニメーションロジック
  useEffect(() => {
    if (!shouldRender) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    const particleCount = 700
    particlesRef.current = Array.from({ length: particleCount }, () => ({
      x: (Math.random() - 0.5) * 2000,
      y: (Math.random() - 0.5) * 2000,
      z: Math.random() * 1000,
      size: Math.random() * 1.5 + 0.5,
      // 星の色：基本は白と青白い星、少しだけアクセントにオレンジ
      color: Math.random() > 0.1 ? (Math.random() > 0.5 ? "#ffffff" : "#e0f2ff") : "#d5370b",
    }))

    const animate = () => {
      // 背景：オレンジ味を消し、深い宇宙の紺黒（Deep Space Blue）に
      ctx.fillStyle = "rgba(2, 4, 12, 0.5)" 
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const p = progressRef.current
      // 加速のカーブを調整（後半一気に速く）
      const acceleration = Math.pow(p / 100, 3) * 60
      const speed = 3 + acceleration

      const centerX = canvas.width / 2
      const centerY = canvas.height / 2

      particlesRef.current.forEach((pt) => {
        pt.z -= speed

        if (pt.z <= 1) {
          pt.z = 1000
        }

        const scale = 400 / pt.z
        const x = centerX + pt.x * scale
        const y = centerY + pt.y * scale

        if (x > 0 && x < canvas.width && y > 0 && y < canvas.height) {
          const size = pt.size * scale * 0.15
          
          // ★修正ポイント：放射状に線を引く（中心から外側へ）
          // 現在位置(x,y)から中心点(centerX, centerY)の逆方向に線を伸ばす
          const dx = x - centerX
          const dy = y - centerY
          const dist = Math.sqrt(dx * dx + dy * dy)
          
          // 加速に応じて線の長さを伸ばす（ワープ感の強調）
          const stretch = 1 + (acceleration * 0.1)
          const lineX = x + (dx / dist) * stretch * (scale * 0.5)
          const lineY = y + (dy / dist) * stretch * (scale * 0.5)

          ctx.beginPath()
          ctx.strokeStyle = pt.color
          ctx.lineWidth = size
          ctx.lineCap = "round"
          ctx.moveTo(x, y)
          ctx.lineTo(lineX, lineY)
          ctx.stroke()
          
          // 星の先端に光の粒を追加して視認性アップ
          ctx.fillStyle = pt.color
          ctx.beginPath()
          ctx.arc(lineX, lineY, size * 0.8, 0, Math.PI * 2)
          ctx.fill()
        }
      })

      animationIdRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current)
    }
  }, [shouldRender])

  // 3. 進捗シミュレーション
  useEffect(() => {
    if (!shouldRender) return
    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 100 : prev + Math.random() * 5))
    }, 100)
    return () => clearInterval(interval)
  }, [shouldRender])

  return (
    <AnimatePresence>
      {shouldRender && progress < 100 && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.5, filter: "blur(20px)" }}
          transition={{ duration: 1.2, ease: "easeIn" }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#02040c]"
        >
          <canvas ref={canvasRef} className="absolute inset-0 block" />
          
          {/* 中央の％表示を少し控えめに、かつ宇宙らしく */}
          <div className="relative z-10 text-center pointer-events-none">
            <motion.div
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-6xl font-black text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"
            >
              {Math.floor(progress)}%
            </motion.div>
            <p className="mt-4 text-[10px] tracking-[0.8em] text-[#d5370b] uppercase font-bold">
              Hyper-speed connection
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
