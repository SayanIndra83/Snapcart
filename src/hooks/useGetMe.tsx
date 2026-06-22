'use client'

import { AppDispatch } from "@/redux/store"
import { setUserData } from "@/redux/userSlice"
import axios from "axios"
import { useEffect } from "react"
import { useDispatch } from "react-redux"


function useGetMe() {
    const dispatch = useDispatch<AppDispatch>()
    useEffect(() => {
    const getMe = async () => {
        try {
            const response = await axios.get('/api/me')
            dispatch(setUserData(response.data.user))
            // console.log(response?.data)
        } catch (error) {
            console.log(error)
        }
    }

    getMe()
  }, [])
}

export default useGetMe
