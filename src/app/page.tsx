import AdminDashBoard from "@/components/AdminDashBoard";
import EditRole from "@/components/EditRole";
import Navbar from "@/components/Navbar";
import UserDashBoard from "@/components/UserDashBoard";
import Welcome from "@/components/Welcome";
import Loader from "./loader";
import dbConnect from "./lib/dbConnect";
import { auth } from "./auth";
import { Suspense } from "react";
import GeoUpdater from "@/components/GeoUpdater";
import DeliveryBoy from "@/components/DeliveryBoy";
import GroceryModel, { IGrocery } from "./models/grocery.model";
import Footer from "@/components/Footer";

export default async function Home(props: {searchParams:Promise<{
  q:string
}>}) {


const searchParam = await props.searchParams
// console.log(searchParam)
await dbConnect()
const session = await auth()
const user = session?.user
// console.log(user)
const role = user?.role
const mobile = user?.mobile


let groceryList:IGrocery[] = []

if(user?.role === "user"){
  if(searchParam?.q){
    groceryList = await GroceryModel.find({
    $or:[
      {name: {$regex: searchParam.q || "", $options: "i"}},
      {category: {$regex: searchParam.q || "", $options: "i"}},
    ]
  })
  }
  else{
    groceryList = await GroceryModel.find({}).lean()
  }
  
}

// console.log(groceryList)


  return (
    <div className="relative min-h-screen">
      <Suspense fallback={<Loader/>}>
        {(session && user) ? 
        (!role || !mobile || (!mobile && role === "user") ? (
          <EditRole user = {user} />
        ) : (
          <>
            <Navbar user = {user}/>
            <GeoUpdater/>
            {user?.role === "user" ? (
              <UserDashBoard groceryList = {groceryList}/>
            ) : user.role === "admin" ? (
              <AdminDashBoard />
            ) : (
              <DeliveryBoy />
            )}
            <Footer role = {user.role!}/>
          </>
        )
      ) : (
        <Welcome />
      )}
      </Suspense>
    </div>
  );
}
