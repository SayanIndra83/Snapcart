"use client";
import { RootState } from "@/redux/store";
import L, { LatLngExpression } from "leaflet";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CreditCard,
  CreditCardIcon,
  Home,
  Loader,
  LocateFixed,
  LocateIcon,
  MapPin,
  Navigation,
  Phone,
  Truck,
  User,
  CheckCircle2,
  Receipt
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { MapContainer, Marker, TileLayer, Tooltip, useMap } from "react-leaflet";
import { useSelector } from "react-redux";
import "leaflet/dist/leaflet.css";
import mapIcon from "@/assets/mapIcon.png";
import axios, { AxiosError } from "axios";
import { OpenStreetMapProvider } from 'leaflet-geosearch';
import toast from "react-hot-toast";
import { ApiResponse } from "@/app/types/ApiResponse";

const markerIcon = new L.Icon({
  iconUrl: mapIcon.src,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

const DraggableMarker = ({ 
  position, 
  setPosition 
}: { 
  position: [number, number], 
  setPosition: React.Dispatch<React.SetStateAction<[number, number] | null>> 
}) => {
  const map = useMap()
  
  useEffect(() => {
      if (position) {
        map.flyTo(position, 16, { animate: true, duration: 1.5 })
      }
  }, [position, map])

  return (
    <Marker
      icon={markerIcon}
      position={position as LatLngExpression}
      draggable={true}
      eventHandlers={{
        dragend: (e: L.LeafletEvent) => {
          const marker = e.target as L.Marker;
          const { lat, lng } = marker.getLatLng();
          setPosition([lat, lng]);
        },
      }}
    >
      <Tooltip direction="top" offset={[0, -35]} opacity={1} permanent>
        <span className="font-semibold text-gray-700 text-xs">Drag to adjust</span>
      </Tooltip>
    </Marker>
  );
};


export default function Page() {
  const router = useRouter();
  const { userData } = useSelector((state: RootState) => state.user);
  const {finalTotal, deliveryFee, subTotal, cartData} = useSelector((state: RootState) => state.cart);
  const [address, setAddress] = useState({
    fullName: "",
    mobile: "",
    city: "",
    state: "",
    pincode: "",
    fullAddress: "",
  });
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [searchQuery, setSearchQuery] = useState("")
  const [searchLoading, setSearchingLoading] = useState(false)
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "online">("cod")
  const [paymentLoading, setPaymentLoading] = useState(false)

//   useEffects
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setPosition([latitude, longitude]);
        },
        (error) => {
          console.log(error);
        },
        { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 },
      );
    }
  }, []);


  // console.log(userData)
  useEffect(() => {
    if (userData) {
      setAddress((prev) => ({
        ...prev,
        fullName: userData.username ?? "",
        mobile: userData.mobile ?? "",
      }));
    }
  }, [userData]);

  useEffect(() => {
    const fetchAddress = async () => {
        if(!position) return null
        try {
            const result = await axios.get(`https://nominatim.openstreetmap.org/reverse?lat=${position[0]}&lon=${position[1]}&format=json`)
            setAddress((prev) => ({...prev, 
                city:(result.data.address.city ?? result.data.address.county), 
                state: result.data.address.state, 
                pincode: result.data.address.postcode, 
                fullAddress: result.data.display_name}))
        } catch (error) {
            console.log(error)
        }
    }

    fetchAddress()
  },[position])

  useEffect(() => {
    if(!searchQuery) setSearchResults([])
  }, [searchQuery])

  const handleSearchQuery = async() => {
    setSearchingLoading(true)
    try {
        const provider = new OpenStreetMapProvider();
        const results = await provider.search({ query: searchQuery });
        if(results && results.length > 0){
            setSearchResults(results)
        } else {
             toast.error("Location not found")
             setSearchResults([])
        }
    } catch (error) {
        toast.error("Location not found")
        setSearchResults([])
    }finally{
        setSearchingLoading(false)
    }
  }

  const handleSelectLocation = (label: string, lat: number, lng: number) => {
    setPosition([lat, lng])
    setSearchQuery(label)
    setSearchResults([])
  }

  const handleCurrentLocation = () => {
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setPosition([latitude, longitude]);
        },
        (error) => {
        toast.error("something went wrong")
        },
        { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 },
    )
    }
  }


  const handleCOD = async()=>{
    if(!position) return null
    try {
      setPaymentLoading(true)
      const response = await axios.post("/api/user/place-order-cod", {
        paymentMethod, 
        items: cartData.map((cart) => ({
          grocery: cart._id,
          price: cart.price,
          unit:cart.unit,
          image:cart.image,
          quantity: cart.quantity,
          name: cart.name
        })),
        totalAmount: finalTotal,
        address:{
          fullName: address.fullName,
          city: address.city,
          pincode: address.pincode,
          state: address.state,
          fullAddress: address.fullAddress,
          mobile: address.mobile,
          lattitude: position[0], 
          longitude: position[1]
        }
      })
      toast.success(response?.data?.message || "Order placed")
      router.push('/user/order-success')
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast.error(axiosError.response?.data.message ?? "Something went wrong")
    }finally{
      setPaymentLoading(false)
    }
  }
  const handleOnline = async()=>{
    if(!position) return null
    try {
      setPaymentLoading(true)
      const response = await axios.post("/api/user/place-order-online", {
        paymentMethod, 
        items: cartData.map((cart) => ({
          grocery: cart._id,
          price: cart.price,
          unit:cart.unit,
          image:cart.image,
          quantity: cart.quantity,
          name: cart.name
        })),
        totalAmount: finalTotal,
        address:{
          fullName: address.fullName,
          city: address.city,
          pincode: address.pincode,
          state: address.state,
          fullAddress: address.fullAddress,
          mobile: address.mobile,
          lattitude: position[0], 
          longitude: position[1]
        }
      })
      window.location.href = response?.data?.url
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast.error(axiosError.response?.data.message ?? "Something went wrong")
    }finally{
      setPaymentLoading(false)
    }
  }
  return (
    <div className="min-h-screen bg-gray-50/50 py-10 relative">
      <div className="w-[95%] sm:w-[90%] max-w-6xl mx-auto">
        
        <div className="flex items-center gap-4 mb-8">
          <motion.button
            whileTap={{ scale: 0.96 }}
            className="inline-flex text-gray-700 gap-2 items-center font-semibold text-sm group hover:text-green-700 transition-colors duration-200 bg-white border border-gray-200 rounded-full px-4 py-1.5 sm:px-5 sm:py-2 shadow-sm hover:shadow-md cursor-pointer"
            onClick={(e) => router.push("/user/cart")}
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="hidden sm:block">Back to Cart</span>
          </motion.button>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl sm:text-4xl font-bold text-green-700 tracking-wide text-center"
          >
            Secure Checkout
          </motion.h1>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-7 bg-white rounded-3xl shadow-sm hover:shadow-md transition-shadow duration-300 p-4 sm:p-5 border border-gray-100"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span className="bg-green-100 p-2 rounded-full text-green-700">
                <MapPin size={20} />
              </span>
              Delivery Details
            </h2>
            
            <div className="space-y-5">
              <div className="relative">
                <User size={18} className="absolute left-4 top-3.5 text-gray-500" />
                <input
                  type="text"
                  value={address.fullName}
                  placeholder="Full Name"
                  onChange={(e) => setAddress((prev) => ({ ...prev, fullName: e.target.value }))}
                  className="p-3.5 pl-11 w-full border border-gray-200 rounded-xl text-sm bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-green-500 transition-all outline-none"
                />
              </div>

              <div className="relative">
                <Phone size={18} className="absolute left-4 top-3.5 text-gray-500" />
                <input
                  type="text"
                  value={address.mobile}
                  placeholder="Mobile Number"
                  onChange={(e) => setAddress((prev) => ({ ...prev, mobile: e.target.value }))}
                  className="p-3.5 pl-11 w-full border border-gray-200 rounded-xl text-sm bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-green-500 transition-all outline-none"
                />
              </div>

              <div className="relative">
                <Home size={18} className="absolute left-4 top-3.5 text-gray-500" />
                <input
                  type="text"
                  value={address.fullAddress}
                  placeholder="Complete Address"
                  readOnly
                  className="p-3.5 pl-11 w-full border border-gray-200 rounded-xl text-sm bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-green-500 transition-all outline-none"
                />
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <div className="relative">
                  <Building2 size={18} className="absolute left-4 top-3.5 text-gray-500" />
                  <input
                    type="text"
                    value={address.city}
                    placeholder="City"
                   readOnly
                    className="p-3.5 pl-11 w-full border border-gray-200 rounded-xl text-sm bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-green-500 transition-all outline-none"
                  />
                </div>

                <div className="relative">
                  <Navigation size={18} className="absolute left-4 top-3.5 text-gray-500" />
                  <input
                    type="text"
                    value={address.state}
                    placeholder="State"
                    readOnly
                    className="p-3.5 pl-11 w-full border border-gray-200 rounded-xl text-sm bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-green-500 transition-all outline-none"
                  />
                </div>

                <div className="relative">
                  <LocateIcon size={18} className="absolute left-4 top-3.5 text-gray-500" />
                  <input
                    type="text"
                    value={address.pincode}
                    placeholder="Pincode"
                    readOnly
                    className="p-3.5 pl-11 w-full border border-gray-200 rounded-xl text-sm bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-green-500 transition-all outline-none"
                  />
                </div>
              </div>

              <div className="relative mt-6 border-t border-gray-100 pt-6">
                <p className="text-sm font-semibold text-gray-700 mb-3">Adjust Location on Map</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    spellCheck={false}
                    placeholder="Search your area..."
                    className="flex-1 border border-gray-200 rounded-xl p-3 text-sm bg-white focus:ring-2 focus:ring-green-500 transition-all outline-none"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button 
                    className="bg-green-600 text-white px-6 py-2 rounded-xl disabled:bg-gray-400  disabled:cursor-not-allowed hover:bg-green-700 transition-all duration-300 font-semibold shadow-md cursor-pointer flex gap-2 justify-center items-center"
                    onClick={handleSearchQuery}
                    disabled={searchLoading || searchQuery === ""}
                  >
                    {searchLoading ? <Loader size={18} className="animate-spin text-white"/> : "Search"}
                  </button>
                </div>

                <AnimatePresence>
                  {searchResults.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="absolute left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl max-h-56 overflow-y-auto z-[500]"
                    >
                      {searchResults.map((result, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSelectLocation(result.label, result.y, result.x)}
                          className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-green-50 border-b border-gray-100 last:border-b-0 flex items-center gap-3 transition-colors cursor-pointer group"
                        >
                          <MapPin size={16} className="text-gray-400 group-hover:text-green-600 shrink-0" />
                          <span className="truncate group-hover:text-gray-900 font-medium">{result.label}</span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="relative mt-4 h-[350px] rounded-2xl overflow-hidden border border-gray-200 shadow-inner group">
                {position && (
                  <MapContainer
                    center={position as LatLngExpression}
                    zoom={15} 
                    scrollWheelZoom={true}
                    className="w-full h-full z-0"
                  >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <DraggableMarker position={position} setPosition={setPosition} />
                  </MapContainer>
                )}

                <motion.button
                whileTap={{ scale: 0.9 }}
                className="absolute bottom-4 right-4 bg-white text-green-700 border border-green-600 shadow-lg rounded-full hover:bg-green-50 transition-all duration-200 flex items-center justify-center z-[400] p-3 cursor-pointer"
                onClick={handleCurrentLocation}
                title="Use current location"
                >
                  <LocateFixed size={22} />
                </motion.button>
              </div>

            </div>
          </motion.div>

         
          <div className="lg:col-span-5 space-y-6">
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white rounded-3xl shadow-sm border border-gray-100 p-4 sm:p-5"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
                 <span className="bg-blue-100 p-2 rounded-full text-blue-600">
                    <CreditCard size={20}/>
                 </span>
                 Payment Method
              </h2>
              
              <div className="space-y-3">
                <button 
                  onClick={(e) => { e.preventDefault(); setPaymentMethod("online"); }}
                  className={`flex items-center justify-between w-full border border-gray-200 rounded-xl p-2 px-3 transition-all cursor-pointer ${
                    paymentMethod === "online" 
                    ? "border-green-600 bg-green-50 shadow-sm" 
                    : "hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >  
                  <div className="flex items-center gap-3">
                    <div className={`p-1 rounded-lg ${paymentMethod === "online" ? "bg-green-200/50" : "bg-white"}`}>
                      <CreditCardIcon size={18} className={paymentMethod === "online" ? "text-green-700" : "text-gray-500"}/> 
                    </div>
                    <span className={`font-semibold text-base ${paymentMethod === "online" ? "text-green-800" : "text-gray-700"}`}>Pay Online (Stripe)</span>
                  </div>
                  {paymentMethod === "online" && <CheckCircle2 className="text-green-600" size={18} />}
                </button>

                <button 
                  onClick={(e) => { e.preventDefault(); setPaymentMethod("cod"); }}
                  className={`flex items-center justify-between w-full border border-gray-200 rounded-xl p-2 px-3 transition-all cursor-pointer ${
                    paymentMethod === "cod" 
                    ? "border-green-600 bg-green-50 shadow-sm" 
                    : "hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >  
                  <div className="flex items-center gap-3">
                    <div className={`p-1 rounded-lg ${paymentMethod === "cod" ? "bg-green-200/50" : "bg-white"}`}>
                      <Truck size={18} className={paymentMethod === "cod" ? "text-green-700" : "text-gray-500"}/> 
                    </div>
                    <span className={`font-semibold text-base ${paymentMethod === "cod" ? "text-green-800" : "text-gray-700"}`}>Cash on Delivery</span>
                  </div>
                  {paymentMethod === "cod" && <CheckCircle2 className="text-green-600" size={18} />}
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-3xl shadow-sm border border-gray-100 p-4 sm:p-5"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
                 <span className="bg-gray-100 p-2 rounded-full text-gray-700">
                    <Receipt size={20}/>
                 </span>
                 Bill Details
              </h2>
              
              <div className="space-y-3 text-gray-600 text-sm sm:text-base font-medium">
                  <div className="flex justify-between items-center">
                      <span>Item Total</span>
                      <span className="text-gray-900">₹{subTotal}</span>
                  </div>
                  <div className="flex justify-between items-center">
                      <span>Delivery Fee</span>
                      <span className="text-gray-900">₹{deliveryFee}</span>
                  </div>

                  <div className="relative py-2">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t-2 border-dashed border-gray-200"></div>
                    </div>
                  </div>

                  <div className="flex justify-between items-end pt-1">
                      <span className="text-lg font-bold text-gray-900">To Pay</span>
                      <span className="text-3xl font-black text-gray-900 tracking-tight">₹{finalTotal}</span>
                  </div>
              </div>

              <motion.button
                onClick={(e) => {
                  e.preventDefault()
                  if(paymentMethod === "cod") handleCOD()
                  else handleOnline()
                }}
                whileTap={{ scale: 0.97 }}
                disabled={paymentLoading}
                className="w-full mt-6 bg-green-600 hover:bg-green-700 transition-colors duration-200 font-semibold text-base text-white py-3 rounded-xl cursor-pointer shadow-lg shadow-gray-300 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
              >
                {paymentLoading 
                
                ? (
                  <>
                  <Loader size={20} className="animate-spin"/>
                  <span>processing ...</span>
                  </>
                ) 
                
                : (
                  <>
                  {(paymentMethod === 'cod' ) ? "Place Order" : "Proceed to Pay"}
                <ArrowRight size={18} className='group-hover:translate-x-1 transition-transform'/>
                </>
                )}
              </motion.button>
            </motion.div>
            
          </div>
        </div>
      </div>
    </div>
  );
}