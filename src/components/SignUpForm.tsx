import { ArrowLeft, EyeClosed, EyeIcon, Leaf, Loader2, Lock, Mail, Phone, User } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { motion } from 'motion/react'
import axios, { AxiosError } from 'axios'
import Link from 'next/link'
import Image from 'next/image'
import googleImage from "@/assets/google_logo.webp"
import { SignUpSchema } from '@/app/schemas/signup.schema'
import toast from 'react-hot-toast'
import { ApiResponse } from '@/app/types/ApiResponse'
import { signIn } from 'next-auth/react'

function SignUpForm() {
    const router = useRouter()
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")
    const [mobile, setMobile] = useState("")
    const [isPassShow, setIsPassShow] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [passError, setPassError] = useState("")

    const validataPass = ()=> {
        const result = SignUpSchema.safeParse({username, email, password, mobile})
        if(!result.success && result.error.flatten().fieldErrors.password){
            setPassError(result.error?.flatten().fieldErrors.password?.[0] ?? "")
        }
        else setPassError("")
    }

    const handleSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if(passError !== "") return 
        setIsSubmitting(true)
        try {
            const response = await axios.post(`/api/sign-up`, {
                username, password, mobile, email
            })
            toast.success(response?.data.message ?? "Account created")
            router.push(`/verify/${email}`)
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            toast.error(axiosError.response?.data.message?? "Signup failed")
        }finally{
            setUsername(""), setEmail(""), setPassword(""), setMobile("")
            setIsSubmitting(false)
        }
    }
  return (
    <div className=' relative min-h-screen px-6 py-10 flex flex-col justify-center items-center'>
        {/* back button */}
      <button
      className='absolute top-5 left-5 inline-flex text-green-700 z-99 gap-2 items-center font-semibold text-xl group hover:text-green-800 transition-all duration-200 cursor-pointer'
      onClick={() => router.push('/')}
      >
        <ArrowLeft size={20} className='group-hover:-translate-x-0.5 transition-all duration-200'/>
        Back
      </button>

      <motion.h1
      initial={{
        opacity:0,
        y:-10
      }}
      animate={{
        opacity:1,
        y:0
      }}
      transition={{
        duration:0.7

      }}
      className='text-4xl text-green-700 font-bold mb-2'
      >
        Create Account
      </motion.h1>
      <motion.p 
      initial={{
        opacity: 0,
        y:5
      }}
      animate={{
        y:0,
        opacity:1
      }}
      transition={{
        duration:0.3,
        delay:0.5
      }}
      className='inline-flex gap-2 text-gray-700 text-md max-w-md'
      >Join Snapcart today <Leaf className='text-green-500'/></motion.p>

      <motion.form
      onSubmit={handleSubmit}
      initial={{
        opacity: 0,
        y:5
      }}
      animate={{
        y:0,
        opacity:1
      }}
      transition={{
        duration:0.3,
        delay:0.5
      }}
      className='flex flex-col gap-4 w-full max-w-sm mt-4'>
        {/* username */}
        <div
        className='relative'
        >
            <User size={20} className='absolute left-3 top-3.5 text-gray-500 z-99'/>
            <input 
            name='username'
            type='text' 
            placeholder='Enter your name' 
            value={username}
            required={true}
            spellCheck={false}
            autoCorrect="off"
            autoCapitalize="off"
            onChange={(e) => setUsername(e.target.value)}
            className='focus:outline-none w-full border-1 border-gray-300 rounded-2xl bg-transparent pl-10 pr-4 py-2.5 text-gray-800 focus:ring-2 focus:ring-green-500'/>
        </div>

        {/* Email */}
        <div
        className='relative'
        >
            <Mail size={20} className='absolute left-3 top-3.5 text-gray-500 z-99'/>
            <input 
            name='email'
            type='email' 
            placeholder='Enter your email' 
            required={true}
            spellCheck={false}
            value={email}
            autoCorrect="off"
            autoCapitalize="off"
            onChange={(e) => setEmail(e.target.value)}
            className='focus:outline-none w-full border-1 border-gray-300 rounded-2xl bg-transparent pl-10 pr-4 py-2.5 text-gray-800 focus:ring-2 focus:ring-green-500'/>
        </div>

        {/* mobile */}
        <div
        className='relative'
        >
            <Phone size={20} className='absolute left-3 top-3.5 text-gray-500 z-99'/>
            <input 
            name='mobile'
            type='text' 
            inputMode='numeric'
            maxLength={10}
            value={mobile}
            required={true}
            spellCheck={false}
            autoCorrect="off"
            autoCapitalize="off"
            placeholder='Enter your mobile number' 
            onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
            className='focus:outline-none w-full border-1 border-gray-300 rounded-2xl bg-transparent pl-10 pr-4 py-2.5 text-gray-800 focus:ring-2 focus:ring-green-500'/>
        </div>

        {/* password */}
        <div
        className='relative'
        >
            <Lock size={20} className='absolute left-3 top-3.5 text-gray-500 z-99'/>
            <input 
            name='password'
            type={isPassShow? "text":"password"} 
            placeholder='Enter your password' 
            required={true}
            spellCheck={false}
            value={password}
            autoCorrect="off"
            autoCapitalize="off"
            onChange={(e) => {setPassword(e.target.value)
                if(passError) setPassError("")
            }}
            onBlur={validataPass}
            className='focus:outline-none w-full border-1 border-gray-300 rounded-2xl bg-transparent pl-10 pr-4 py-2.5 text-gray-800 focus:ring-2 focus:ring-green-500'/>
            <button className='absolute right-3 top-3.5 text-gray-500 z-99 cursor-pointer'
            onClick={() => setIsPassShow(!isPassShow)}
            
            type='button'
            >
                {
                    isPassShow? 
                    <EyeClosed size={20}/>
                    :
                    <EyeIcon size={20}/>
                }
            </button>

            {passError &&
            (
                <p className="text-red-500 text-xs mt-1 ml-2">{passError}</p>
            )}
        </div>

        {/* Button section */}
        {
            (() => {
                const formValid = username !== "" && email!=="" && password!== "" && mobile!== "" && passError === ""
                return <button
                disabled={isSubmitting || !formValid}
                type='submit'
                className='mt-2 w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed shadow-md
                py-2.5 rounded-2xl cursor-pointer text-white font-semibold text-md transition-all duration-200 flex items-center justify-center gap-4'
                >
            {
                isSubmitting? (
                    <>
                    <Loader2 size={20} className='animate-spin text-green-300'/>
                    Registering...
                    </>
                ):(
                    "Register"
                )
            }
        </button>
            })()
        }

        <div className='w-full flex gap-2 text-gray-400 text-sm mt-1 items-center'>
            <span className='flex-1 h-px bg-gray-200'></span>
            <span>OR</span>
            <span className='flex-1 h-px bg-gray-200'></span>
        </div>
        
        <button
        type='button'
                className='w-full flex gap-3 items-center justify-center bg-gray-100 hover:bg-gray-200 py-2.5 rounded-2xl  cursor-pointer text-gry-700 text-sm font-medium transition-all duration-200'
                onClick={() => {signIn("google", {callbackUrl:'/'})}}
                >
                <Image src={googleImage} alt='google logo' width={20} height={20} 
                /> Continue with Google
        </button>
      </motion.form>

      <div className='inline-flex items-center justify-center text-gray-600 text-sm mt-5 gap-2 font-medium'>
        <span>
            Already have an account ?
        </span>
        <Link
        href={'/sign-in'}
        className='text-green-600 hover:text-green-700 transition-all duration-200'
        >Login</Link>
      </div>
    </div>
  )
}

export default SignUpForm
