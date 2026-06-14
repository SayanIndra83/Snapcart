import { ArrowLeft, EyeClosed, EyeIcon, Leaf, Loader2, Lock, Mail} from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { motion } from 'motion/react'
import Link from 'next/link'
import Image from 'next/image'
import googleImage from "@/assets/google_logo.webp"
import { SignUpSchema } from '@/app/schemas/signup.schema'
import toast from 'react-hot-toast'
import { signIn, useSession } from 'next-auth/react'


function LoginForm() {
    const session = useSession()
    console.log(session)
    const router = useRouter()
    const [password, setPassword] = useState("")
    const [identifier, setIdentifier] = useState("")
    const [isPassShow, setIsPassShow] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [passError, setPassError] = useState("")

    const validataPass = ()=> {
        const result = SignUpSchema.safeParse({password})
        if(!result.success && result.error.flatten().fieldErrors.password){
            setPassError(result.error?.flatten().fieldErrors.password?.[0] ?? "")
        }
        else setPassError("")
    }

    const handleSubmit = async(e:React.FormEvent) =>{
        e.preventDefault()
        setIsSubmitting(true)
        try {
            const response = await signIn("credentials",{
                redirect:false,
                identifier, password
            })

            if(response.error){
                toast.error("Invalid combination")
                return
            }

            if(response.ok){
                toast.success("Logged in")
                router.push('/')
                router.refresh()
            }
        } catch (error) {
            toast.error("An unexpected error occurred")
        }finally{setIsSubmitting(false)}
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
        Welcome Back
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
      >Login to Snapcart <Leaf className='text-green-500'/></motion.p>

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

        {/* Email ot Mobile*/}
        <div
        className='relative'
        >
            <Mail size={20} className='absolute left-3 top-3.5 text-gray-500 z-99'/>
            <input 
            name='email or mobile'
            type='text' 
            placeholder='Enter email or mobile number' 
            required={true}
            spellCheck={false}
            value={identifier}
            autoCorrect="off"
            autoCapitalize="off"
            onChange={(e) => setIdentifier(e.target.value)}
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
                const formValid = identifier!=="" && password!== "" && passError === ""
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
                    Logging in...
                    </>
                ):(
                    "Login"
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
                className='w-full flex gap-3 items-center justify-center bg-gray-100 hover:bg-gray-200 py-2.5 rounded-2xl cursor-pointer text-gry-700 text-sm font-medium transition-all duration-200'
                >
                <Image src={googleImage} alt='google logo' width={20} height={20} 
                /> Continue with Google
        </button>
      </motion.form>

      <div className='inline-flex items-center justify-center text-gray-600 text-sm mt-5 gap-2 font-medium'>
        <span>
            Don't have an account ?
        </span>
        <Link
        href={'/sign-up'}
        className='text-green-600 hover:text-green-700 transition-all duration-200'
        >Create Account</Link>
      </div>
    </div>
  )
}

export default LoginForm
