"use client";
import AdminDashBoard from "@/components/AdminDashBoard";
import DeliveryBoyDashBoard from "@/components/DeliveryBoyDashBoard";
import EditRole from "@/components/EditRole";
import Navbar from "@/components/Navbar";
import UserDashBoard from "@/components/UserDashBoard";
import Welcome from "@/components/Welcome";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session, status } = useSession();
  const user = session?.user;
  console.log(session);
  const mobile = user?.mobile;
  const role = user?.role;
  // console.log(session.data?.user.email

  if (status === "loading") return <div>Loading...</div>;

  return (
    <div className="relative">
      {session?.user ? (!role || !mobile || (!mobile && role === "user") ? (
          <EditRole />
        ) : (
          <>
            <Navbar />
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
    </div>
  );
}
