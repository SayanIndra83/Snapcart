import { IOrder } from "@/app/models/order.model";
import { ApiResponse } from "@/app/types/ApiResponse";
import axios, { AxiosError } from "axios";
import {
  ChevronDown,
  ChevronUp,
  Clock,
  CreditCard,
  Loader,
  MapPinIcon,
  Package,
  PackageCheckIcon,
  Phone,
  Truck,
  User,
} from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import { useState } from "react";
import toast from "react-hot-toast";

function AdminOrderCard({ order }: { order: IOrder }) {
  const statusMap = ["pending", "out of delivery"];
  const [expanded, setExpanded] = useState(false);
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false)
  const [orderStatus, setOrderStatus] = useState<String>(order.status);
//   console.log(order.status);
  const handleStatusUpdate = async (orderId: String, status: String) => {
    console.log(status)
    const prevState = orderStatus;
    setOrderStatus(status);
    setStatusUpdateLoading(true)
    try {
      const response = await axios.post(
        `/api/admin/status-update/${orderId.toString()}`,
        { status },
      );
    //   console.log(response);
    toast.success(response.data.message || "Delivery status updated")
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
    //   console.log(axiosError.response?.data.message);
      setOrderStatus(prevState)
      toast.error(axiosError.response?.data.message!)
    }
    finally{
        setStatusUpdateLoading(false)
    }
  };
  
  return ( <>
            <motion.div
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.4,
      }}
      className="bg-white rounded-2xl border border-gray-100 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden p-4"
    >
        {statusUpdateLoading 
        ? (
            <div className="flex flex-col w-full items-center justify-center gap-6">
            <Loader size={40} className="text-gray-700 animate-spin"/>
            <span className="text-green-700 text-2xl font-semibold">Updating Order Delivery Status...</span>
            </div>
        )
        :(<>
      <div className="flex flex-col md:flex-row gap-4 md:justify-between md:items-start ">
        <div className="space-y-4">
          <p className="text-lg font-bold flex items-center gap-3 text-green-700">
            <PackageCheckIcon size={20} />
            Order #{order._id?.toString().slice(-6)}
          </p>
          <p className="text-gray-500 text-xs flex gap-4">
            <Clock size={16} className="text-orange-500" />{" "}
            {new Date(order.createdAt!).toLocaleString()}
          </p>
          <div className="mt-3 space-y-1 text-gray-700 text-sm">
            <p className="flex items-center gap-4 font-semibold">
              <User size={16} className="text-green-600" />
              <span>{order.address.fullName}</span>
            </p>
            <p className="flex items-center gap-4 font-semibold">
              <Phone size={16} className="text-green-600" />
              <span>{order.address.mobile}</span>
            </p>
            <p className="flex items-center gap-4 font-semibold">
              <MapPinIcon size={16} className="text-red-600" />
              <span>{order.address.fullAddress}</span>
            </p>
          </div>
          <p className="mt-3 flex items-center gap-4 font-medium">
            {order.paymentMethod === "cod" ? (
              <div className="flex items-center gap-2 text-gray-600 text-sm">
                <Truck size={16} className="text-green-700" /> Cash on Delivery
              </div>
            ) : (
              <div className="flex items-center gap-2 text-gray-600 text-sm">
                <CreditCard size={16} className="text-green-700" /> Online
                Payment
              </div>
            )}
          </p>
        </div>

        <div className="flex flex-col items-start md:items-end gap-2">
          <div className="flex gap-3">
            <span
              className={`text-xs font-semibold px-3 py-1 rounded-full capitalize
                    ${
                      order.isPaid
                        ? "bg-green-100 text-green-700 border-green-300"
                        : "bg-red-100 text-red-700 border-red-300"
                    }
                `}
            >
              {order.isPaid ? "Paid" : "Unpaid"}
            </span>
            <span
              className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${
                orderStatus === "pending"
                  ? "bg-yellow-100 text-yellow-700"
                  : orderStatus === "delivered"
                    ? "bg-green-100 text-green-700"
                    : "bg-blue-100 text-blue-700"
              }`}
            >
              {orderStatus}
            </span>
          </div>

          <select
            className="border border-gray-300 rounded-lg px-3 py-1 text-sm shadow-sm hover:border-green-400 transition focus:outline-none focus:ring-2 focus:ring-green-500 outline-none cursor-pointer"
            value={orderStatus.toUpperCase()}
            onChange={(e) =>
              handleStatusUpdate(
                order._id?.toString()!,
                e.target.value.toLowerCase(),
              )
            }
          >
            {statusMap.map((st, idx) => (
              <option key={idx}>{st.toUpperCase()}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="border-t border-gray-200 mt-4 pt-3">
        <button
          className="w-full flex justify-between items-center text-sm font-medium text-gray-700 hover:text-green-700 transition-all duration-300 cursor-pointer"
          onClick={(e) => setExpanded((prev) => !prev)}
        >
          {expanded ? (
            <>
              <span className="flex gap-3 items-center justify-center">
                <Package size={16} className="text-green-600" /> Hide Order
                Items
              </span>

              <ChevronUp size={16} className="text-green-600" />
            </>
          ) : (
            <>
              <span className="flex gap-3 items-center justify-center">
                {" "}
                <Package size={16} className="text-green-600" /> View{" "}
                {order.items.length} Items
              </span>
              <ChevronDown size={16} className="text-green-600" />
            </>
          )}
        </button>
        <motion.div
          initial={{
            height: 0,
            opacity: 0,
          }}
          animate={{
            height: expanded ? "auto" : 0,
            opacity: expanded ? 1 : 0,
          }}
          transition={{ duration: 0.2 }}
          className="overflow-hidden"
        >
          <div className="mt-3 space-y-3">
            {order.items.map((item, idx) => (
              <div
                className="flex justify-between items-center bg-gray-50 rounded-xl px-3 py-2 hover:bg-gray-100 transition-all duration-200"
                key={idx}
              >
                <div className="flex items-center gap-3">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={60}
                    height={60}
                    className="rounded-lg object-cover border border-gray-200"
                  />

                  <div className="flex flex-col gap-2">
                    <p className="text-sm font-semibold text-gray-800">
                      {item.name}
                    </p>
                    <p className="text-green-700 font-medium text-xs capitalize">
                      {item.quantity} * {item.unit}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-sm text-gray-800">
                    ₹{Number(item.price) * item.quantity}
                  </p>
                </div>
              </div>
            ))}

            <div className="border-t pt-3 flex justify-between items-center text-sm font-semibold text-gray-800">
              <div className="flex items-center justify-center gap-2 text-gray-700 text-sm">
                <Truck size={16} className="text-green-600" />
                <span>
                  Delivery Status :{" "}
                  <span className="text-green-700 font-semibold uppercase">
                    {order.status}
                  </span>
                </span>
              </div>
              <div>
                Total:{" "}
                <span className="text-green-700 font-bold">
                  ₹{order.totalAmount}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      </>)}
        
    </motion.div>
    </>
  );
}

export default AdminOrderCard;
