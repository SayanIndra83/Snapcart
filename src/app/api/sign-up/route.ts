import dbConnect from "@/app/lib/dbConnect";
import UserModel from "@/app/models/user.model";
import { SignUpSchema } from "@/app/schemas/signup.schema";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { sendMail } from "@/app/lib/mailer";

export async function POST(request: NextRequest){
    await dbConnect();
    try {
        const body = await request.json();
        console.log(body)
        const result = SignUpSchema.safeParse(body)
        console.log(result)

        if(!result.success){
            return Response.json({message: "Invalid data", success: false, error: result.error.format()}, {status: 400})
        }

        const {username, email, password} = result.data;
        // if user with mobile exist and verified send error
        // if user with email already exist -> if not verified then send otp again -> if verified then send error
        //otherwise create user and send otp

        const otp = Math.floor(100000+Math.random()*900000).toString()

        let userWithEmail = await UserModel.findOne({email})
        if(userWithEmail) {
            if(userWithEmail.isVerified) {
                console.log("User with this email already exist")
                return NextResponse.json({message: "User with this email already exist", success: false}, {status: 400})
            } else {
                const hashedPassword = await bcrypt.hash(password, 10);
                const expiry = new Date()
                expiry.setHours(expiry.getHours() + 1)
                userWithEmail.otp = otp;
                userWithEmail.verifycodeExpiry = expiry
                userWithEmail.password = hashedPassword;
                userWithEmail.username = username;
                await userWithEmail.save()
            }
        }else{
            const hashedPassword = await bcrypt.hash(password, 10);
            const expiry = new Date()
            expiry.setHours(expiry.getHours() + 1)
            userWithEmail = await UserModel.create({
                username, email,
                password: hashedPassword,
                otp,
                verifycodeExpiry: expiry,
            })
        }

        // send mail with otp for verification

        const subject = "Verify your email address";
        
        const message = `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background-color: #ffffff; border: 1px solid #f3f4f6; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
            <div style="text-align: center; margin-bottom: 32px;">
                <h1 style="color: #16a34a; margin: 0; font-size: 28px; font-weight: 700;">Welcome!</h1>
                <p style="color: #6b7280; font-size: 16px; margin-top: 8px;">We're thrilled to have you on board.</p>
            </div>
            
            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
                Hi <strong>${username}</strong>,
            </p>
            
            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
                To complete your registration and secure your account, please verify your email address using the confirmation code below:
            </p>
            
            <div style="background-color: #f0fdf4; border: 2px dashed #86efac; border-radius: 12px; padding: 24px; text-align: center; margin: 32px 0;">
                <span style="font-size: 42px; font-weight: 800; letter-spacing: 12px; color: #16a34a; display: block; margin-left: 12px;">${otp}</span>
            </div>
            
            <p style="color: #4b5563; font-size: 14px; line-height: 1.5; margin-bottom: 32px; text-align: center;">
                This code will expire in <strong>1 hour</strong>. For your security, please do not share this code with anyone.
            </p>
            
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0;" />
            
            <p style="color: #9ca3af; font-size: 12px; text-align: center; line-height: 1.5;">
                If you didn't attempt to create an account with this email address, you can safely ignore this message.
                <br><br>
                &copy; ${new Date().getFullYear()} Snapcart. All rights reserved.
            </p>
        </div>
        `;


        await sendMail(userWithEmail.email, subject, message)

            return NextResponse.json({
                success: true,
                message: "Successfully account created",
            },
        {
            status: 200
        })
    } catch (error) {
        console.log(error)
        return NextResponse.json({message: "An error occurred", success: false}, {status: 500})
    }
}