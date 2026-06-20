import AdminDashBoard from "@/components/AdminDashBoard";
import DeliveryBoyDashBoard from "@/components/DeliveryBoyDashBoard";
import EditRole from "@/components/EditRole";
import Navbar from "@/components/Navbar";
import UserDashBoard from "@/components/UserDashBoard";
import Welcome from "@/components/Welcome";
import Loader from "./loader";
import dbConnect from "./lib/dbConnect";
import { auth } from "./auth";
import { Suspense } from "react";
import GeoUpdater from "@/components/GeoUpdater";

export default async function Home() {
await dbConnect()
const session = await auth()
const user = session?.user
// console.log(user)
const role = user?.role
const mobile = user?.mobile


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
              <UserDashBoard />
            ) : user.role === "admin" ? (
              <AdminDashBoard />
            ) : (
              <DeliveryBoyDashBoard />
            )}
          </>
        )
      ) : (
        <Welcome />
      )}
      </Suspense>
    </div>
  );
}
