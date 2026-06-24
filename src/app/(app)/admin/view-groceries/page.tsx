'use client'
import Loader from "@/app/loader"
import { IGrocery } from "@/app/models/grocery.model"
import { ApiResponse } from "@/app/types/ApiResponse"
import axios, { AxiosError } from "axios"
import { ArrowLeft, Loader2, Package, Package2, Pencil, Save, Search, Trash, Trash2, Upload, X } from "lucide-react"
import { useRouter } from "next/navigation"
import React, { useEffect, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import Image from "next/image"
import toast from "react-hot-toast"


function page() {
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const [myGroceries, setMyGroceries] = useState<IGrocery[]>()
    const [editing, setEditing] = useState<IGrocery | null>(null)
    const [imagePrev, setImagePrev] = useState<string | null>(null)
    const [backendImage, setBackendImage] = useState<Blob | null>(null)
    const [isEditing, setIsEditing] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [searchText, setSearchText] = useState("")
    const [filtered, setFiltered] = useState<IGrocery[]>()

    const category = [
        "Fruits & Vegetables",
        "Dairy & Eggs",
        "Rice, Atta & Grains",
        "Snacks & Biscuits",
        "Spices & Masalas",
        "Beverages & Drinks",
        "Personal Care",
        "Household Essentials",
        "Instant & Packaged Food",
        "Baby & Pet Care"
    ]

    const units = [
        "kg", "g", "liter", "ml", "piece", "pack"
    ]

    
    const fetchGroceries = async () => {
            setLoading(true)
            try {
                const response = await axios.get('/api/admin/get-groceries')
                // console.log(response.data.groceries)
                setMyGroceries(response.data.groceries)
                setFiltered(response.data.groceries)
            } catch (error) {
                const axiosError = error as AxiosError<ApiResponse>
                console.log(axiosError.response?.data?.message!)
            }finally{
                setLoading(false)
            }
        }

    useEffect(()=> {
        
        fetchGroceries()
    }, [])

    useEffect(() => {
        if(editing){
            setImagePrev(editing.image)
        }
    }, [editing])

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if(!files || files.length === 0) return
        
        const file = files[0]
        if(file.size > 5 * 1024 * 1024){
            toast.error("Image must be smaller than 5MB")
            return
        }

        setImagePrev(URL.createObjectURL(file))
        setBackendImage(file)
    }

    const handleEdit = async ()=> {
        if(!editing) return
        setIsEditing(true)
        try {
            const groceryId = editing?._id!
            const formData = new FormData()
            formData.append("name", editing.name)
            formData.append("category", editing.category)
            formData.append("unit", editing.unit)
            formData.append("price", editing.price)
            if(backendImage){
                formData.append("image", backendImage)
            }
            
            const response = await axios.post(`/api/admin/edit-grocery/${groceryId}`, formData)
            toast.success(response.data.messae ?? "Grocery chages saved")
            setEditing(null)
            setImagePrev(null)
            fetchGroceries()
            
        } catch (error) {
                const axiosError = error as AxiosError<ApiResponse>
                console.log(axiosError.response?.data?.message!)
            }finally{
                setIsEditing(false)
            }
    }

    const handleDelete = async ()=> {
        if(!editing) return
        setIsDeleting(true)
        try {
            const groceryId = editing._id!
            const response = await axios.post(`/api/admin/delete-grocery/${groceryId}`)
            toast.success(response.data.message || "Grocery item deleted")
            setEditing(null)
            setImagePrev(null)
            fetchGroceries()

        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            console.log(axiosError.response?.data?.message!)
        }finally{
            setIsDeleting(false)
        }
    }

    const handleSearch =(e:React.FormEvent<HTMLInputElement>)=> {
        e.preventDefault()
        const q = searchText.toLowerCase()
        if(!q) {
            setFiltered(myGroceries)
            return
        }
        setFiltered(
            myGroceries?.filter((g) => 
                g.name.toLowerCase().includes(q) || g.category.toLowerCase().includes(q)
            )
        )

    }
    if(loading) return (<Loader/>)
  return (
    <div className="w-full min-h-screen">
       <div className='sticky top-0 left-0 w-full backdrop-blur-xl bg-white/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)] border-b border-gray-100 z-50'>
          <div className='max-w-6xl mx-auto flex items-center gap-4 px-4 py-3.5'>
            <button 
              className='p-2 bg-gray-50 border border-gray-100 rounded-xl hover:bg-gray-100 active:scale-95 transition-all duration-200 cursor-pointer flex items-center justify-center group'
              onClick={() => router.push('/')}
            >
              <ArrowLeft size={18} className='text-gray-600 group-hover:text-gray-900'/>
            </button>
            <div className="flex flex-col">
                <div className="flex items-center justify-center gap-4">
                    <h1 className='text-xl sm:text-3xl font-extrabold text-green-800 leading-none'>Manage  Groceries</h1>
                    <Package2 size={25} className="text-green-700 font-bold"/>
                </div>
              
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-green-600 animate-pulse"></span>
                <span className="text-xs font-medium text-gray-500 mt-1">
                {myGroceries ? `${myGroceries.length} total order${myGroceries.length === 1 ? '' : 's'}` : 'Loading...'}
              </span>
              </div>
              
            </div>
          </div>
        </div>

        <motion.form
        initial={{opacity:0, y:10}}
        animate={{opacity:1, y: 0}}
        transition={{duration: 0.4}}
        className="flex items-center bg-white border border-gray-200 rounded-full px-5 py-3 shadow-sm hover:shadow-lg mt-8 mb-10 transition-all duration-300 max-w-lg w-full mx-auto "
        >
            <Search className="text-gray-500 mr-2 w-5 h-5"/>
            <input 
            type="text" 
            placeholder="Search by name or category..."
            value={searchText}
            onChange={(e) => {
                e.preventDefault()
                setSearchText(e.target.value)
                handleSearch(e)
            }}
            className="w-full outline-none text-gray-700 placeholder:text-gray-400" />
            {searchText && (
                <button className="text-gray-500 ml-3 hover:text-gray-600 transition-colors duration-300 cursor-pointer"
            
            onClick={(e) => {
                e.preventDefault()
                setSearchText("")}}
            >
                <X className="w-5  h-5"/>
            </button>
            )}
        </motion.form>
        <div className="space-y-4 w-[90%] md:w-[80%] mx-auto mb-20">
            {filtered?.map((g, i) => (
                        <motion.div
                        key={i}
                        whileHover={{scale:1.01}}
                        transition={{
                            type: "spring", stiffness: 100
                        }}
                        className="bg-white rounded-2xl shadow-md hover:shadow-xl border border-gray-100 flex flex-col sm:flex-row items-center sm:items-start gap-5 p-5 transition-all duration-200 "
                        >
                        <div className="relative w-full sm:w-44 aspect-square rounded-xl overflow-hidden border border-gray-300">
                            <Image 
                            src={g.image} 
                            alt={g.name}
                            fill
                            className="object-cover hover:scale-102 transition-transform duration-300"/>
                        </div>

                        <div className="flex-1 flex flex-col justify-between w-full">
                            <div>
                                <h3 className="font-bold text-gray-800 text-lg truncate">{g.name}</h3>
                                <p className="text-gray-500 text-sm capitalize">{g.category}</p>
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-3">
                                <p className="text-green-700 font-bold text-lg">₹{g.price}/<span className="text-gray-500 text-sm font-medium ml-1">{g.unit}</span></p>
                                <button className="bg-green-600 text-white py-2 px-3 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 hover:bg-green-700 transition-all duration-300 cursor-pointer"
                                onClick={(e) => setEditing(g)}
                                >
                                    <Pencil size={15}/> Edit
                                </button>
                            </div>
                        </div>
                        </motion.div>
                    ))}

                    <AnimatePresence>
                                {editing && 
                                (
                                    <motion.div
                                    initial={{
                                        opacity:0
                                    }}
                                    animate={{
                                        opacity:1
                                    }}
                                    exit={{
                                        opacity:0
                                    }}
                                    transition={{
                                        duration:0.3
                                    }}

                                    className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-md px-4"
                                    >
                                        <motion.div
                                        initial={{
                                            y:40 , opacity:0
                                        }}
                                        animate={{
                                            y:0, opacity: 1
                                        }}
                                        exit={{
                                            y:40, opacity: 0
                                        }}
                                        transition={{
                                            duration:0.3
                                        }}

                                        className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-7 relative"
                                        >
                                        <div className="flex justify-between items-center mb-4">
                                            <h2 className="text-2xl font-bold text-green-700">Edit Grocery</h2>
                                            <button className="text-gray-600 hover:text-red-600 cursor-pointer hover:rotate-90 transition-all duration-300"
                                            onClick={(e) => setEditing(null)}
                                            >
                                                <X size={18}/>
                                            </button>
                                        </div>

                                        <div className="relative aspect-square mx-auto w-[30%] rounded-lg overflow-hidden mb-4 border border-gray-200 group">
                                            {
                                                imagePrev && (
                                                    <Image 
                                                    src={imagePrev} 
                                                    alt = {editing.name} 
                                                    fill
                                                    className="object-cover"
                                                    />
                                                )
                                            }
                                            <label 
                                            htmlFor="imageUpload"
                                            className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity"
                                            ><Upload size={25} className="text-green-500 font-bold"/></label>
                                            <input 
                                            id="imageUpload" 
                                            type="file" 
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            />
                                        </div>

                                        <div className="space-y-4">
                                            <input 
                                            type="text"
                                            placeholder="Enter grocery name..."
                                            value={editing.name}
                                            onChange={(e) => setEditing({...editing, name: e.target.value})}
                                            className="w-full border border-gray-300  rounded-lg p-2.5 focus:ring-2 focus:ring-green-500 outline-none"
                                            />

                                            <select 
                                            
                                            className="w-full border border-gray-300  rounded-lg p-2.5 focus:ring-2 focus:ring-green-500 outline-none cursor-pointer"
                                            value={editing.category}
                                            onChange={(e) => setEditing({...editing, category: e.target.value})}
                                            >
                                                <option value="">Select Category</option>
                                                {category.map((c, i) => (
                                                    <option key={i} value={c}>{c}</option>
                                                ))}
                                            </select>

                                            <input 
                                            type="text"
                                            placeholder="Enter price..."
                                            value={editing.price}
                                            inputMode="numeric"
                                            onChange={(e) => setEditing({...editing, price: e.target.value.replace(/[^0-9.]/g, '')})}
                                            className="w-full border border-gray-300  rounded-lg p-2.5 focus:ring-2 focus:ring-green-500 outline-none"
                                            />

                                            <select 
                                            className="w-full border border-gray-300  rounded-lg p-2.5 focus:ring-2 focus:ring-green-500 outline-none cursor-pointer"
                                            value={editing.unit}
                                            onChange={(e) => setEditing({...editing, unit: e.target.value})}
                                            >
                                                <option value="">Select Unit</option>
                                                {units.map((u, i) => (
                                                    <option key={i} value={u}>{u}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="flex flex-col sm:flex-row justify-center sm:justify-between gap-4 items-center mt-6">
                                            <button className="px-4 py-2 rounded-lg bg-green-500
                                         hover:bg-green-600 text-white cursor-pointer flex items-center justify-center gap-3 font-semibold transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
                                         onClick={handleEdit}
                                         disabled={isEditing}
                                         >
                                            {isEditing 
                                            ? (<>
                                            <Loader2 size={18} className="animate-spin text-gray-700"/> Saving...
                                            </>    
                                            ) 
                                            : (
                                                <>
                                                <Save size={18}/>Save Grocery
                                                </>
                                            )}
                                            
                                            </button>
                                            <button className="px-4 py-2 rounded-lg bg-red-500
                                         hover:bg-red-600 text-white cursor-pointer flex items-center justify-center gap-3 font-semibold transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
                                         disabled={isDeleting}
                                         onClick={handleDelete}
                                         >
                                            {isDeleting 
                                            ? (<>
                                            <Loader2 size={18} className="animate-spin text-gray-700"/> Deleting...
                                            </>    
                                            ) 
                                            : (
                                                <>
                                                <Trash2 size={18}/> Delete Grocery
                                                </>
                                            )}
                                            </button>
                                        </div>
                                        </motion.div>
                                    </motion.div>
                                )
                                }
                            </AnimatePresence>

        </div>
        
    </div>
  )
}

export default page
