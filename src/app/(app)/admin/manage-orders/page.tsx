'use client'
import Loader from '@/app/loader'
import axios from 'axios'
import { ArrowLeft, Inbox } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import AdminOrderCard from '@/components/AdminOrderCard'
import { getSocket } from '@/app/lib/socket'
import mongoose from 'mongoose'
import { IUser } from '@/app/models/user.model'

interface IOrder {
  user: mongoose.Types.ObjectId;
  _id?: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
  items: [
    {
      grocery: mongoose.Types.ObjectId;
      name: string;
      price: string;
      unit: string;
      image: string;
      quantity: number;
    },
  ];
  totalAmount: number;
  paymentMethod: "cod" | "online";
  address: {
    fullName: string;
    city: string;
    pincode: string;
    state: string;
    fullAddress: string;
    mobile: string;
    lattitude: number;
    longitude: number;
  };
  status: "pending" | "out of delivery" | "delivered";
  isPaid: boolean;
  assignedDeliveryBoy?: IUser;
  assignment?: mongoose.Types.ObjectId;
}

function Page() {
    const [myOrders, setMyOrders] = useState<IOrder[]>([])
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    useEffect(() => {
        const getOrders = async () =>{
            setLoading(true)
            try {
                const response = await axios.get('/api/admin/get-all-orders')
                // console.log(response.data.orders)
                setMyOrders(response.data.orders)
            } catch (error) {
                console.log(error)
            }
            finally{
                setLoading(false)
            }
        }
        getOrders()
    }, [])

    useEffect(():any => {
      const socket = getSocket()
      socket.on("new-order", (newOrder)=>{

        // console.log(newOrder)
        setMyOrders((prev) => [newOrder, ...prev!])
        // console.log(myOrders)
      })
      return () => socket.off("new-order")
    }, [])

    if(loading){
        return <Loader/>
    }

  return (
    <div className='min-h-screen w-full'>
       <div className='sticky top-0 left-0 w-full backdrop-blur-xl bg-white/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)] border-b border-gray-100 z-50'>
          <div className='max-w-6xl mx-auto flex items-center gap-4 px-4 py-3.5'>
            <button 
              className='p-2 bg-gray-50 border border-gray-100 rounded-xl hover:bg-gray-100 active:scale-95 transition-all duration-200 cursor-pointer flex items-center justify-center group'
              onClick={() => router.push('/')}
            >
              <ArrowLeft size={18} className='text-gray-600 group-hover:text-gray-900'/>
            </button>
            <div className="flex flex-col">
              <h1 className='text-lg sm:text-xl font-bold text-gray-900 leading-none'>Manage Orders</h1>
              <span className="text-xs font-medium text-gray-500 mt-1">
                {myOrders ? `${myOrders.length} total order${myOrders.length === 1 ? '' : 's'}` : 'Loading...'}
              </span>
            </div>
          </div>
        </div>

       <div className='max-w-6xl mx-auto px-4 py-6 sm:py-8'>
        {myOrders?.length === 0 
        ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className='flex flex-col items-center justify-center text-center mt-12 sm:mt-24 p-8 bg-white rounded-3xl border border-dashed border-gray-200 shadow-sm max-w-md mx-auto'
          >
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6">
              <Inbox size={32} className='text-green-600' strokeWidth={1.5}/>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">No Orders Yet</h2>
            <p className="text-sm text-gray-500 leading-relaxed">
              Customers haven't placed any orders recently. New orders will appear here automatically when they arrive.
            </p>
          </motion.div>
        ) : (
          <div className='space-y-6'>
            {
              myOrders?.map((order, idx) => (
                <motion.div
                initial={{ opacity:0, y:20 }}
                animate={{ opacity:1, y:0 }}
                transition={{ duration:0.4, delay: idx * 0.05 }}
                key={idx}
                >
                  <AdminOrderCard order={order}/>
                </motion.div>
              ))
            }
          </div>
        )}
      </div>
    </div>
  )
}

export default Page