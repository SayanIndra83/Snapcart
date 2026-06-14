import dbConnect from "@/app/lib/dbConnect";
import UserModel from "@/app/models/user.model";
import { SignUpSchema } from "@/app/schemas/signup.schema";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest){
    await dbConnect();
    try {
        const body = await request.json();
        const result = SignUpSchema.safeParse(body)


        if(!result.success){
            return Response.json({message: "Invalid data", success: false, error: result.error.format()}, {status: 400})
        }

        const {username, email, password, mobile} = result.data;
        // if user with mobile exist and verified send error
        // if user with email already exist -> if not verified then send otp again -> if verified then send error
        //otherwise create user and send otp

        const otp = Math.floor(100000+Math.random()*900000).toString()
        const userWithMobile = await UserModel.findOne({mobile})
        if(userWithMobile?.isVerified) {
            return NextResponse.json({message: "User with this mobile number already exist", success: false}, {status: 400})
        }
        const userWithEmail = await UserModel.findOne({email})
        if(userWithEmail) {
            if(userWithEmail.isVerified) {
                return NextResponse.json({message: "User with this email already exist", success: false}, {status: 400})
            } else {
                const hashedPassword = await bcrypt.hash(password, 10);
                const expiry = new Date()
                expiry.setHours(expiry.getHours() + 1)
                userWithEmail.otp = otp;
                userWithEmail.verifycodeExpiry = expiry
                userWithEmail.password = hashedPassword;
                userWithEmail.mobile = mobile;
                userWithEmail.username = username;
                await userWithEmail.save()
            }
        }else{
            await UserModel.findByIdAndDelete(userWithMobile?._id)
            const hashedPassword = await bcrypt.hash(password, 10);
            const expiry = new Date()
            expiry.setHours(expiry.getHours() + 1)
            const user = new UserModel({
                username, email, mobile,
                password: hashedPassword,
                otp,
                verifycodeExpiry: expiry,
            })
            await user.save();
        }

            
            // send mail and message

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