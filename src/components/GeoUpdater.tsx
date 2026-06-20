'use client'

import { getSocket } from "@/app/lib/socket"
import { RootState } from "@/redux/store"
import { useEffect } from "react"
import { useSelector } from "react-redux"

function GeoUpdater() {
    const  socket = getSocket()
    const {userData} = useSelector((state : RootState) => state.user)
  // console.log(userData?._id)
    useEffect(() =>{
    if(userData){
      socket.emit("identity", {id: userData?._id})
    }
    
  }, [userData])
    useEffect(() => {
        if(!userData || !navigator.geolocation) return
        const watcher = navigator.geolocation.watchPosition((pos) => {
                const lat = pos.coords.latitude
                const lng = pos.coords.longitude

                socket.emit("updateLocation", {
                    userId: userData._id,
                    lattitude: lat,
                    longitude: lng
                })
            }, (err) => {
                console.log(err)
            }, {enableHighAccuracy: true})
        return()=> navigator.geolocation.clearWatch(watcher)  
    }, [userData])
  return null
}
export default GeoUpdater
