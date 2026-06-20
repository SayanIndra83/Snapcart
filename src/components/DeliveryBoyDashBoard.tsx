'use client'

import { getSocket } from "@/app/lib/socket"
import { IAssign } from "@/app/models/delivery-assignment.model"
import { ApiResponse } from "@/app/types/ApiResponse"
import axios, { AxiosError } from "axios"
import mongoose from "mongoose"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"

function DeliveryBoyDashBoard() {
  const [assignments, setAssingnments] = useState<any[]>([])
    useEffect(() => {
      const assignmentFetch = async () => {
        try {
          const response = await axios.get('/api/deliveryboy/get-assignments')
          // console.log(response.data.assignments)
          setAssingnments(response.data.assignments)
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>
          toast.error(axiosError.response?.data?.message!)
        }
      }

      assignmentFetch()
    }, [])

    useEffect(():any =>{
      const socket = getSocket()
      socket.on("order-assign", (deliveryAssignment) => {
        // console.log(data)
        setAssingnments((prev) => [deliveryAssignment, ...prev!])
      })

      return () => socket.off("order-assign")
    }, [])

    const handleAccept = async (action: string, assignmentId: mongoose.Types.ObjectId) => {
      try {
        const response = await axios.post('/api/deliveryboy/accept-assignment', {assignmentId, action})
        console.log(response)
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>
          toast.error(axiosError.response?.data?.message!)
      }
    }
  return (
    <div className="w-full min-h-screen bg-gray-50 p-4">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mt-[120px] mb-4">Delivery Assignments</h2>
        {assignments?.map((data, idx) => (
          <div key={idx} className="p-5 bg-white rounded-xl shadow mb-4 border" 
          >
            <p><b>Order Id</b> #{String(data.order._id).slice(-6)}</p>
            <p className="text-sm text-gray-600 truncate">{data.order.address.fullAddress}</p>

            <div className="flex gap-3 mt-4">
              <button className="text-white bg-green-600 py-2 flex-1 rounded-lg hover:bg-green-700  transition-all duration-300 cursor-pointer font-semibold"
              onClick={(e) => {
                e.preventDefault()
                handleAccept("accept", data._id)
              }}
              >Accept</button>
              <button className="text-white bg-red-600 py-2 flex-1 rounded-lg hover:bg-red-700 transition-all duration-300 cursor-pointer font-semibold"
              onClick={(e) => {
                e.preventDefault()
                handleAccept("reject", data._id)
              }}
              >Reject</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default DeliveryBoyDashBoard
