
import { useEffect, useRef } from 'react'

export default function Starfield() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const stars = []
    let animationId
    let width = 0
    let height = 0
    let mouseX = 0
    let mouseY = 0

    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    function resizeCanvas() {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width * window.devicePixelRatio
      canvas.height = height * window.devicePixelRatio
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(
        window.devicePixelRatio, 0, 0,
        window.devicePixelRatio, 0, 0
      )
    }

    for (let i = 0; i < 150; i++) {
      stars.push({
        x: Math.random(),
        y: Math.random(),
        size: Math.random() * 1.5 + 0.4,
        alpha: Math.random() * 0.6 + 0.2,
        speed: Math.random() * 0.00008 + 0.00002
      })
    }

    function draw() {
      ctx.clearRect(0, 0, width, height)

      stars.forEach((star) => {
        star.y += reducedMotion ? 0 : star.speed

        if (star.y > 1) star.y = 0

        const x = star.x * width + mouseX * 8
        const y = star.y * height + mouseY * 8

        ctx.beginPath()
        ctx.arc(x, y, star.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(180, 220, 255, ${star.alpha})`
        ctx.shadowBlur = 8
        ctx.shadowColor = '#22D3EE'
        ctx.fill()
      })

      ctx.shadowBlur = 0

      if (!reducedMotion) {
        animationId = requestAnimationFrame(draw)
      }
    }

    function handleMouseMove(event) {
      mouseX = (event.clientX / width - 0.5) * 2
      mouseY = (event.clientY / height - 0.5) * 2
    }

    resizeCanvas()
    draw()

    window.addEventListener('resize', resizeCanvas)
    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resizeCanvas)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  return <canvas ref={canvasRef} className="starfield" />
}
