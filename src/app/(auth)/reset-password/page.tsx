'use client'
import { MailSchema, PassSchema } from "@/app/schemas/mail-pass.schema"
import { VerifySchema } from "@/app/schemas/verify.schema"
import { ApiResponse } from "@/app/types/ApiResponse"
import axios, { AxiosError } from "axios"
import { EyeClosed, EyeIcon, Key, Loader2, Lock } from "lucide-react"
import { motion } from "motion/react"
import { redirect, useParams, useRouter } from "next/navigation"
import React, { useState } from "react"
import toast from "react-hot-toast"


function page() {
    const [otp, setOtp] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmedPassword, setConfirmedPassword] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [otpError, setOtpError] = useState("")
    const [emailError, setEmailError] = useState("")
    const [passError, setPassError] = useState("")
    const [confirmedPassError, setConfirmedPassError] = useState("")
    const[isMailVerified, setIsMailVerified] = useState(false)
    const [isPassShow, setIsPassShow] = useState(false)
    const [isConfirmPassShow, setIsConfirmPassShow] = useState(false)
    const router = useRouter()

    const handleEmailError = () => {
        const result = MailSchema.safeParse({email})
        if(!result.success){
            setEmailError(result.error?.flatten().fieldErrors.email?.[0] ?? "")
        }
        else setEmailError("")
    }
    const handlePassError = () => {
        const result = PassSchema.safeParse({password})
        if(!result.success){
            setPassError(result.error?.flatten().fieldErrors.password?.[0] ?? "")
        }
        else setPassError("")
    }
    const handleConfirmedPassError = () => {
        if(password !== confirmedPassword) setConfirmedPassError("Please ensure both passwords match.")
        else setConfirmedPassError("")
    }
    const handleOtpError = () => {
        const result = VerifySchema.safeParse({otp})
        if(!result.success){
            setOtpError(result.error?.flatten().fieldErrors.otp?.[0] ?? "")
        }
        else setOtpError("")
    }

    const handleVerify = async(e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if(emailError !== "") return null
        setIsSubmitting(true)
        try {
            const response = await axios.post('/api/forget-password', {email})
            toast.success(response.data?.message ?? "Email verified, otp sent")
            setIsMailVerified(true)
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            toast.error(axiosError?.response?.data?.message ?? "Something went wrong")
            setIsMailVerified(false)
            setPassword("")
        }finally{
            setIsSubmitting(false)
            setEmailError("")
        }
    }

    const handleSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if(passError !== "" || confirmedPassError !== "" || otpError !== "") return null
        setIsSubmitting(true)
        try {
            const response = await axios.post('/api/reset-password', {
                email, password, otp
            })
            toast.success(response.data?.message ?? "Password reset succesfull")
            router.push('/sign-in')
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            toast.error(axiosError?.response?.data?.message ?? "Something went wrong")
        }finally{
            setIsSubmitting(false)
            setPassError("")
            setPassword("")
            setConfirmedPassError("")
            setConfirmedPassword("")
            setOtp("")
            setOtpError("")
        }
    }

  return (
    <div 
    className="flex flex-col gap-3 w-full items-center justify-center min-h-screen">

    
    {!isMailVerified
    ? (
        <>
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
            Verify Email
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
              >Enter your registered email address</motion.p>
        <motion.form
        onSubmit={handleVerify}
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
      className='flex flex-col gap-4 w-full max-w-sm mt-4'
        >
            <input 
            name="email"
            type="email"
            value={email}
            onChange={(e) => {
                setEmail(e.target.value)
               if(emailError) setEmailError("")
            }}
            onBlur={handleEmailError}
            placeholder="eg: john@example.com"
            className="focus:outline-none w-full border-1 border-gray-300 rounded-2xl bg-transparent px-5 py-3 text-gray-800 focus:ring-2 focus:ring-green-500"
            />

            {
                emailError && (
                    <p className="text-red-500 text-xs mt-1 ml-2">{emailError}</p>
                )
            }

            {(()=> {
                const isNotValid =  (email === "" && emailError !== "")
                return <button
                type="submit"
                disabled={isNotValid || isSubmitting}
                className='mt-2 w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed shadow-md
                py-2.5 rounded-2xl cursor-pointer text-white font-semibold text-md transition-all duration-200 flex items-center justify-center gap-4'
                >
            {
                isSubmitting? (
                    <>
                    <Loader2 size={20} className='animate-spin text-green-300'/>
                    Verifying...
                    </>
                ):(
                    "Verify"
                )
            }
                </button>
            })()}
        </motion.form>
        </>
    ) 
    : (
         <>
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
            Reset Password
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
              >Change your password</motion.p>
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
      className='flex flex-col gap-4 w-full max-w-sm mt-4'
        >
            <div
            className="relative"
            >
               <Key size={20} className='absolute left-3 top-3.5 text-gray-500 z-99'/>
            <input 
            name="otp"
            type="text"
            inputMode="numeric"
            maxLength={6}
            value={otp}
            onChange={(e) => {setOtp(e.target.value.replace(/\D/g, ""))
               if(otpError) setOtpError("")
            }}
            onBlur={handleOtpError}
            placeholder="Enter OTP"
            className="focus:outline-none w-full border-1 border-gray-300 rounded-2xl bg-transparent pl-10 pr-4 py-3 text-gray-800 focus:ring-2 focus:ring-green-500"
            />

            {
                otpError && (
                    <p className="text-red-500 text-xs mt-1 ml-2">{otpError}</p>
                )
            } 
            </div>
            

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
                        onBlur={handlePassError}
                        className='focus:outline-none w-full border border-gray-300 rounded-2xl bg-transparent pl-10 pr-4 py-2.5 text-gray-800 focus:ring-2 focus:ring-green-500'/>
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

                    {/* confirmed password */}
            <div
                    className='relative'
                    >
                         <Lock size={20} className='absolute left-3 top-3.5 text-gray-500 z-99'/>
                        <input 
                        name='password'
                        type={isConfirmPassShow? "text":"password"} 
                        placeholder='Confirm your password' 
                        required={true}
                        spellCheck={false}
                        value={confirmedPassword}
                        autoCorrect="off"
                        autoCapitalize="off"
                        onChange={(e) => {setConfirmedPassword(e.target.value)
                            if(confirmedPassError) setConfirmedPassError("")
                        }}
                        onBlur={handleConfirmedPassError}
                        className='focus:outline-none w-full border border-gray-300 rounded-2xl bg-transparent pl-10 pr-4 py-2.5 text-gray-800 focus:ring-2 focus:ring-green-500'/>
                        <button className='absolute right-3 top-3.5 text-gray-500 z-99 cursor-pointer'
                        onClick={() => setIsConfirmPassShow(!isConfirmPassShow)}
                        
                        type='button'
                        >
                            {
                                isConfirmPassShow? 
                                <EyeClosed size={20}/>
                                :
                                <EyeIcon size={20}/>
                            }
                        </button>
            
                        {confirmedPassError &&
                        (
                            <p className="text-red-500 text-xs mt-1 ml-2">{confirmedPassError}</p>
                        )}
                    </div>        


            {(()=> {
                const isValid =  (otp !== "" && password !== "" && confirmedPassError ==="" &&confirmedPassword !== "" && otpError === "" && passError === "" && confirmedPassError === "")
                return <button
                type="submit"
                disabled={!isValid || isSubmitting}
                className='mt-2 w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed shadow-md
                py-2.5 rounded-2xl cursor-pointer text-white font-semibold text-md transition-all duration-200 flex items-center justify-center gap-4'
                >
            {
                isSubmitting? (
                    <>
                    <Loader2 size={20} className='animate-spin text-green-300'/>
                    Submitting...
                    </>
                ):(
                    "Submit"
                )
            }
                </button>
            })()}
        </motion.form>
        </>
    )}
    </div>
    
  )
}

export default page
