'use client'
import { VerifySchema } from "@/app/schemas/verify.schema"
import { ApiResponse } from "@/app/types/ApiResponse"
import axios, { AxiosError } from "axios"
import { Loader2 } from "lucide-react"
import { motion } from "motion/react"
import { useParams, useRouter } from "next/navigation"
import React, { useState } from "react"
import toast from "react-hot-toast"


function page() {
    const [otp, setOtp] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [otpError, setOtpError] = useState("")
    const router = useRouter()
    const handleOtpError = () => {
        const result = VerifySchema.safeParse({otp})
        if(!result.success){
            setOtpError(result.error?.flatten().fieldErrors.otp?.[0] ?? "")
        }
        else setOtpError("")
    }

    const params = useParams<{email: string}>()
    const decodedEmail = decodeURIComponent(params.email)
    // console.log(decodedEmail)
    const handleSubmit = async(e:React.FormEvent<HTMLFormElement>) =>{
        e.preventDefault()
        if(otpError !== "") return
        setIsSubmitting(true)
        try {
            const response = await axios.post(`/api/verify-otp`, {
                email: decodedEmail,
                otp
            })

            toast.success(response.data.message ?? "Verified")
            router.push('/sign-in')
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>

            toast.error(axiosError.response?.data?.message ?? "Internal server error")
        }
        finally{
            setIsSubmitting(false)
        }
    }


  return (
    <div className="flex flex-col gap-3 w-full items-center justify-center min-h-screen">
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
            Verify OTP
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
              >Verify your OTP</motion.p>
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
            className="focus:outline-none w-full border-1 border-gray-300 rounded-2xl bg-transparent px-5 py-3 text-gray-800 focus:ring-2 focus:ring-green-500"
            />

            {
                otpError && (
                    <p className="text-red-500 text-xs mt-1 ml-2">{otpError}</p>
                )
            }

            {(()=> {
                const isValid =  (otp !== "")
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
                    Verifying...
                    </>
                ):(
                    "Verify"
                )
            }
                </button>
            })()}
        </motion.form>
    </div>
  )
}

export default page
