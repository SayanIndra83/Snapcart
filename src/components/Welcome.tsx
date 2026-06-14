'use client'
import { ArrowRight, Bike, ShoppingBasket } from "lucide-react"
import { motion } from "motion/react"
import { useRouter } from "next/navigation"
function Welcome() {
    const router = useRouter()
  return (
    <div className='flex flex-col items-center justify-center text-center min-h-screen px-6'>
      <motion.div
      initial={
        {
            opacity:0, y:-16
        }
      }
      animate={{
        opacity:1, y:0
      }}
      transition={{
        duration: 0.6
      }}

      className="flex flex-row justify-center items-center gap-7"
      >
         <ShoppingBasket size={70} className="text-green-600 font-bold"/>
        <h1 className="text-4xl md:text-7xl font-extrabold text-green-700">
            Snapcart</h1>
      </motion.div>

      <motion.p
      initial={
        {
            opacity:0, y:10
        }
      }
      animate={{
        opacity:1, y:0
      }}
      transition={{
        duration: 0.6,
        delay: 0.3
      }}
      className="mt-4 text-gray-700 text-lg md:text-xl max-w-xl"
      >
        Your one-step destination for fresh groceries, organic products and daily essentials  delivered right to your doorstep.
      </motion.p>
      <motion.div
      initial={
        {
            opacity:0, scale:0.7
        }
      }
      animate={{
        opacity:1, scale: 1.0
      }}
      transition={{
        duration: 0.6,
        delay: 0.5
      }}
      className="mt-5 flex gap-7"
      >
        <ShoppingBasket size={120} className="text-green-600  font-bold"/>
        <Bike size={120} className="text-orange-400  font-bold"/>
      </motion.div>

      <motion.button
      initial={
        {
            opacity:0, y:10
        }
      }
      animate={{
        opacity:1, y:0
      }}
      transition={{
        duration: 0.6,
        delay: 0.6
      }}
      className="mt-10 inline-flex items-center gap-2 border-0 rounded-2xl bg-green-600 font-semibold py-3 px-8 text-white cursor-pointer hover:bg-green-700 group transition-all duration-200 shadow-xl shadow-gray-400"
      onClick={() => router.push('/sign-up')}
      >
        Next 
        <ArrowRight className="group-hover:translate-x-0.5 transition-all duration-200"/>
      </motion.button>

    </div>
  )
}

export default Welcome
