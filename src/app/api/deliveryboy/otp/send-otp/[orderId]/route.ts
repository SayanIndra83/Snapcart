import dbConnect from "@/app/lib/dbConnect";
import { sendMail } from "@/app/lib/mailer";
import OrderModel from "@/app/models/order.model";
import UserModel from "@/app/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest, {params} : {params: Promise<{orderId: string}>}) {
    try {
        const {orderId} = await params
        if(!orderId) {
            return NextResponse.json({
                message: "Order Id is required",
                success: false
            }, {status: 400})
        }

        await dbConnect()
        const order = await OrderModel.findById(orderId)

        if(!order){
            return NextResponse.json({
                message: "Order not found",
                success: false
            }, {status: 404}) 
        }

        if(order.status === "delivered" || order.isOtpVerified) {
            return  NextResponse.json({
                message: "Order already delivered",
                success: false
            }, {status: 401})
        }

        const otp = Math.floor(Math.random()*9000 + 1000).toString()

        order.deliveryOtp = otp
        await order.save()

        const user = await UserModel.findById(order.user);
        if(!user){
            return NextResponse.json({
                message: "User not found",
                success: false
            }, {status: 404})
        }
        // mail send to user
        const subject = "📦 Your delivery has arrived! Here is your OTP";
        
        const message = `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
            <div style="text-align: center; margin-bottom: 24px;">
                <h2 style="color: #16a34a; margin: 0; font-size: 26px; font-weight: 800;">Your order is here!</h2>
                <p style="color: #6b7280; font-size: 16px; margin-top: 8px;">Your delivery partner has reached the drop-off location.</p>
            </div>
            
            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
                Hi <strong>${user.username || 'Customer'}</strong>,
            </p>
            
            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
                Your delivery partner is currently at your location with order <strong>#${order._id.toString().slice(-6)}</strong>. To securely receive your package, please provide the 4-digit Delivery OTP below to the partner:
            </p>
            
            <div style="background-color: #f0fdf4; border: 2px dashed #86efac; border-radius: 12px; padding: 24px; text-align: center; margin: 32px 0;">
                <span style="font-size: 48px; font-weight: 800; letter-spacing: 16px; color: #16a34a; display: block; margin-left: 16px;">${otp}</span>
            </div>
            
            <p style="color: #dc2626; font-size: 14px; line-height: 1.5; margin-bottom: 32px; text-align: center; font-weight: 600; background-color: #fef2f2; padding: 12px; border-radius: 8px;">
                🚨 Security Tip: Only share this OTP when the delivery partner is physically handing the package to you.
            </p>
            
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0;" />
            
            <p style="color: #9ca3af; font-size: 12px; text-align: center; line-height: 1.5;">
                Thank you for ordering with us!
                <br><br>
                &copy; ${new Date().getFullYear()} Snapcart. All rights reserved.
            </p>
        </div>
        `;

        await sendMail(user.email , subject, message)

        return NextResponse.json({
                message: "Otp sent to customer's email address",
                success: true
            }, {status: 200})
    } catch (error) {
        return NextResponse.json({
                message: "An unexpected error occured",
                success: false
            }, {status: 500})
    }
}