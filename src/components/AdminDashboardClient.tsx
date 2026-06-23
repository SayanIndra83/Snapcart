'use client'
import { IndianRupee, Package, Truck, Users } from "lucide-react"
import { motion } from "motion/react"
import { useState } from "react"
import {Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts"

type Props = {
earning: {
    sevenDay : number,
    today: number,
    total: number
},
stats: {
    title: string;
    value: number;
}[],
chartData: {
    day: string;
    orders: number
}[]
}
function AdminDashboardClient({earning, stats, chartData} : Props) {
    const [filter, setFilter] = useState<"today" | "sevenDay" | "total">("sevenDay")

    const currEarning = (filter === "today") ? earning.today  : (filter === "sevenDay") ? earning.sevenDay : earning.total
    const title = (filter === "today") ? "Today's Earning"  : (filter === "sevenDay") ? "Last 7 Days Earning" : "Total Earning"

    const icons = [
        <Package key= "p" className="text-green-700 w-6 h-6"/>,
        <Users key= "u" className="text-green-700 w-6 h-6"/>,
        <Truck key= "t" className="text-green-700 w-6 h-6"/>,
        <IndianRupee key= "i" className="text-green-700 w-6 h-6"/>
    ]




  return (
    <div className="pt-28 w-[90%] md:w-[80%] mx-auto"> 
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10 text-center sm:text-left">
    <motion.h1
    initial={{
        opacity: 0, y:20
    }}
    transition={{
        duration:0.5
    }}
    animate={{
        y:0, opacity:1
    }}
    className="text-3xl md:text-4xl font-bold text-green-700"
    >
       🏪 Admin Dashboard
    </motion.h1>

    <select 
    name="" 
    id=""
    className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-green-500 outline-none transition-all duration-300 w-full sm:w-auto cursor-pointer"
    value={filter}
    onChange={(e) => {
        setFilter(e.target.value as any)
    }}
    >
        <option value="sevenDay">Last 7 Days</option>
        <option value="today">Today</option>
        <option value="total">Total</option>
    </select>
      </div>

      <motion.div
      initial={{
        opacity: 0, y: 15
      }}
      animate={{
        opacity: 1, y : 0
      }}
      transition={{
        duration: 0.3
      }}
      className="bg-green-50 border border-green-200 shadow-sm rounded-2xl p-6 text-center mb-10"
      >
        <h2 className="text-lg font-semibold text-green-700 mb-2" >{title}</h2>
        <p className="text-4xl font-extrabold text-green-800">₹{currEarning.toLocaleString()}</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      {stats.map((stat, idx) => (
        <motion.div
        key={idx}
        initial={{
            opacity:0, y:20
        }}
        animate={{
            opacity:1, y: 0
        }}
        transition={{
            delay: idx*0.2
        }}
        className="bg-white border border-gray-100 shadow-md rounded-2xl p-5 flex items-center gap-4 hover:shadow-lg transition-all"
        >
            <div className="bg-green-100 rounded-xl p-3">
            {icons[idx]}
            </div>
            <div >
                <p className="text-gray-600 text-sm">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
            </div>
        </motion.div>
      ))}
      </div>

      <div className="bg-white border-gray-100 border rounded-2xl shadow-md p-5 mb-10">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">📈Orders Overview (Last 7 Days)</h2>
      <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
            <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip/>
            <Bar dataKey="orders" fill="#16A34A" radius={[6, 6, 0, 0]} />
            </BarChart>
      </ResponsiveContainer>
      </div>
    </div>
  )
}

export default AdminDashboardClient
