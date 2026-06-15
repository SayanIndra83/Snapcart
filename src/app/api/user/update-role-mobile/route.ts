import { auth } from "@/app/auth";
import dbConnect from "@/app/lib/dbConnect";
import UserModel from "@/app/models/user.model";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest){
    const {role, mobile} = await req.json()
    // console.log({role, mobile})
    await dbConnect()
    try {
        
        const session = await auth()
        if(!session || !session.user){
        return Response.json(
            {
                success: false,
                message: "Unauthorized"
            },
            {
                status: 401
            }
        )
    }

    const email = session?.user?.email

    if(!mobile){
        return NextResponse.json(
                {
                    message: "Mobile number is required",
                    success: false
                },
                {
                    status: 400
                }
            )
        }

    const userWithMob = await UserModel.findOne({mobile})
        if(userWithMob && userWithMob?.email !== email) {
            return NextResponse.json(
                {
                    message: "This mobile number is already registered",
                    success: false
                },
                {
                    status: 400
                }
            )
        }
        // find user
        const existingUser = await UserModel.findOneAndUpdate({email: session?.user?.email}, {
            role, mobile
        }, {new:true})
        if(!existingUser){
            return NextResponse.json({message: "User does not exist", success: false}, {status: 404})
        }
    
    
        return NextResponse.json({
            message:"User updated",
            success: true
        },
    {
        status: 200
    })
    } catch (error) {

        console.log(error)
        return NextResponse.json(
            {
                message: "An unexpected error occurred",
                success:false
            },
            {
                status:500
            }
        )
    }
    
}