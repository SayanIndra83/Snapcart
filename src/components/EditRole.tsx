'use client'
import { ApiResponse } from "@/app/types/ApiResponse"
import axios, { AxiosError } from "axios"
import { ReactNode, useState } from "react"
import toast from "react-hot-toast"
import { motion } from "motion/react"
import { ArrowRight, Bike, Loader2, Phone, User, UserCog } from "lucide-react"
import { redirect, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"

export interface IUser{
        id?: string,
        isVerified?: boolean,
        role?: string,
        username? : string
        mobile?: string
        image? : string
}

function EditRole({user} : {user:IUser}) {
    const {update} = useSession()
    const[isSubmitting, setIsSubmitting] = useState(false)
    const [selectedRole, setSelectedRole] = useState(user.role)
    const userRole = [
         // "user" | "admin" | "deliveryboy"
        {id: "admin", label: "Admin", icon: UserCog},
        {id: "user", label: "User", icon: User},
        {id: "deliveryboy", label: "Delivery Boy", icon: Bike}
    ]
    const[mobileNo, setMobileNo] = useState(user.mobile)
    const [mobileError, setMobileError] = useState("")
    const router = useRouter()


    const validateMobile = () => {
        const result = (mobileNo?.length === 10);
        if(!result){
            setMobileError("Enter a valid mobile number")
        }
        else{
            setMobileError("")
        }
    }

    const handleSave = async ()=> {
        if(mobileError !== "") return null

        setIsSubmitting(true)
        try {
           const response = await axios.post(`/api/user/update-role-mobile`, {
            mobile: mobileNo, 
            role: selectedRole
           })
           await update({
            role: selectedRole,
            mobile: mobileNo
           })
           toast.success(response.data?.message || "Updation sucessfull")
           router.push("/")
           
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            toast.error(axiosError.response?.data?.message ?? "An unexpected error occured")
            setSelectedRole(user.role)
        }
        finally{
            setIsSubmitting(false)
            setMobileNo("")
        }
    }
  return (
    <div className="flex flex-col min-h-screen p-6 items-center">
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
      className='text-4xl text-green-700 font-bold mb-2 text-center'
      >
        Select Your Role
      </motion.h1>

      <motion.div
      initial={{
                    opacity:0,
                    y:10
                }}
                animate={{
                    opacity:1,
                    y:0
                }}
                transition={{
                    duration:0.6,
                    delay:0.4
                }}
      className="flex flex-col md:flex-row gap-10 mt-10 justify-center items-center w-full"
      >
        {userRole.map((role, idx) =>{
            const Icon = role.icon
            const isSelected = (selectedRole == role.id)
            return(
                <motion.div
                key={idx}
                whileTap={{
                    scale:0.98
                }}
                className={`flex h-40 w-44 rounded-2xl flex-col items-center justify-center border-2 transition-all text-lg font-semibold gap-6 cursor-pointer
                    ${
                        isSelected
                        ? "border-green-600 bg-green-100 shadow-lg" 
                        : "border-gray-300 bg-white hover:border-green-400"
                    }
                    `}
                onClick={() => setSelectedRole(role.id)}
                >
                    <Icon size={26}/>
                    <span>{role.label}</span>
                </motion.div>
            )
        })}
      </motion.div>
      <motion.div
      initial={{
                opacity:0,
                }}
                animate={{
                    opacity:1,
                }}
                transition={{
                    duration:0.6,
                    delay:0.6
                }}

    className="flex flex-col gap-3 mt-10 items-center w-full"
      >
        <label htmlFor="mobile"
        className="text-gray-700 font-medium mb-2"
        >Enter Your Mobile No.</label>
        <div
        className='relative w-70'
        >
            <Phone size={16} className='absolute left-3 top-3.5 text-gray-500 z-99'/>
            <input 
            name='mobile'
            type='text' 
            inputMode='numeric'
            maxLength={10}
            value={mobileNo}
            required={true}
            spellCheck={false}
            autoCorrect="off"
            autoCapitalize="off"
            placeholder='eg: XXXXX - XXXXX' 
            onChange={(e) => {setMobileNo(e.target.value.replace(/\D/g, ''))
              setMobileError("")
            }}
            onBlur={validateMobile}
            className='focus:outline-none w-full border border-gray-300 rounded-2xl bg-transparent pl-10 pr-4 py-2.5 text-gray-800 focus:ring-2 focus:ring-green-500'/>
             {mobileError &&
            (
                <p className="text-red-500 text-xs mt-3 ml-2">{mobileError}</p>
            )}       
        </div>

      </motion.div>

      <motion.button
      initial={{
        y:10,
        opacity:0
      }}
      animate={{
        opacity:1,
        y:0
      }}
      transition={{
        delay:0.7
      }}
      type='submit'
      onClick={(e) => {
        e.preventDefault()
        handleSave()
      }}
      disabled={isSubmitting || mobileNo?.length !== 10 || !selectedRole}
                className='mt-10 bg-green-600 hover:bg-green-700  disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed shadow-md py-3 px-7 rounded-2xl cursor-pointer text-white font-semibold text-md transition-all duration-200 flex items-center justify-center gap-4 group'
                >
            {
                isSubmitting? (
                    <>
                    <Loader2 size={20} className='animate-spin text-green-300'/>
                    Saving changes...
                    </>
                ):(
                    <>
                    Save Changes <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-all duration-200 group-disabled:cursor-not-allowed"/>
                    </>
                )
            }
      </motion.button>
    </div>
  )
}

export default EditRole
