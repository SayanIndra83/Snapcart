'use client'
import { IOrder } from '@/app/models/order.model'
import { ChevronDown, ChevronUp, CreditCard, MapPin, Package, Phone, Truck, User } from 'lucide-react'
import { motion } from 'motion/react'
import Image from 'next/image'
import { useState } from 'react'

function UserOrderCard({order} : {order: IOrder}) {
    const [expanded, setExpanded] = useState(false)
    const getStatusColor = (status:string)=> {
        if(status === 'pending') return "bg-yellow-100 text-yello-700 border-yellow-300"
        else if(status === 'out of delivery') return "bg-blue-100 text-blue-700 border-blue-300"
        else if(status === 'delivered') return "bg-green-100 text-green-700 border-green-300"
        else return "bg-gray-100 text-gray-700 border-gray-300"
    }

  return (
    <motion.div
    initial={{
        opacity:0, y:15
    }}
    animate={{
        y:0, opacity:1
    }}
    transition={{
        duration:0.4
    }}
    className='bg-white rounded-2xl border border-gray-100 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden'
    >
      <div className='flex flex-col items-start justify-between md:flex-row md:items-center gap-3 border-b border-gray-100 bg-linear-to-r from-green-50 to-white px-5 py-4'>
        <div>
            <h3 className='text-lg font-semibold text-gray-800'>Order <span className='text-green-700 font-bold'>#{(order?._id?.toString())?.slice(-6)}</span></h3>
            <p className='text-xs text-gray-500 mt-1'>{new Date(order.createdAt!).toLocaleString()}</p>
        </div>
        <div className='flex gap-2 flex-wrap items-center'>
            <span className={`px-3 py-1 text-xs font-semibold rounded-full border 
                ${order.isPaid 
                ? (
                    "bg-green-100 text-green-700 border-green-300"
                ) 
                : ("bg-red-100 text-red-700 border-red-300")}
                `}>
                   {order.isPaid ? ("Paid") : ("Unpaid")} 
            </span>

            <span className={`px-3 py-1 text-xs font-semibold rounded-full border capitalize 
                ${getStatusColor(order.status)}
                `}>
                   {
                    order.status
                   }
            </span>
        </div>
      </div>
      <div className='p-5 space-y-3 font-semibold'>
        {order.paymentMethod === "cod" 
        ? (
             <div className='flex items-center gap-2 text-gray-700 text-sm'>
                    <Truck size={16} className='text-green-700'/> Cash on Delivery
            </div>
        ) 
        : (
             <div className='flex items-center gap-2 text-gray-700 text-sm'>
                    <CreditCard size={16} className='text-green-700'/> Online Payment
            </div>
        )}

        <div
        className='flex items-center text-gray-700 gap-2 text-sm'
        >
            <User size={16} className='text-green-600'/>
            <span >{order.address.fullName}</span>
        </div>
        <div
        className='flex items-center text-gray-700 gap-2 text-sm'
        >
            <Phone size={16} className='text-green-600'/>
            <span >{order.address.mobile}</span>
        </div>
        <div
        className='flex items-center text-gray-700 gap-2 text-sm'
        >
            <MapPin size={16} className='text-red-600'/>
            <span >{order.address.fullAddress}</span>
        </div>

        <div className='border-t border-gray-200 pt-3'>
            <button className='w-full flex justify-between items-center text-sm font-medium text-gray-700 hover:text-green-700 transition-all duration-300 cursor-pointer'
            onClick={(e) => setExpanded(prev => !prev)}
            >
                {expanded ? (
                    <>
                    <span className='flex gap-3 items-center justify-center'><Package size={16} className='text-green-600'/> Hide Order Items</span>

                    <ChevronUp size={16} className='text-green-600'/>
                    </>
                ) : (<>
                <span className='flex gap-3 items-center justify-center'> <Package size={16} className='text-green-600'/> View  {order.items.length} Items
                </span>
                <ChevronDown size={16} className='text-green-600'/>
                </>)}
            </button>
                    <motion.div
                    initial={{
                        height:0, opacity:0
                    }}
                    animate={{
                        height:expanded ? "auto" : 0,
                        opacity: expanded ? 1 : 0
                    }}
                    transition={{duration:0.2}}
                    className='overflow-hidden'
                    >
                        <div className='mt-3 space-y-3'>
                            {order.items.map((item, idx) => (
                                <div 
                                className='flex justify-between items-center bg-gray-50 rounded-xl px-3 py-2 hover:bg-gray-100 transition-all duration-200'
                                key={idx}>
                                    <div className='flex items-center gap-3'>
                                        <Image 
                                        src={item.image} 
                                        alt={item.name}
                                        width={60}
                                        height={60}
                                        className='rounded-lg object-cover border border-gray-200'
                                        />

                                        <div className='flex flex-col gap-2'>
                                            <p className='text-sm font-semibold text-gray-800'>{item.name}</p>
                                            <p className='text-green-700 font-medium text-xs capitalize'>{item.quantity} * {item.unit}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <p className='font-semibold text-sm text-gray-800'>₹{Number(item.price) * item.quantity}</p>
                                    </div>
                                </div>
                            ))}

                            <div className='border-t pt-3 flex justify-between items-center text-sm font-semibold text-gray-800'>
                                <div className='flex items-center justify-center gap-2 text-gray-700 text-sm'>
                                <Truck size={16} className='text-green-600'/>
                                <span>Delivery Status : <span className='text-green-700 font-semibold uppercase'>{order.status}</span></span>    
                                </div>        
                                <div>
                                    Total: <span className='text-green-700 font-bold'>₹{order.totalAmount}</span>
                                </div>        
                            </div>
                        </div>
                    </motion.div>

        </div>
        </div>
    </motion.div>
  )
}

export default UserOrderCard
