"use client";
import { ArrowRight, Check, Package, ShoppingBag } from "lucide-react";
import { motion, Variants } from "motion/react";
import Link from "next/link";
import { useEffect, useState } from "react";


const PARTICLES = Array.from({ length: 12 }).map((_, i) => ({
  id: i,
  angle: (i * 360) / 12,
  distance: Math.random() * 60 + 60,
  size: Math.random() * 6 + 4,
  duration: Math.random() * 0.5 + 0.8,
}));

export default function OrderSuccessPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    show: { 
      opacity: 1, 
      y: 0, 
      scale: 1, 
      transition: { type: "spring", stiffness: 250, damping: 20 } 
    },
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen px-6 text-center bg-linear-to-b from-green-50/30 to-white overflow-hidden">
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-green-400/5 rounded-full blur-[80px] pointer-events-none" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="relative z-10 flex flex-col items-center max-w-lg w-full"
      >
        <motion.div variants={itemVariants} className="relative mb-8">
          
          {mounted && PARTICLES.map((p) => (
            <motion.div
              key={p.id}
              initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
              animate={{
                x: Math.cos((p.angle * Math.PI) / 180) * p.distance,
                y: Math.sin((p.angle * Math.PI) / 180) * p.distance,
                opacity: 0,
                scale: 1,
              }}
              transition={{ duration: p.duration, ease: "easeOut", delay: 0.2 }}
              className="absolute top-1/2 left-1/2 rounded-full bg-green-500 pointer-events-none"
              style={{
                width: p.size,
                height: p.size,
                marginLeft: -p.size / 2,
                marginTop: -p.size / 2,
              }}
            />
          ))}

          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 bg-green-200 rounded-full blur-sm"
          />

          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
            className="relative w-24 h-24 sm:w-28 sm:h-28 bg-green-600 rounded-full flex items-center justify-center shadow-xl shadow-green-600/30"
          >
            <motion.div
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
            >
              <Check className="w-12 h-12 sm:w-14 sm:h-14 text-white" strokeWidth={4} />
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-3"
        >
          Order Placed Successfully!
        </motion.h1>
        
        <motion.p
          variants={itemVariants}
          className="text-gray-500 text-sm md:text-base max-w-md leading-relaxed mb-10"
        >
          Thank you for shopping with us! Your order is being processed securely. You can track its progress in your <span className="font-bold text-green-700">My Orders</span> section.
        </motion.p>

        <motion.div variants={itemVariants} className="mb-12">
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            className="w-20 h-20 bg-white rounded-2xl shadow-lg border border-gray-100 flex items-center justify-center"
          >
            <Package className="w-10 h-10 text-green-600" strokeWidth={1.5} />
          </motion.div>
        </motion.div>

        {/* --- 4. Action Buttons --- */}
        <motion.div variants={itemVariants} className="flex flex-col items-center gap-4 w-full sm:w-auto">
          <Link href={"/user/my-order"} passHref className="w-full">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              className="w-full sm:w-[280px] flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white text-base font-bold px-8 py-4 rounded-xl shadow-lg shadow-green-600/20 transition-all duration-300 cursor-pointer group"
            >
              Go to My Orders
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </Link>

          <Link href={"/"} passHref className="w-full">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              className="w-full sm:w-[280px] flex items-center justify-center gap-2 bg-white text-gray-700 hover:text-green-700 text-base font-bold px-8 py-4 rounded-xl border border-gray-200 hover:border-green-200 transition-all duration-300 cursor-pointer"
            >
              <ShoppingBag className="w-5 h-5" />
              Continue Shopping
            </motion.button>
          </Link>
        </motion.div>

      </motion.div>
    </div>
  );
}