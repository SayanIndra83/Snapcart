import dbConnect from "@/app/lib/dbConnect";
import { sendMail } from "@/app/lib/mailer";
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

    // send mail
    const subject = "Password Reset Verification Code";
    
    const message = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 12px; background-color: #ffffff;">
        <h2 style="color: #16a34a; text-align: center; margin-bottom: 24px;">Reset Your Password</h2>
        
        <p style="color: #374151; font-size: 16px; line-height: 1.5;">Hello ${existingUser.username || 'there'},</p>
        
        <p style="color: #374151; font-size: 16px; line-height: 1.5;">
          We received a request to reset the password for your account. Use the verification code below to complete the process. This code is valid for <strong>1 hour</strong>.
        </p>
        
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; text-align: center; margin: 30px 0;">
          <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #111827;">${otp}</span>
        </div>
        
        <p style="color: #6b7280; font-size: 14px; line-height: 1.5;">
          If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.
        </p>
        
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
        
        <p style="color: #9ca3af; font-size: 12px; text-align: center;">
          &copy; ${new Date().getFullYear()} Snapcart. All rights reserved.
        </p>
      </div>
    `;
    await sendMail(existingUser.email, subject, message)
    
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