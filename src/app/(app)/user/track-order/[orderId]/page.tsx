'use client'
import { getSocket } from '@/app/lib/socket'
import Loader from '@/app/loader'
import { IOrder } from '@/app/models/order.model'
import { IUser } from '@/app/models/user.model'
import { ApiResponse } from '@/app/types/ApiResponse'
import { ILocation } from '@/components/DeliveryBoyDashBoard'
import LiveMapCustomer from '@/components/LiveMapCustomer'
import axios, { AxiosError } from 'axios'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

function Page({params} : {params: {orderId : string}}) {
  const [loading, setLoading] = useState(false)
  const [userLocation, setUserLocation] = useState<ILocation>({
    lattitude: 0, longitude: 0
  })
  
  const [deliveryBoyLocation, setDeliveryBoyLocation] = useState<ILocation>({
    lattitude: 0, longitude: 0
  })
  
  const [order, setOrder] = useState<IOrder>()
  const [deliveryBoy, setDeliveryBoy] = useState<IUser>()
  const {orderId} = useParams()
  const router = useRouter()

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

  if(loading) return (<Loader/>)

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
              {order && deliveryBoy ? (
                <>
                  <span className='inline-flex items-center text-gray-600 font-medium gap-1.5 text-xs sm:text-sm bg-gray-50 border border-gray-200 px-2.5 py-1.5 rounded-lg'>
                    <b>🗒️ Order</b>
                    <span className='text-red-500 font-semibold'>#{order?._id?.toString().slice(-6)}</span>
                  </span>
                  
                  <span className='text-gray-700 inline-flex gap-1.5 font-medium text-xs sm:text-sm bg-green-50 border border-green-100 rounded-lg py-1.5 px-2.5 items-center'>
                    🛵 Partner:
                    <span className='capitalize font-bold text-green-700 truncate max-w-[120px] sm:max-w-none'>
                      {deliveryBoy?.username}
                    </span>
                  </span>
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

      <div className='max-w-6xl mx-auto px-4 sm:px-8 py-6 sm:py-8'>
        <div className="rounded-2xl border border-gray-200 shadow-lg overflow-hidden mb-6 bg-white">
          <LiveMapCustomer 
             userLocation={userLocation} 
             deliveryBoyLocation={deliveryBoyLocation} 
          />
        </div>
      </div>

    </div>
  )
}

export default Page