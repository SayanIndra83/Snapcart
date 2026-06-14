import dbConnect from "@/app/lib/dbConnect";
import UserModel from "@/app/models/user.model";
import { VerifySchema } from "@/app/schemas/verify.schema";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest){
    await dbConnect()
    try {
        const {username, otp} = await req.json()
        const result = VerifySchema.safeParse({otp})
        if(!result.success){
            throw NextResponse.json({
                success: false,
                message: "Invalid otp",
                error : result.error.format()
            }, {status: 400})
        }
    
        const user = await UserModel.findOne({username});
        if(!user){
            console.log("User does not exist")
            throw NextResponse.json({
                success: false,
                message: "User not found",
            }, {status: 404})
        }
    
        const isOtpSame = (user.otp === otp);
        const isExpired = new Date(user.verifycodeExpiry) <= new Date()
    
        if(!isOtpSame){
            return NextResponse.json({
                    message: "Incorrect verification code. Please check the code and try again.",
                    success: false
                },
            {
                status: 400
            })
        }
    
        if(isExpired){
            return Response.json({
                    message: "Your verification code has expired. Please sign up again to request a new one.",
                    success: false
                },
                {
                    status: 400
                })
        }
    
        user.verifycodeExpiry = new Date();
        user.isVerified = true;
    
        await user.save();
        return NextResponse.json({
                message: "OTP verified successfully, Account verified",
                success: true
             },
            {
                status: 200
             } 
            )
    } catch (error) {
        console.log("Error while verifying OTP", error);
        return NextResponse.json({
            success: false,
            message: "An unexpected error occurred during verification. Please try again later."
         },
        {status: 500    
        })
    }
    
}