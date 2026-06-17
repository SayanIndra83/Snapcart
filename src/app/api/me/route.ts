import { auth } from "@/app/auth";
import UserModel from "@/app/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest){
    try {
        const session = await auth()
        if(!session || !session.user){
            return NextResponse.json({
                message: "Unauthinticated user",
                success: false
            }, {
                status: 400
            })
        }
        const email = session.user.email
        const user =  await UserModel.findOne({email}).select("-password -otp -verifycodeExpiry")

        if(!user) return NextResponse.json({
                message: "user does not exist",
                success: false
            }, {
                status: 404
            })

            return NextResponse.json({
                user,
                success: true
            }, {
                status: 200
            })


    } catch (error) {
        return NextResponse.json({
                message: "An unexpected error occured",
                success: false
            }, {
                status: 500
            })
    }
}