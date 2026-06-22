'use client'
import { getSocket } from "@/app/lib/socket"
import Loader from "@/app/loader"
import { ApiResponse } from "@/app/types/ApiResponse"
import { RootState } from "@/redux/store"
import axios, { AxiosError } from "axios"
import mongoose from "mongoose"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { useSelector } from "react-redux"
import LiveMap from "./LiveMap"
import { motion, AnimatePresence } from "motion/react"
import { Check, MapPin, Package, Phone, User, X, Bike } from "lucide-react"
import DeliveryChat from "./DeliveryChat"



export interface ILocation {
  lattitude : number,
  longitude: number
}

interface IAddres {
  city: string
  fullAddress: string
  fullName : string
  lattitude: number
  longitude: number
  mobile: string
  pincode: string
  state: string
}

function DeliveryBoyDashBoard() {
  const [assignments, setAssingnments] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [activeOrder, setActiveOrder] = useState<any>(null)
  const [activeOrderAddress, setActiveOrderAddress] = useState<IAddres>()
  const [userLocation, setUserLocation] = useState<ILocation>({
    lattitude: 0, longitude: 0
  })
  const [deliveryBoyLocation, setDeliveryBoyLocation] = useState<ILocation>({
    lattitude: 0, longitude: 0
  })
  const {userData} = useSelector((state : RootState) => state.user!)

  const assignmentFetch = async () => {
        setLoading(true)
        try {
          const response = await axios.get('/api/deliveryboy/get-assignments')
          setAssingnments(response.data.assignments)
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>
          toast.error(axiosError.response?.data?.message!)
        }finally{setLoading(false)}
      }

   const fetchActiveAssignment = async () => {
    setLoading(true)
      try {
        const response = await axios.get('/api/deliveryboy/current-order');
        if(response.data.assignment){
          setActiveOrder(response.data.assignment.order)
          setActiveOrderAddress(response.data.assignment.order.address)
          setUserLocation({
          lattitude: response.data.assignment.order.address.lattitude,
          longitude: response.data.assignment.order.address.longitude
        })
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>
        // toast.error(axiosError.response?.data?.message!)
        console.log(axiosError.response?.data?.message)
      }finally{setLoading(false)}
    }

    useEffect(() => {
      assignmentFetch()
      fetchActiveAssignment()
    }, [userData])

    useEffect(():any =>{
      const socket = getSocket()
      socket.on("order-assign", (deliveryAssignment) => {
        setAssingnments((prev) => [deliveryAssignment, ...prev!])
      })
      return () => socket.off("order-assign")
    }, [])

    useEffect(() => {
      const socket = getSocket()
      if(!userData || !navigator.geolocation) return
        const watcher = navigator.geolocation.watchPosition((pos) => {
                const lat = pos.coords.latitude
                const lng = pos.coords.longitude

                setDeliveryBoyLocation({
                  lattitude: lat, 
                  longitude: lng
                })
                socket.emit("updateLocation", {
                    userId: userData._id,
                    lattitude: lat,
                    longitude: lng
                })
            }, (err) => {
                console.log(err)
            }, {enableHighAccuracy: true})
        return()=> navigator.geolocation.clearWatch(watcher) 
    }, [userData?._id])

    const handleAccept = async (action: string, assignmentId: mongoose.Types.ObjectId) => {
      try {
        const response = await axios.post('/api/deliveryboy/accept-assignment', {assignmentId, action})
        toast.success(response.data.message ?? "Order updated")
        
        if(action === "reject") {
          assignmentFetch()
        }
        
        if (action === "accept") {
           fetchActiveAssignment()
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>
          // toast.error(axiosError.response?.data?.message!)
          console.log(axiosError.response?.data?.message)
      }
    }


    if(activeOrder && userLocation){
      return (
        <div className="min-h-screen bg-gray-50/50 pt-24 sm:pt-28 pb-8 px-4 sm:px-8">
          <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
            
            <div className="bg-white p-4 sm:p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
                   <span className="bg-green-100 text-green-700 p-2 rounded-xl"><Bike size={20}/></span>
                   Active Assignment
                </h1>
                <p className="text-gray-500 text-sm mt-1 font-medium">Order <span className="text-red-500 font-bold">#{activeOrder?._id?.toString().slice(-6)}</span></p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full md:w-auto">
                 <div className="flex items-center gap-2.5 bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5">
                   <User size={16} className="text-gray-400 shrink-0"/>
                   <span className="text-sm font-bold text-gray-700 capitalize truncate max-w-[150px]">{activeOrderAddress?.fullName}</span>
                 </div>
                 <div className="flex items-center gap-2.5 bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5">
                   <Phone size={16} className="text-gray-400 shrink-0"/>
                   <span className="text-sm font-bold text-gray-700">{activeOrderAddress?.mobile}</span>
                 </div>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 shadow-lg overflow-hidden bg-white">
              <LiveMap userLocation={userLocation} deliveryBoyLocation={deliveryBoyLocation}/>
            </div>

            <DeliveryChat userId={activeOrder.user} orderId={activeOrder._id} deliveryBoyId={activeOrder.assignedDeliveryBoy}/>
          </div>
        </div>
      )
    }

    if(loading) return (<Loader/>)


  return (
    <div className="w-full min-h-screen bg-gray-50/50 pt-24 sm:pt-28 pb-8 px-4 sm:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Delivery Requests</h2>
          <span className="bg-gray-200 text-gray-700 text-xs font-bold px-3 py-1 rounded-full">
            {assignments.length} Pending
          </span>
        </div>

        {assignments.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl border border-dashed border-gray-300 p-10 flex flex-col items-center text-center mt-10 shadow-sm"
          >
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4">
              <Package className="text-green-600" size={32} strokeWidth={1.5}/>
            </div>
            <h3 className="text-lg font-bold text-gray-900">No Pending Orders</h3>
            <p className="text-gray-500 text-sm mt-1 max-w-xs leading-relaxed">You are currently offline or there are no new delivery requests in your area.</p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {assignments?.map((data) => (
                <motion.div 
                  key={data._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="p-5 sm:p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow" 
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <span className="bg-blue-50 text-blue-600 p-2 rounded-xl hidden sm:flex"><Package size={20}/></span>
                      <div>
                        <p className="font-bold text-gray-900 text-lg">Order <span className="text-red-500">#{String(data.order._id).slice(-6)}</span></p>
                        <p className="text-xs text-gray-500 font-medium mt-0.5">Incoming Request</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-extrabold text-green-700 bg-green-50 px-3 py-1.5 rounded-full uppercase tracking-wider border border-green-200">
                      New
                    </span>
                  </div>

                  <div className="flex items-start gap-3 mb-6 text-gray-600 bg-gray-50/50 p-3 rounded-xl border border-gray-100">
                    <MapPin size={18} className="shrink-0 mt-0.5 text-gray-400"/>
                    <p className="text-sm line-clamp-2 leading-relaxed font-medium">{data.order.address.fullAddress}</p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button 
                      className="flex-1 text-red-600 bg-white border-2 border-red-100 hover:border-red-200 hover:bg-red-50 py-3 rounded-xl transition-all duration-200 cursor-pointer font-bold text-sm flex items-center justify-center gap-2"
                      onClick={(e) => {
                        e.preventDefault()
                        handleAccept("reject", data._id)
                      }}
                    >
                      <X size={18}/> Reject
                    </button>
                    <button 
                      className="flex-1 text-white bg-green-600 hover:bg-green-700 shadow-lg shadow-green-600/20 py-3 rounded-xl transition-all duration-200 cursor-pointer font-bold text-sm flex items-center justify-center gap-2"
                      onClick={(e) => {
                        e.preventDefault()
                        handleAccept("accept", data._id)
                      }}
                    >
                      <Check size={18}/> Accept Order
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  )
}

export default DeliveryBoyDashBoard