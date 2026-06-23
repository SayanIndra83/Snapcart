'use client'
import { getSocket } from '@/app/lib/socket'
import LoaderBox from '@/app/loader'
import { IOrder } from '@/app/models/order.model'
import { IUser } from '@/app/models/user.model'
import { ApiResponse } from '@/app/types/ApiResponse'
import { ILocation } from '@/components/DeliveryBoyDashBoard'
import LiveMapCustomer from '@/components/LiveMapCustomer'
import axios, { AxiosError } from 'axios'
import { ArrowLeft, Loader2, Send, Sparkle, Loader, CheckCircle2, PackageCheck } from 'lucide-react'
import { AnimatePresence } from 'motion/react'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { motion } from 'motion/react'
import { IMessage } from '@/app/models/Message.model'

function Page({params} : {params: {orderId : string}}) {
  const [loading, setLoading] = useState(false)
  const [userLocation, setUserLocation] = useState<ILocation>({
    lattitude: 0, longitude: 0
  })
  
  const [deliveryBoyLocation, setDeliveryBoyLocation] = useState<ILocation>({
    lattitude: 0, longitude: 0
  })
  
  const [order, setOrder] = useState<IOrder>()
  const [deliveryBoy, setDeliveryBoy] = useState<IUser |null>()
  const {orderId} = useParams()
  const router = useRouter()
  const [text, setText] = useState("")
  const [messages, setMessages] = useState<IMessage[]>()
  const chatBoxRef = useRef<HTMLDivElement>(null)
  const [suggestions, setSuggestions] = useState([
        "Hello", "Thank you", "Where are you"
    ])

  const [suggestionLoading, setSuggestionLoading] = useState(false)
  
  useEffect(() => {
    const trackOrder = async () => {
      setLoading(true)
      try {
        const response = await axios.get(`/api/user/track-my-order/${orderId}`)

        setUserLocation({
          lattitude: response.data.order.address.lattitude,
          longitude: response.data.order.address.longitude 
        })
        
        if (response.data.order.assignedDeliveryBoy?.location?.coordinates) {
            setDeliveryBoyLocation({
              lattitude: response.data.order.assignedDeliveryBoy.location.coordinates[1],
              longitude: response.data.order.assignedDeliveryBoy.location.coordinates[0]
            })
        }

        setOrder(response.data.order)
        setDeliveryBoy(response.data.order.assignedDeliveryBoy)

      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>
        toast.error(axiosError.response?.data.message || "Failed to load order")
      } finally {
        setLoading(false)
      }
    }

    trackOrder()
    
  }, [orderId])

  useEffect((): any => {
    const socket = getSocket()
    socket.on("update-deliveryboy-location-live", ({userId, location}) => {
      if(String(userId) === String(order?.assignedDeliveryBoy?._id)) {
        setDeliveryBoyLocation({
          lattitude: location.coordinates[1],
          longitude: location.coordinates[0]
        })
      }
    })

    return ()=> socket.off("update-deliveryboy-location-live")
  }, [order])

  // join room
      useEffect(():any => {
        if(order) {
          const socket = getSocket()
          socket.emit("join-room", order._id)

          socket.on("send-message", (message) => {
          if(message.roomId === order._id){
          setMessages((prev) => [...prev!, message])}
          })

          return () => socket.off("send-message")
        }
      }, [order])   
      
      const sendMessage = () => {
        if(!order) return 
          const socket = getSocket()
  
          const message = {
              roomId: order._id,
              text, 
              senderId: order?.user,
              time: new Date().toLocaleTimeString([], {
                  hour: "2-digit",
                  minute:"2-digit"
              })
          }
          socket.emit("send-message", message)
          
              
          setText("")
      }
  
      useEffect(() => {
          const getAllMessages = async () => {
              try {
                  const response = await axios.get(`/api/chat/get-messages/${order!._id}`)
                  setMessages(response.data.messages)
                  // console.log(response)
              } catch (error) {
                  const axiosError = error as AxiosError<ApiResponse>
  
                  console.log(axiosError.response?.data.message)
              }
          }

          if(order){
            getAllMessages()
          }
          
      }, [order])
  
      useEffect(() => {
        chatBoxRef.current?.scrollTo({
            top: chatBoxRef.current.scrollHeight,
            behavior: "smooth"
        })
    }, [messages])

    const suggestMessage = async () => {
      setSuggestionLoading(true)
        try {
            const lastMessage = messages?.filter((m => m.senderId !== order?.user)).at(-1)
            const response = await axios.post(`/api/chat/ai-suggestion`, {
                message: lastMessage?.text,
                role: "user"
            })
            console.log(response.data.data)
            setSuggestions(response.data.data.candidates[0].content.parts[0].text.split(","))
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            console.log(axiosError.response?.data.message)
        }finally{
          setSuggestionLoading(false)
        }
    }

    useEffect((): any => {
      const socket = getSocket()
      socket.on("order-delivered", (data) => {
        if(String(data._id) === orderId){
          setOrder(data)
          setDeliveryBoy(null)
          setDeliveryBoyLocation({
            lattitude: 0,
            longitude: 0
          })
        }
      })

      return ()=> socket.off("order-delivered")
    },[order])

  if(loading) return (<LoaderBox/>)

  return (
    <div className="min-h-screen w-full">
      
      <div className='sticky top-0 left-0 w-full backdrop-blur-xl bg-white/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)] border-b border-gray-100 z-50'>
        <div className='max-w-6xl mx-auto flex items-start sm:items-center gap-3 sm:gap-4 px-4 py-3.5'>
          
          <button 
            className='p-2 bg-gray-50 border border-gray-100 rounded-xl hover:bg-gray-100 active:scale-95 transition-all duration-200 cursor-pointer flex items-center justify-center group shrink-0 mt-0.5 sm:mt-0'
            onClick={() => router.push('/user/my-orders')}
          >
            <ArrowLeft size={18} className='text-gray-600 group-hover:text-gray-900'/>
          </button>
          
          <div className="flex flex-col md:flex-row md:justify-between md:items-center w-full gap-2.5 md:gap-4">
            <h1 className='text-lg sm:text-xl font-bold text-gray-900 leading-none'>Track My Order</h1>
            
            <div className='flex flex-wrap items-center gap-2 sm:gap-3'>
              {order ? (
                <>
                  <span className='inline-flex items-center text-gray-600 font-medium gap-1.5 text-xs sm:text-sm bg-gray-50 border border-gray-200 px-2.5 py-1.5 rounded-lg'>
                    <b>🗒️ Order</b>
                    <span className='text-red-500 font-semibold'>#{order?._id?.toString().slice(-6)}</span>
                  </span>
                  {deliveryBoy && 
                  
                  <span className='text-gray-700 inline-flex gap-1.5 font-medium text-xs sm:text-sm bg-green-50 border border-green-100 rounded-lg py-1.5 px-2.5 items-center'>
                    🛵 Partner:
                    <span className='capitalize font-bold text-green-700 truncate max-w-[120px] sm:max-w-none'>
                      {deliveryBoy?.username}
                    </span>
                  </span>

                  }
                </>
              ) : order ? (
                <span className='inline-flex items-center gap-2 text-xs sm:text-sm text-orange-600 font-medium bg-orange-50 border border-orange-100 px-3 py-1.5 rounded-lg'>
                  <Loader2 size={14} className='animate-spin'/> 
                  Assigning Partner...
                </span>
              ) : null}
            </div>
          </div>

        </div>
      </div>
      
      {

        order?.status === "delivered" ? (
          <div className='max-w-3xl mx-auto px-4 sm:px-8 py-12 sm:py-20'>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 sm:p-12 text-center flex flex-col items-center justify-center relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-green-50/50 to-transparent"></div>
              
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
                className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 relative z-10"
              >
                <PackageCheck size={44} className="text-green-600" />
                <motion.div 
                   initial={{ scale: 0 }}
                   animate={{ scale: 1 }}
                   transition={{ delay: 0.5, type: "spring" }}
                   className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-sm"
                >
                  <CheckCircle2 size={24} className="text-green-500 fill-green-50" />
                </motion.div>
              </motion.div>

              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 relative z-10">
                Order Delivered Successfully!
              </h2>
              
              <p className="text-gray-500 max-w-md mx-auto mb-8 relative z-10 text-sm sm:text-base leading-relaxed">
                Your order <span className="font-semibold text-gray-700">#{order?._id?.toString().slice(-6)}</span> has securely reached its destination. Thank you for shopping with us!
              </p>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push('/user/my-orders')}
                className="px-8 py-3 bg-green-600 text-white rounded-xl font-medium shadow-lg shadow-green-600/20 hover:bg-green-700 transition-colors relative z-10 cursor-pointer"
              >
                View All Orders
              </motion.button>
            </motion.div>
          </div>
        ) 
        
        : (
          <>
          <div className='max-w-6xl mx-auto px-4 sm:px-8 py-6 sm:py-8'>
        <div className="rounded-2xl border border-gray-200 shadow-lg overflow-hidden mb-6 bg-white">
          <LiveMapCustomer 
             userLocation={userLocation} 
             deliveryBoyLocation={deliveryBoyLocation} 
          />
        </div>
      </div>


      <div className='max-w-6xl mx-auto px-4 sm:px-8 py-6 sm:py-8'>

      <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-4 h-[430px] flex flex-col" 
      >


         <div className="flex justify-between items-center mb-3">
            <span className="font-semibold text-gray-700 text-sm">AI suggestions</span>
            <motion.button
            whileTap={{scale: 0.9}}
            className="px-3 py-1 text-xs flex items-center gap-1 bg-purple-100 text-purple-700 rounded-full shadow-sm border border-purple-200 cursor-pointer disabled:cursor-not-allowed"
            onClick={suggestMessage}
            disabled={suggestionLoading}
            >
                <Sparkle size={18}/>
                {suggestionLoading ? (<Loader size={20} className='animate-spin'/>) : ("Suggest Replies")}
                </motion.button>
        </div>

        <div className="flex gap-2 flex-wrap mb-3">
            {suggestions.map((suggestion, idx) => (
                <motion.div
                key={idx}
                whileTap={{scale: 0.92}}
                className="px-3 py-1 text-xs bg-green-50 border-green-200 text-green-700 rounded-full cursor-pointer"
                onClick={(e) =>{
                    setText(suggestion)
                }}
                >
                    {suggestion}
                </motion.div>
            ))}
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-3"
        ref={chatBoxRef}
        >
            <AnimatePresence>
               {messages?.map((message, idx) => (
                <motion.div
                key={idx}
                initial={{
                    opacity:0, y:15
                }}
                animate={{
                    opacity: 1, y: 0
                }}
                exit={{
                    opacity: 0
                }}
                transition={{
                    duration: 0.2
                }}

                className={`flex 
                    ${message.senderId === order?.user ? ("justify-end") : ("justify-start")}
                    `}
                >
                    <div className={`px-4 py-2 max-w-[75%] rounded-2xl shadow-lg
                        ${message.senderId === order?.user ? ("bg-green-600 text-white rounded-br-none") : ("bg-gray-100 text-gray-800 rounded-bl-none")}
                        `}>
                    <p className="text-sm font-medium">{message.text}</p>
                    <p className="text-[10px] opacity-70 mt-1 text-right">{message.time}</p>
                    </div>
                    
                </motion.div>
               ))}
            </AnimatePresence>
        </div>

        <div className=" flex gap-2 pt-3 mt-3">
            <input 
            type="text" 
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a message..." 
            className="flex-1 bg-gray-100 px-4 py-2 border border-gray-300/60 rounded-xl outline-none focus:ring-green-500 focus:ring-2" />
            <button 
            disabled={!text}
            className="bg-green-600 hover:bg-green-700 transition-all duration-300 text-white rounded-xl py-1 px-5 cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"
            onClick={sendMessage}
            ><Send size={18}/></button>
        </div>
    </div>
      </div>
          </>
        )
      }

      

    </div>
  )
}

export default Page