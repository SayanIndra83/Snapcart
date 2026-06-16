import dbConnect from "@/app/lib/dbConnect";
import UserModel from "@/app/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const {email} = await req.json()

    if(!email){
        return NextResponse.json({
            message: "Email is required",
            success: false
        },
    {
        status: 400
    })
    }

    try {
        await dbConnect()

        const existingUser = await UserModel.findOne({email});
        if(!existingUser){
            return NextResponse.json({
            message: "User does not exist",
            success: false
        },
    {
        status: 404
    })
        }

        // console.log(existingUser)
    if(!existingUser.isVerified){
        return NextResponse.json({
            message: "Account is not verified",
            success: false
        },
    {
        status: 401
    })
    }    

    const otp = Math.floor(Math.random()*900000 + 100000).toString()
    const verifytime = new Date()
    verifytime.setHours(verifytime.getHours()+1) //1 hr

    existingUser.otp = otp,
    existingUser.isVerified = false,
    existingUser.verifycodeExpiry = verifytime
    await existingUser.save()
    return NextResponse.json({
            message: "Otp sent to email",
            success: true
        },
    {
        status: 200
    })
    } catch (error) {
        console.log("Forget-password route error", error)
        return NextResponse.json({
            message: "An unexpected error occurred",
            success: false
        },
    {
        status: 500
    })
    }
}