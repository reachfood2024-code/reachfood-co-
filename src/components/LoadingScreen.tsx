import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { gsap } from 'gsap'
import { Zap, Flame } from 'lucide-react'
import { useLocation } from 'react-router-dom'

const LoadingScreen = ({ onComplete }: { onComplete: () => void }) => {
  const location = useLocation()
  const isArabic = location.pathname.startsWith('/ar')
  const [progress, setProgress] = useState(0)
  const [currentText, setCurrentText] = useState('Initializing...')

  useEffect(() => {
    const texts = isArabic ? [
      'جاري التهيئة...',
      'تحميل تقنية الغذاء...',
      'تحضير واجهة التغذية...',
      'إعداد تقنية التسخين الذاتي...',
      'جاهز!'
    ] : [
      'Initializing...',
      'Loading food technology...',
      'Preparing nutrition interface...',
      'Setting up self-heating innovation...',
      'Ready!'
    ]

    let currentIndex = 0
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + Math.random() * 15
        if (newProgress >= 100) {
          clearInterval(interval)
          setTimeout(onComplete, 500)
          return 100
        }
        return newProgress
      })

      if (currentIndex < texts.length - 1) {
        setCurrentText(texts[currentIndex])
        currentIndex++
      }
    }, 200)

    return () => clearInterval(interval)
  }, [onComplete])

  useEffect(() => {
    gsap.to('.flame-icon', {
      rotation: 360,
      duration: 2,
      repeat: -1,
      ease: 'none'
    })
  }, [])

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-slate-900 flex items-center justify-center"
      >
        <div className="text-center">
          {/* Logo Animation */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: 'backOut' }}
            className="mb-8"
          >
            <div className="relative">
              <Flame className="flame-icon w-16 h-16 text-teal-400 mx-auto mb-4" />
              <Zap className="w-8 h-8 text-orange-400 absolute -top-2 -right-2" />
            </div>
            <h1 className="text-4xl font-serif font-bold bg-gradient-to-r from-teal-400 to-teal-600 bg-clip-text text-transparent">
              R<span className="text-orange-400 bg-none">E</span>A<span className="text-orange-400 bg-none">C</span>HF<span className="text-orange-400 bg-none">O</span>OD
            </h1>
            <p className="text-teal-400 font-semibold mt-2">
              {isArabic ? 'تقنية التسخين الذاتي الثورية' : 'Revolutionary Self-Heating Technology'}
            </p>
          </motion.div>

          {/* Progress Bar */}
          <div className="w-80 mx-auto mb-6">
            <div className="bg-slate-700 rounded-full h-2 overflow-hidden">
              <motion.div
                className="bg-gradient-to-r from-teal-400 to-teal-600 h-full rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* Loading Text */}
          <motion.p
            key={currentText}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-slate-400 text-lg"
          >
            {currentText}
          </motion.p>

          {/* Progress Percentage */}
          <motion.p
            className="text-teal-400 font-bold text-2xl mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {Math.round(progress)}%
          </motion.p>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

export default LoadingScreen