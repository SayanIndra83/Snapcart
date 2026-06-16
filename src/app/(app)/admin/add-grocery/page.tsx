'use client'
import { ArrowLeft, Loader2, PlusCircle, Upload, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'motion/react'
import { ChangeEvent, useState } from 'react'
import Image from 'next/image'
import axios, { AxiosError } from 'axios'
import toast from 'react-hot-toast'
import { ApiResponse } from '@/app/types/ApiResponse'

const categories = [
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

const units = ["kg", "g", "liter", "ml", "piece", "pack"]

export default function Page() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [category, setCategory] = useState("")
  const [unit, setUnit] = useState("")
  const [price, setPrice] = useState("")
  const [preview, setPreview] = useState<string | null>(null)
  const [apiImage, setApiImage] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    const file = files[0]
    
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5MB")
      return;
    }

    setApiImage(file)
    setPreview(URL.createObjectURL(file))
  }

  const removeImage = () => {
    setApiImage(null)
    setPreview(null)
    const fileInput = document.getElementById('image') as HTMLInputElement
    if (fileInput) fileInput.value = ''
  }

  const handleSubmit = async (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const formData = new FormData()
      formData.append("name", name)
      formData.append("price", price)
      formData.append("unit", unit)
      formData.append("category", category)
      if (apiImage) {
        formData.append("image", apiImage)
      }
      const response = await axios.post('/api/admin/add-grocery', formData)
      toast.success(response.data?.message || "Grocery added")
      
      setName("")
      setPrice("")
      setCategory("")
      setUnit("")
      removeImage()
      
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast.error(axiosError.response?.data?.message ?? "Something went wrong")
    } finally {
      setIsSubmitting(false)
    }
  }

  const isFormValid = name.trim() !== "" && category !== "" && price !== "" && unit !== "" && apiImage !== null

  return (
    <div className='min-h-screen bg-gray-100 flex items-center justify-center py-16 px-4 relative'>
      <button
        className='absolute top-5 left-5 inline-flex text-green-700 z-[99] gap-2 items-center font-semibold text-base group hover:text-green-800 transition-all duration-200 cursor-pointer bg-white border border-gray-200 rounded-full px-5 py-2.5 shadow-sm hover:shadow-md'
        onClick={() => router.push('/')}
      >
        <ArrowLeft size={18} className='group-hover:-translate-x-1 transition-transform duration-200' /> 
        <span className='hidden md:block'>Back to Dashboard</span>
      </button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className='bg-slate-50 w-full max-w-2xl shadow-xl rounded-3xl border border-gray-200 p-6 sm:p-10'
      >
        <div className='flex flex-col items-center mb-8 text-center'>
          <div className='h-14 w-14 bg-green-100 rounded-full flex items-center justify-center mb-4 border border-green-200'>
            <PlusCircle className='text-green-600 w-7 h-7' />
          </div>
          <h1 className='text-2xl sm:text-3xl text-gray-800 font-bold'>Add New Grocery</h1>
          <p className='text-gray-500 text-sm mt-2'>Fill out the details below to add a new item to your catalog.</p>
        </div>

        <form onSubmit={handleSubmit} className='flex flex-col gap-6 w-full'>
          
          <div>
            <label htmlFor="name" className='text-gray-700 font-medium mb-1.5 block'>
              Grocery Name <span className='text-red-500'>*</span>
            </label>
            <input
              type="text"
              id='name'
              name='name'
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder='e.g., Fresh Organic Apples'
              className='w-full bg-white focus:outline-none focus:ring-2 focus:ring-green-400 border border-gray-300 rounded-xl px-4 py-3 transition-shadow'
            />
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
            <div>
              <label htmlFor="category" className='text-gray-700 font-medium mb-1.5 block'>
                Category <span className='text-red-500'>*</span>
              </label>
              <select
                name="category"
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className='w-full bg-white focus:outline-none focus:ring-2 focus:ring-green-400 border border-gray-300 rounded-xl px-4 py-3 transition-shadow'
              >
                <option value="" disabled>Select Category</option>
                {categories.map((cat, idx) => (
                  <option value={cat} key={idx}>{cat}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="unit" className='text-gray-700 font-medium mb-1.5 block'>
                Unit <span className='text-red-500'>*</span>
              </label>
              <select
                name="unit"
                id="unit"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className='w-full bg-white focus:outline-none focus:ring-2 focus:ring-green-400 border border-gray-300 rounded-xl px-4 py-3 transition-shadow'
              >
                <option value="" disabled>Select Unit</option>
                {units.map((u, idx) => (
                  <option value={u} key={idx}>{u}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="price" className='text-gray-700 font-medium mb-1.5 block'>
              Price (₹) <span className='text-red-500'>*</span>
            </label>
            <input
              type="text"
              id='price'
              name='price'
              onChange={(e) => setPrice(e.target.value.replace(/[^0-9.]/g, ''))}
              value={price}
              inputMode='decimal'
              placeholder='e.g., 120'
              className='w-full bg-white focus:outline-none focus:ring-2 focus:ring-green-400 border border-gray-300 rounded-xl px-4 py-3 transition-shadow'
            />
          </div>

          <div>
            <label className='text-gray-700 font-medium mb-1.5 block'>
              Product Image <span className='text-red-500'>*</span>
            </label>
            <div className='flex flex-col sm:flex-row items-start sm:items-center gap-6 mt-2'>
              <label
                htmlFor="image"
                className='cursor-pointer flex items-center justify-center gap-2 bg-white text-green-700 font-semibold border-2 border-dashed border-green-300 rounded-xl px-6 py-4 hover:bg-green-50 hover:border-green-400 transition-colors w-full sm:w-auto shrink-0'
              >
                <Upload className='h-5 w-5' />
                {preview ? 'Change Image' : 'Upload Image'}
              </label>
              <input
                type="file"
                id='image'
                accept='image/*'
                name='image'
                onChange={handleImageChange}
                hidden
              />
              
              <AnimatePresence>
                {preview && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="relative shrink-0"
                  >
                    <Image
                      src={preview}
                      alt='Product preview'
                      height={128}
                      width={128}
                      className='rounded-2xl shadow-sm border-2 border-white object-cover h-32 w-32'
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-1.5 shadow-md hover:bg-red-600 transition-colors cursor-pointer"
                    >
                      <X size={14} />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="mt-4 pt-6 border-t border-gray-200">
            <button
              type='submit'
              disabled={!isFormValid || isSubmitting}
              className='w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed disabled:shadow-none shadow-md shadow-green-600/20 py-3.5 rounded-xl cursor-pointer text-white font-semibold text-lg transition-all duration-200 flex items-center justify-center gap-3 hover:scale-102 active:scale-98'
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={20} className='animate-spin' />
                  <span>Adding Item...</span>
                </>
              ) : (
                "Add to Catalog"
              )}
            </button>
          </div>

        </form>
      </motion.div>
    </div>
  )
}