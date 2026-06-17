'use client'
import { Leaf, ShoppingBasket, Smartphone, Truck } from "lucide-react"
import img1 from '@/assets/Fresh Organic Groceries.jpg'
import img2 from '@/assets/Fast & Reliable Delivery.jpg'
import img3 from '@/assets/order.jpg'
import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import Image from "next/image"
import { useSelector } from "react-redux"
import { RootState } from "@/redux/store"

function HeroSection() {
  const {userData} = useSelector((state: RootState) => state.user)
  // console.log(userData)
  const slides = [
    {
      id: 1,
      icon: <Leaf className="w-20 h-20 text-green-400 drop-shadow-lg" />,
      title: "Fresh Organic Groceries 🥦",
      subtitle: "Farm-fresh fruits, vegetables, and daily essentials delivered to you.",
      btnText: "Shop Now",
      bg: img1.src
    },
    {
      id: 2,
      icon: <Truck className="w-20 h-20 text-yellow-400 drop-shadow-lg" />,
      title: "Fast & Reliable Delivery 🚚",
      subtitle: "We ensure your groceries reach your doorstep in no time.",
      btnText: "Order Now",
      bg: img2.src
    },
    {
      id: 3,
      icon: <Smartphone className="w-20 h-20 text-blue-400 drop-shadow-lg" />,
      title: "Shop Anytime, Anywhere 📱",
      subtitle: "Easy and seamless online grocery shopping experience.",
      btnText: "Get Started",
      bg: img3.src
    }
  ]

  const [currState, setCurrState] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setCurrState((prev) => (prev + 1) % slides.length)
    }, 4000);
    
    return () => clearInterval(timer)
  }, [isPaused, slides.length])

  return (
    <div
      className="relative w-[98%] mx-auto mt-24 mb-16 h-[83vh] rounded-3xl overflow-hidden shadow-2xl"
      onMouseEnter={() => setIsPaused(true)}  
      onMouseLeave={() => setIsPaused(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currState}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          exit={{ opacity: 0, transition: { duration: 0.8 } }}
          className="inset-0 absolute"
        >
          <Image
            src={slides[currState].bg}
            fill
            alt="slider image"
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px]"></div>
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 flex items-center justify-center text-center text-white px-6">
        <motion.div
          key={`text-${currState}`} 
          initial={{ y: 30, opacity: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-col items-center justify-center gap-6 max-w-3xl"
        >
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-full shadow-lg">
            {slides[currState].icon}
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight drop-shadow-lg">
            {slides[currState].title}
          </h1>
          <p className="text-lg text-gray-200 max-w-2xl">
            {slides[currState].subtitle}
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="bg-white mt-4 text-green-700 hover:bg-green-100 rounded-full px-8 py-3 font-semibold shadow-lg transition-colors duration-300 flex items-center gap-2 cursor-pointer"
          >
            <ShoppingBasket className="w-5 h-5" />
            {slides[currState].btnText}
          </motion.button>
        </motion.div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-10">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrState(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            className={`h-1 rounded-full transition-all duration-300 cursor-pointer ${
              idx === currState ? "bg-white w-6" : "bg-white/50 w-2 hover:bg-white/80"
            }`}
          />
        ))}
      </div>
    </div>
  )
}

export default HeroSection