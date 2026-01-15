"use client"

import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface Particle {
  x: number
  y: number
  z: number
  vz: number
  size: number
  color: string
}

export function WarpLoading({ isLoading = true }: { isLoading?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [progress, setProgress] = useState(0)
  const progressRef = useRef(0)
  const particlesRef = useRef<Particle[]>([])
  const animationIdRef = useRef<number>()

  // 1. progressの状態をRefに同期（アニメーションループで最新値を使うため）
  useEffect(() => {
    progressRef.current = progress
  }, [progress])

  // 2. アニメーションのメインロジック
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // キャンバスサイズをウィンドウに固定
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // パーティクルの初期化
    const particleCount = 600
    particlesRef.current = Array.from({ length: particleCount }, () => ({
      x: (Math.random() - 0.5) * 2000,
      y: (Math.random() - 0.5) * 2000,
      z: Math.random() * 1000,
      vz: 2,
      size: Math.random() * 2 + 1,
      color: Math.random() > 0.5 ? "#d5370b" : "#ffffff", // オレンジか白
    }))

    const animate = () => {
      // 背景を薄く塗りつぶして「残像」を作る
      ctx.fillStyle = "rgba(10, 0, 21, 0.4)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // 加速感の計算
      const p = progressRef.current
      const acceleration = Math.pow(p / 100, 2) * 40 
      const speed = 2 + acceleration

      particlesRef.current.forEach((pt) => {
        pt.z -= speed

        // 画面より手前に来たら奥にリセット
        if (pt.z <= 1) {
          pt.z = 1000
        }

        // 3Dから2Dへの座標変換（遠近法）
        const scale = 400 / pt.z
        const x = canvas.width / 2 + pt.x * scale
        const y = canvas.height / 2 + pt.y * scale

        // 画面内の場合のみ描画
        if (x > 0 && x < canvas.width && y > 0 && y < canvas.height) {
          const size = pt.size * scale * 0.1
          const length = size * (1 + acceleration * 0.5) // 加速時に線を伸ばす

          ctx.beginPath()
          ctx.strokeStyle = pt.color
          ctx.lineWidth = size
          ctx.moveTo(x, y)
          ctx.lineTo(x, y + length) // 移動方向に線を引く
          ctx.stroke()
        }
      })

      animationIdRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current)
    }
  }, []) // ここは空配列で1度だけ実行

  // 3. プログレスバーの進捗シミュレーション
  useEffect(() => {
    if (!isLoading) return
    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 100 : prev + Math.random() * 8))
    }, 150)
    return () => clearInterval(interval)
  }, [isLoading])

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#0a0015]"
        >
          {/* Canvas自体が消えないように絶対配置 */}
          <canvas ref={canvasRef} className="absolute inset-0 block" />
          
          <div className="relative z-10 text-center pointer-events-none">
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-7xl font-black text-[#d5370b] drop-shadow-[0_0_20px_rgba(213,55,11,0.5)]"
            >
              {Math.floor(progress)}%
            </motion.div>
            <p className="mt-4 text-xs tracking-[0.5em] text-white/50 uppercase font-light">
              Hyperspace Jump
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
