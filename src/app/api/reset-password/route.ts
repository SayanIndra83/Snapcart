import { auth } from "@/app/auth";
import dbConnect from "@/app/lib/dbConnect";
import UserModel from "@/app/models/user.model";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest){
    const {otp, password, email} = await req.json()
    
    try {
        await dbConnect()
        const existingUser = await UserModel.findOne({email});
        if(!existingUser || existingUser.isVerified){
            return NextResponse.json({
                    message: "User does not exist",
                    success: false
                },
            {
                status: 404
            })
        }
        const isOtpValid = (existingUser?.otp === otp)
        const isOtpExpired = (new Date() >= new Date(existingUser.verifycodeExpiry))

        if(!isOtpValid){
                    return NextResponse.json({
                            message: "Incorrect OTP",
                            success: false
                        },
                    {
                        status: 400
                    })
                }
            
                if(isOtpExpired){
                    return Response.json({
                            message: "OTP expired. Please request a new one.",
                            success: false
                        },
                        {
                            status: 400
                        })
                }

                const hashedPassword = await bcrypt.hash(password, 10)
            
                existingUser.verifycodeExpiry = new Date();
                existingUser.isVerified = true;
                existingUser.password = hashedPassword
            
                await existingUser.save();
                return NextResponse.json({
                        message: "Password changed Successfully",
                        success: true
                     },
                    {
                        status: 200
                     } 
                    )
    } catch (error) {
        return NextResponse.json({
            message: "Something went wrong",
            success: false
        },
    {status: 500})
    }
}