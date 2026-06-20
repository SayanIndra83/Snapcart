import HeroSection from './HeroSection'
import CategorySlider from './CategorySlider'
import dbConnect from '@/app/lib/dbConnect'
import GroceryModel from '@/app/models/grocery.model'
import GroceryItemCard from './GroceryItemCard'

async function UserDashBoard() {
  await dbConnect()
  const groceries = await GroceryModel.find({}).lean()
  const plainGroceries = JSON.parse(JSON.stringify(groceries))
  return (
    <>
      <HeroSection/>
      <CategorySlider/>
      <div
      className='w-[90%] md:w-[90%] mx-auto mt-10 pb-16'
      >
        <h2 className='text-2xl text-green-700 md:text-3xl font-bold mb-10 text-center'>Need it Now? Get it Now.</h2>
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4'>
          {plainGroceries.map((grocery : any, idx : number) => 
      <GroceryItemCard key={idx}  grocery = {grocery}/>
      )}
        </div>
        
      </div>
      
    </>
  )
}

export default UserDashBoard
