'use client'
import Loader from '@/app/loader'
import { IOrder } from '@/app/models/order.model'
import UserOrderCard from '@/components/UserOrderCard'
import axios from 'axios'
import { ArrowLeft, PackageSearch } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import AdminOrderCard from '@/components/AdminOrderCard'

function page() {
    const [myOrders, setMyOrders] = useState<IOrder[]>()
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    useEffect(() => {
        const getOrders = async () =>{
            setLoading(true)
            try {
                const response = await axios.get('/api/admin/get-all-orders')
                // console.log(response)
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

    if(loading){
        return <Loader/>
    }
  return (
    <div className='min-h-screen w-full'>
       <div className='max-w-6xl mx-auto px-4 pt-16 pb-10 relative'>
        <div className='fixed top-0 left-0 w-full backdrop-blur-lg bg-white/70 shadow-sm border-b z-50'>
        <div className='max-w-3xl mx-auto flex items-center gap-4 px-4 py-3'>

          <button className=' p-2 bg-gray-100 rounded-full hover:bg-gray-200 active:scale-97 transition-all duration-300 cursor-pointer'
          onClick={() => router.push('/')}
          >
            <ArrowLeft size={20} className='text-green-700'/>
          </button>
          <h1 className='text-xl font-bold text-gray-800'>Manage Orders</h1>
        </div>
        </div>

        {myOrders?.length === 0 
        ? (
          <>
          <PackageSearch size={30} className='text-green-700'/>
          <h2>No Order Found</h2>
          <p>No customer has not placed any order yet !</p>
          </>
        ) : (
          <div className='space-y-6 mt-4'>
            {
              myOrders?.map((order, idx) => (
                <motion.div
                initial={{
                  opacity:0, y:20
                }}
                animate={{
                  opacity:1, y:0
                }}
                transition={{
                  duration:0.4
                }}
                key={idx}
                >
                  <AdminOrderCard order = {order}/>
                </motion.div>
              ))
            }
          </div>
        )}
      </div>
    </div>
  )
}

export default page
