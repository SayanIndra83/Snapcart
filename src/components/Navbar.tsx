'use client'
import {ClipboardCheck, Loader, LogOut, Menu, Pencil, PlusCircle, Search, ShoppingBag, ShoppingCart, ShoppingCartIcon, Store, User, X } from 'lucide-react'
import { AnimatePresence } from 'motion/react'
import { signOut, useSession } from 'next-auth/react'
import { motion } from 'motion/react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { createPortal } from 'react-dom'
import { IUser } from './EditRole'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'

function Navbar({user} : {user:IUser}) {
    const [loggingOut, setLoggingOut] = useState(false)
    const [open, setOpen] = useState(false)
    const [searchBarOpen, setSearchBarOpen] = useState(false)
    const [searchBarContent, setSearchBarContent] = useState("")
    const [menuOpen, setMenuOpen] = useState(false)
    
    const {cartData} = useSelector((state:RootState) => state.cart)
    // console.log(cartData)
    const handleLogout = async () => {
        setLoggingOut(true)
        try {
            await signOut({callbackUrl: '/sign-in'})
        } catch (error) {
            toast.error("Logout failed")
        }finally{
            setLoggingOut(false)
            setOpen(false)
            setMenuOpen(false)
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

    // sidebar
   const sidebar = typeof document !== "undefined" ? createPortal(
  <AnimatePresence>
    {menuOpen && (
      <>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={() => setMenuOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998]"
        />

        <motion.div
          initial={{ opacity: 0, x: "-100%" }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ x: "-100%", opacity: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className='fixed top-0 left-0 h-full w-[75%] sm:w-[60%] max-w-sm z-9999 bg-linear-to-b from-green-800/95 via-green-700/95 to-green-900/95 backdrop-blur-2xl border-r border-green-400/20 shadow-[0_0_50px_-10px_rgba(0,255,100,0.3)] flex flex-col p-6 text-white'
        >
          <div className='flex justify-between items-center mb-2'>
            <h1 className='font-bold text-2xl tracking-wide text-white/90'>
              Admin Panel
            </h1>
            <button
              className='text-white/80 hover:text-red-400 hover:rotate-90 text-2xl font-bold transition-all duration-300 cursor-pointer'
              onClick={() => setMenuOpen(false)}
            >
              <X />
            </button>
          </div>

          <div className='flex items-center gap-3 p-3 mt-3 rounded-xl bg-white/10 shadow-inner border border-white/5'>
            <div className='h-10 w-10 bg-green-100 rounded-full relative border border-green-400 overflow-hidden shrink-0'>
              {user?.image ? (
                <Image
                  alt='User Image'
                  src={user.image}
                  fill
                  className='object-cover'
                />
              ) : (
                <User className="w-full h-full p-1.5 text-green-700" />
              )}
            </div>
            <div className="overflow-hidden">
              <h2 className='text-lg font-semibold text-white truncate'>{user?.username || "Guest"}</h2>
              <p className='text-xs font-medium text-green-200 capitalize tracking-wide'>{user?.role || "Admin"}</p>
            </div>
          </div>

          <div className='w-full mt-6 mb-3 border-t border-white/10'></div>

          <div className="flex gap-2 flex-col mb-5 font-medium">
            <Link
              href="/admin/add-grocery"
              onClick={() => setMenuOpen(false)}
              className='flex items-center gap-3 p-3 rounded-xl active:scale-95 transition-all text-white/90 hover:text-white bg-white/10'
            >
              <PlusCircle className='h-5 w-5 text-green-300' />
              <span>Add Grocery</span>
            </Link>

            <Link
              href="/admin/view-groceries"
              onClick={() => setMenuOpen(false)}
              className='flex items-center gap-3 p-3 rounded-xl bg-white/10 active:scale-95 transition-all text-white/90 hover:text-white'
            >
              <Store className='h-5 w-5 text-green-300' />
              <span>View Groceries</span>
            </Link>

            <Link
              href="/admin/manage-orders"
              onClick={() => setMenuOpen(false)}
              className='flex items-center gap-3 p-3 rounded-xl bg-white/10 active:scale-95 transition-all text-white/90 hover:text-white'
            >
              <ClipboardCheck className='h-5 w-5 text-green-300' />
              <span>Manage Orders</span>
            </Link>
          </div>

          <div className='mt-auto pt-6'>
            <button
              disabled={loggingOut}
              onClick={handleLogout}
              className='flex items-center gap-3 w-full pl-3 pr-5 py-2 bg-red-50 border border-gray-500/20 rounded-xl  text-red-500 font-medium transition-all group disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer'
            >
              {loggingOut ? (
                <>
                  <Loader className='h-4 w-4 animate-spin' />
                  <span>Logging Out...</span>
                </>
              ) : (
                <>
                  <LogOut className='h-4 w-4' />
                  <span>Log out</span>
                </>
              )}
            </button>
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>,
  document.body
) : null;
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

      {user?.role === "user" && 
      (
        <form
      className='hidden md:flex items-center rounded-full bg-white w-1/2 max-w-lg py-1 px-4 shadow-md'
      >
            <Search className='text-gray-500 w-4 h-4 mr-2'/>
            <input type="text"
            value={searchBarContent}
            onChange={(e) => setSearchBarContent(e.target.value)}
            placeholder='Search groceries...' className='w-full outline-none text-gray-700 placeholder-gray-400' />
            {
                searchBarContent !== "" &&
                <button
                onClick={() => setSearchBarContent("")}
                >
                <X className='w-4 h-4 text-gray-500 ml-2 cursor-pointer hover:text-gray-700'/>
            </button>
            }
            
            
      </form>
      )
      }

      

      <div
      className='flex gap-3 md:gap-6 relative items-center'>
        {user?.role === "user" && 
        <>
        <button
        className='relative bg-white rounded-full h-11 w-11 flex items-center justify-center shadow-md hover:sacle-103 transition-transform sm:hidden'
        onClick={() => setSearchBarOpen(prev => !prev)}
        >
        <Search className='h-6 w-6 text-green-600'/>
        </button>
        <Link
        href={'/user/cart'}
        className='relative bg-white rounded-full h-9 w-9 flex items-center justify-center shadow-md hover:sacle-103 transition-all'
        >
        <ShoppingCartIcon className='text-green-600 w-5 h-5'/>
        <span className='absolute -top-1 -right-1 bg-red-500 rounded-full h-4 w-4 text-center text-xs text-white font-bold flex justify-center items-center shadow'>{
       (cartData.length>0) ? (`${cartData.length}`) : ("0")
        }</span>
        </Link>
        </>}

        {user?.role === "admin" && 

        (
        <>
        <div className="hidden md:flex items-center gap-4">

            <Link 
                    href="/admin/add-grocery" 
                    className='group relative bg-white rounded-full flex items-center justify-center gap-2  shadow-md hover:scale-103 hover:bg-green-50 transition-all cursor-pointer font-semibold px-2.5 py-1.5 text-sm text-gray-700'
                >
                    <PlusCircle className='h-4 w-4 text-green-600'/>
                    <span className='group-hover:text-green-700 transition-all duration-200'>
                        Add Grocery
                    </span>
                </Link>
                <Link 
                    href="/admin/view-groceries" 
                    className='group relative bg-white rounded-full flex items-center justify-center gap-2  shadow-md hover:scale-103 hover:bg-green-50 transition-all cursor-pointer font-semibold px-2.5 py-1.5 text-sm text-gray-700'
                >
                    <Store className='h-4 w-4 text-green-600'/>
                    <span className='group-hover:text-green-700 transition-all duration-200'>View Groceries</span>
                </Link>

                <Link 
                    href="/admin/manage-orders" 
                    className='group relative bg-white rounded-full flex items-center justify-center gap-2  shadow-md hover:scale-103 hover:bg-green-50 transition-all cursor-pointer font-semibold px-2.5 py-1.5 text-sm text-gray-700'
                >
                    <ClipboardCheck className='h-4 w-4 text-green-600'/>
                    <span className='group-hover:text-green-700 transition-all duration-200'>
                        Manage Orders
                    </span>
                </Link>
        </div>
        <div className='md:hidden bg-white rounded-full w-8 h-8 items-center justify-center flex shadow-md cursor-pointer'
        onClick={() => setMenuOpen(prev => (!prev))}
        >
            <Menu className='text-green-600 h-4 w-4'/>
        </div>
        </>
    )}
        
        {user?.role !== "admin" &&
        (
        <div
        className='relative'
        ref={profileDropDown}>
        <div
        className='rounded-full h-9 w-9 bg-white flex justify-center items-center shadow-md hover:scale-103 overflow-hidden transition-transform relative cursor-pointer'
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
                ) :(<User className='h-5 w-5'/>)
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
                    <div className='flex items-center gap-3 w-full px-2 py-2 border rounded-2xl border-gray-100 overflow-hidden'>
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
                            <div className='text-gray-800 font-semibold'>{user?.username}</div>
                            <div className='text-xs text-gray-500 capitalize'>{user?.role}</div>
                        </div>
                    </div>

                    {/* My orders div */}
                    {
                        user?.role === "user" && (
                            <Link
                    href={'/user/my-orders'}
                    onClick={() => setOpen(false)}
                    className='flex text-left items-center gap-3 w-full pl-3 pr-5 py-2 border rounded-2xl bg-green-50 hover:bg-green-100 hover:text-green-700 border-gray-100 overflow-hidden text-gray-700 font-medium text-sm group transition-all duration-200'>
                        <ShoppingBag className='text-green-600 h-5 w-5 group-hover:translate-x-1 transition-all duration-200'/>
                        <span>My Orders</span>
                    </Link>
                        )
                    }


                    {/* Logout div */}
                    <button
                    disabled={loggingOut}
                    onClick={handleLogout}
                    className='flex items-center text-left gap-3 w-full pl-3 pr-5 py-2 bg-red-50 border rounded-2xl hover:bg-red-100 border-gray-100 overflow-hidden text-gray-700 font-medium text-sm group hover:text-red-600 cursor-pointer disabled:bg-gray-200 disabled:cursor-not-allowed'>
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

                className='fixed top-20 left-1/2 -translate-x-1/2 w-[90%] bg-gray-100 rounded-full shadow-lg z-40 flex items-center px-4 py-2 border border-gray-200 '
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
        )
        }

        {user?.role === "admin" &&
        (
        <div
        className='relative hidden md:block'
        ref={profileDropDown}>
        <div
        className='rounded-full h-9 w-9 bg-white flex justify-center items-center shadow-md hover:scale-103 overflow-hidden transition-transform relative cursor-pointer'
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
                ) :(<User className='h-5 w-5'/>)
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
                    <div className='flex items-center gap-3 w-full px-2 py-2 border rounded-2xl border-gray-100 overflow-hidden'>
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
                            <div className='text-gray-800 font-semibold'>{user?.username}</div>
                            <div className='text-xs text-gray-500 capitalize'>{user?.role}</div>
                        </div>
                    </div>



                    {/* Logout div */}
                    <button
                    disabled={loggingOut}
                    onClick={handleLogout}
                    className='flex items-center text-left gap-3 w-full pl-3 pr-5 py-2 bg-red-50 border rounded-2xl hover:bg-red-100 border-gray-100 overflow-hidden text-gray-700 font-medium text-sm group hover:text-red-600 cursor-pointer disabled:bg-gray-200 disabled:cursor-not-allowed'>
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

                className='fixed top-20 left-1/2 -translate-x-1/2 w-[90%] bg-gray-100 rounded-full shadow-lg z-40 flex items-center px-4 py-2 border border-gray-200 '
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
        )}
        {sidebar}
       
      </div>
    </div>
  )
}

export default Navbar
