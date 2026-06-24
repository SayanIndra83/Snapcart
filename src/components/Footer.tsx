'use client'
import { motion, type Variants} from "motion/react"
import Link from "next/link"
import { Mail, MapPin, Phone } from 'lucide-react'
import { FiGithub, FiInstagram, FiLinkedin } from "react-icons/fi"

const containerVariants:Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6, 
      ease: "easeOut",
      when: "beforeChildren",
      staggerChildren: 0.15 
    }
  }
}

const childVariants:Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.4, ease: "easeOut" } 
  }
}

function Footer({role} : {role: string}) {
  return (
    <footer className='text-white mt-20 bg-linear-to-r from-green-800 to-green-900 shadow-[0_-10px_30px_rgba(0,0,0,0.05)] border-t border-green-700/50'>
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="w-[90%] max-w-7xl mx-auto pt-16 pb-8"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 border-b border-green-700/60 pb-12">
          
          <motion.div variants={childVariants} className="flex flex-col gap-4">
            <Link href="/" className="text-3xl font-extrabold tracking-wide drop-shadow-sm">
              Snapcart
            </Link>
            <p className="text-sm text-green-100/80 leading-relaxed">
              Your one-stop online grocery store delivering freshness to your doorstep. 
              Shop smart, eat fresh, and save more every single day.
            </p>
          </motion.div>
            
          <motion.div variants={childVariants}>
              <h2 className="text-lg font-semibold mb-5 tracking-wide text-green-50">Quick Links</h2>
              <ul className="space-y-3 text-green-100/80 text-sm font-medium">
                  <li>
                    <Link href={'/'} className="inline-flex hover:text-white hover:translate-x-1 transition-all duration-300">
                      Home
                    </Link>
                  </li>
                  {role === "user" && 
                  <>
                    <li>
                    <Link href={'/user/cart'} className="inline-flex hover:text-white hover:translate-x-1 transition-all duration-300">
                      Cart
                    </Link>
                  </li>
                  <li>
                    <Link href={'/user/my-orders'} className="inline-flex hover:text-white hover:translate-x-1 transition-all duration-300">
                      My Orders
                    </Link>
                  </li>
                  </>
                  }

                  {role === "admin" && 
                  <>
                  <li>
                    <Link href={'/admin/add-grocery'} className="inline-flex hover:text-white hover:translate-x-1 transition-all duration-300">
                      Add Grocery
                    </Link>
                  </li>
                  <li>
                    <Link href={'/admin/view-groceries'} className="inline-flex hover:text-white hover:translate-x-1 transition-all duration-300">
                      View Groceries
                    </Link>
                  </li>
                  <li>
                    <Link href={'/admin/manage-orders'} className="inline-flex hover:text-white hover:translate-x-1 transition-all duration-300">
                      Manage Orders
                    </Link>
                  </li>
                  </>
                  }
                  
              </ul>
          </motion.div>

          <motion.div variants={childVariants}>
             <h2 className="text-lg font-semibold mb-5 tracking-wide text-green-50">Contact Us</h2>
             <ul className="space-y-4 text-green-100/80 text-sm">
                  <li className="flex items-start gap-3 group">
                    <MapPin className="h-5 w-5 text-green-400 shrink-0 group-hover:scale-110 transition-transform" />
                    <span className="leading-tight">Garfa 3rd Lane, Jadavpur<br/>Kolkata, West Bengal</span>
                  </li>
                  <li className="flex items-center gap-3 group">
                    <Phone className="h-4 w-4 text-green-400 shrink-0 group-hover:scale-110 transition-transform" />
                    <span>+91 99336 71072</span>
                  </li>
                  <li className="flex items-center gap-3 group">
                    <Mail className="h-4 w-4 text-green-400 shrink-0 group-hover:scale-110 transition-transform" />
                    <a href="mailto:support@snapcart.com" className="hover:text-white transition-colors">support@snapcart.com</a>
                  </li>
              </ul>
          </motion.div>

          <motion.div variants={childVariants}>
             <h2 className="text-lg font-semibold mb-5 tracking-wide text-green-50">Connect with Developer</h2>
             <p className="text-sm text-green-100/80 mb-5 leading-relaxed">
                Designed and built by Sayan Indra. Let's connect and build something awesome together.
             </p>
              
              <div className="flex gap-4">
                <a 
                  href="https://github.com/sayanindra83" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="bg-green-800/50 p-2.5 rounded-xl border border-green-700/50 hover:bg-green-700 hover:border-green-500 hover:-translate-y-1 transition-all duration-300 text-green-300 hover:text-white"
                  aria-label="GitHub"
                >
                  <FiGithub className="h-5 w-5" />
                </a>
                <a 
                  href="https://linkedin.com/in/yourusername" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="bg-green-800/50 p-2.5 rounded-xl border border-green-700/50 hover:bg-green-700 hover:border-green-500 hover:-translate-y-1 transition-all duration-300 text-green-300 hover:text-white"
                  aria-label="LinkedIn"
                >
                  <FiLinkedin className="h-5 w-5" />
                </a>
                <a 
                  href="https://instagram.com/sayanindra143" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="bg-green-800/50 p-2.5 rounded-xl border border-green-700/50 hover:bg-green-700 hover:border-green-500 hover:-translate-y-1 transition-all duration-300 text-green-300 hover:text-white"
                  aria-label="Instagram"
                >
                  <FiInstagram className="h-5 w-5" />
                </a>
              </div>
          </motion.div>

        </div>

        <motion.div 
          variants={childVariants} 
          className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-green-200/60 font-medium"
        >
          <p>© {new Date().getFullYear()} Snapcart. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-white transition-colors duration-200">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors duration-200">Terms of Service</Link>
          </div>
        </motion.div>

      </motion.div>
    </footer>
  )
}

export default Footer