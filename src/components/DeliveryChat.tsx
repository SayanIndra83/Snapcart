'use client'

import { getSocket } from "@/app/lib/socket"
import { IMessage } from "@/app/models/Message.model"
import { ApiResponse } from "@/app/types/ApiResponse"
import axios, { AxiosError } from "axios"
import { Send } from "lucide-react"
import mongoose from "mongoose"
import { AnimatePresence } from "motion/react"
import { useEffect, useRef, useState } from "react"
import { motion } from "motion/react"
interface IChat{
userId: mongoose.Types.ObjectId,
deliveryBoyId: mongoose.Types.ObjectId,
orderId: mongoose.Types.ObjectId,
}



function DeliveryChat({userId, deliveryBoyId, orderId}: IChat) {
    const [text, setText] = useState("")
    const [messages, setMessages] = useState<IMessage[]>()
    const chatBoxRef = useRef<HTMLDivElement> (null)

    // join room
    useEffect(():any => {
        const socket = getSocket()

        socket.emit("join-room", orderId)

        socket.on("send-message", (message) => {
        if(message.roomId === orderId){
        setMessages((prev) => [...prev!, message])}
        })

        return () => socket.off("send-message")

    }, [])   
    
    const sendMessage = () => {
        const socket = getSocket()

        const message = {
            roomId: orderId,
            text, 
            senderId: deliveryBoyId,
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
                const response = await axios.get(`/api/chat/get-messages/${orderId}`)
                setMessages(response.data.messages)
                // console.log(response)
            } catch (error) {
                const axiosError = error as AxiosError<ApiResponse>

                console.log(axiosError.response?.data.message)
            }
        }

        getAllMessages()
    }, [])

    useEffect(() => {
        chatBoxRef.current?.scrollTo({
            top: chatBoxRef.current.scrollHeight,
            behavior: "smooth"
        })
    }, [messages])

    
  return (
    <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-4 h-[430px] flex flex-col">

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
                    ${message.senderId === deliveryBoyId ? ("justify-end") : ("justify-start")}
                    `}
                >
                    <div className={`px-4 py-2 max-w-[75%] rounded-2xl shadow-lg
                        ${message.senderId === deliveryBoyId ? ("bg-green-600 text-white rounded-br-none") : ("bg-gray-100 text-gray-800 rounded-bl-none")}
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
            className="flex-1 bg-gray-100 px-4 py-2 rounded-xl border border-gray-300/60 outline-none focus:ring-green-500 focus:ring-2" />
            <button 
            disabled={!text}
            className="bg-green-600 hover:bg-green-700 transition-all duration-300 text-white rounded-xl py-1 px-5 cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"
            onClick={sendMessage}
            ><Send size={18}/></button>
        </div>
    </div>
  )
}

export default DeliveryChat
