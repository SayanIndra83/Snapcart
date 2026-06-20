import dbConnect from "@/app/lib/dbConnect";
import UserModel from "@/app/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest) {
    try {
        const {userId, socketId} = await req.json()
        console.log({userId, socketId})
        if(!userId || !socketId) {
            return NextResponse.json(
                {
                message: "All fields required",
                success: false
            }, {status: 400})
        }

        await dbConnect()

        const user = await UserModel.findByIdAndUpdate(userId.id, {
            socketId,
            isOnline: true,
        }, {new: true})

        if(!user){
            return NextResponse.json(
                {
                message: "User not found",
                success: false
            }, {status: 404})
        }
        return NextResponse.json(
                {
                message: "socket id updated and made online",
                success: true
            }, {status: 200})


    } catch (error) {
       return NextResponse.json(
                {
                message: "An unexpected error occured",
                success: false
            }, {status: 500}) 
    }
}