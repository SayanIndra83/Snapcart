'use client'
import Welcome from "@/components/Welcome";
import { useSession } from "next-auth/react";

export default function Home() {
  const session = useSession()
  console.log(session)
  return (
      <div>
        {
        session ? (<Welcome/>) : (<Welcome/>)
        }
      </div>
      
  );
}
