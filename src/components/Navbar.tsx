'use client'
import { Cross, Loader, Loader2, LogOut, Package, Search, ShoppingCart, User, X } from 'lucide-react'
import { AnimatePresence } from 'motion/react'
import { signOut, useSession } from 'next-auth/react'
import { motion } from 'motion/react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'

function Navbar() {
    const {data: session, status} = useSession()
    const user = session?.user
    const [loggingOut, setLoggingOut] = useState(false)
    const [open, setOpen] = useState(false)
    const [searchBarOpen, setSearchBarOpen] = useState(false)
    const [searchBarContent, setSearchBarContent] = useState("")
    const handleLogout = async () => {
        setLoggingOut(true)
        try {
            await signOut({callbackUrl: '/sign-in'})
        } catch (error) {
            toast.error("Logout failed")
        }finally{
            setLoggingOut(false)
        }
    }

    const profileDropDown = useRef<HTMLDivElement>(null)

    useEffect(()=>{
        const handleClickOutSide = (e:MouseEvent) =>{
            if(profileDropDown.current && !profileDropDown.current.contains(e.target as Node)){
                setOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutSide)
        return () => document.removeEventListener("mousedown", handleClickOutSide)
    }, [])


  return (
    <div
    className="w-[95%] rounded-2xl fixed top-4 left-1/2 h-15 shadow-lg shadow-black/30  -translate-x-1/2 bg-linear-to-r from-green-500 to-green-700 flex flex-row justify-between items-center px-4 md:px-8 z-99 py-3"
    >
      <Link
      href={'/'}
      className='text-white font-extrabold text-2xl sm:text-3xl tracking-wide hover:scale-103 transition-all duration-200'
      >
      Snapcart
      </Link>

      <form
      className='hidden md:flex items-center rounded-full bg-white w-1/2 max-w-lg py-2 px-4 shadow-md'
      >
            <Search className='text-gray-500 w-5 h-5 mr-2'/>
            <input type="text"
            value={searchBarContent}
            onChange={(e) => setSearchBarContent(e.target.value)}
            placeholder='Search groceries...' className='w-full outline-none text-gray-700 placeholder-gray-400' />
            {
                searchBarContent !== "" &&
                <button
                onClick={() => setSearchBarContent("")}
                >
                <X className='w-5 h-5 text-gray-500 ml-2 cursor-pointer hover:text-gray-700'/>
            </button>
            }
            
            
      </form>

      <div
      className='flex gap-3 md:gap-6 relative items-center'
      >
        <button
        className='relative bg-white rounded-full h-11 w-11 flex items-center justify-center shadow-md hover:sacle-103 transition-transform sm:hidden'
        onClick={() => setSearchBarOpen(prev => !prev)}
        >
            <Search className='h-6 w-6 text-green-600'/>
        </button>
        <Link
        href={'/'}
        className='relative bg-white rounded-full h-11 w-11 flex items-center justify-center shadow-md hover:sacle-103 transition-transform'
        >
        <ShoppingCart className='text-green-600 w-6 h-6'/>
        <span className='absolute -top-1 -right-1 bg-red-500 rounded-full h-5 w-5 text-xs text-white font-bold flex justify-center items-center shadow'>0</span>
        </Link>

        <div
        className='relative'
        ref={profileDropDown}
        >
        <div
        className='rounded-full h-11 w-11 bg-white flex justify-center items-center shadow-md hover:scale-103 overflow-hidden transition-transform relative cursor-pointer'
        onClick={() => setOpen(prev => !prev)}
        >
            {
                user?.image? (
                    <Image 
                    alt='User Image'
                    src={user.image}
                    fill
                    className='object-cover rounded-full'
                    />
                ) :(<User/>)
            }
        </div>
            <AnimatePresence>
                {
            open && 
                <motion.div
                initial={{
                    opacity:0,
                    y:-10,
                    scale:0.95
                }}
                animate={{
                    opacity:1,
                    y:0,
                    scale:1
                }}
                transition={{
                    duration:0.3
                }}
                exit={{
                   opacity:0,
                    y:-10,
                    scale:0.95,
                    transition:{duration:0.3}
                }}
                className='absolute bg-white right-0 w-56 mt-3 rounded-2xl shadow-xl border-gray-200
                p-3 z-100 flex flex-col gap-4 items-center justify-center'
                >

                    {/* user div */}
                    <div className='flex items-center gap-3 w-full px-5 py-2 border-1 rounded-2xl border-gray-100 overflow-hidden'>
                        <div
                        className='flex items-center justify-center rounded-full w-10 h-10 bg-green-100 relative'
                        >
                            {
                user?.image? (
                    <Image 
                    alt='User Image'
                    src={user.image}
                    fill
                    className='object-cover rounded-full'
                    />
                ) :(<User/>)
            }
                        </div>
                        <div>
                            <div className='text-gray-800 font-semibold'>{user?.name}</div>
                            <div className='text-xs text-gray-500 capitalize'>{user?.role}</div>
                        </div>
                    </div>

                    {/* My orders div */}
                    <Link
                    href={'/'}
                    onClick={() => setOpen(false)}
                    className='flex text-left items-center gap-3 w-full pl-3 pr-5 py-2 border-1 rounded-2xl bg-green-50 hover:bg-green-100 hover:text-green-700 border-gray-100 overflow-hidden text-gray-700 font-medium text-sm group transition-all duration-200'>
                        <Package className='text-green-600 h-5 w-5 group-hover:translate-x-1 transition-all duration-200'/>
                        <span>My Orders</span>
                    </Link>
                    {/* Logout div */}
                    <button
                    disabled={loggingOut}
                    onClick={handleLogout}
                    className='flex items-center text-left gap-3 w-full pl-3 pr-5 py-2 bg-red-50 border-1 rounded-2xl hover:bg-red-100 border-gray-100 overflow-hidden text-gray-700 font-medium text-sm group hover:text-red-600 cursor-pointer disabled:bg-gray-200 disabled:cursor-not-allowed'>
                    {
                        loggingOut? 
                        (<>
                            <Loader className='text-center h-6 w-6 animate-spin'/>
                            Logging Out..
                        </>
                            ):
                        (
                        <>
                        <LogOut className='text-red-600 h-5 w-5 group-hover:translate-x-1 transition-all duration-200'/>
                        <span>Log out</span>
                        </>
                        )
                    }
                    
                    </button>
                </motion.div>
}
            </AnimatePresence>


            <AnimatePresence>
                {searchBarOpen && 
                <motion.div
                initial={{
                    opacity:0,
                    y:-10,
                    scale:0.5
                }}
                animate={{
                    opacity:1,
                    y:0,
                    scale:1
                }}
                transition={{
                    duration:0.3
                }}
                exit={{
                   opacity:0,
                    y:-10,
                    scale:0.5,
                    transition:{duration:0.3}
                }}

                className='fixed top-20 left-1/2 -translate-x-1/2 w-[90%] bg-gray-100 rounded-full shadow-lg z-40 flex items-center px-4 py-2 border-1 border-gray-200 '
                >

                    <Search className='text-gray-500 w-5 h-5  mr-2'/>
                    <form action="" className='grow'>
                        <input type="text"
                        placeholder='Search groceries...'
                        className='w-full outline-none text-gray-700'/>
                    </form>
                    <button
                    onClick={() => setSearchBarOpen(false)}
                    >
                        <X className='text-gray-500 h-5 w-5'/>
                    </button>
                </motion.div>
                }
            </AnimatePresence>
        </div>
       
      </div>
    </div>
  )
}

export default Navbar
