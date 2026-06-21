import { auth } from "@/app/auth"
import dbConnect from "@/app/lib/dbConnect"
import AssignmentModel from "@/app/models/delivery-assignment.model"
import UserModel from "@/app/models/user.model"
import { NextResponse } from "next/server"
import OrderModel from "@/app/models/order.model"

export async function GET(){
    try {
        const session = await auth()
                        if(!session || !session.user){
                            return NextResponse.json({
                                message: "Unauthorized user",
                                success:false
                            },{
                                status: 401
                            })
                        }
                
                        if(session.user.role !== "deliveryboy"){
                            return NextResponse.json({
                                message: "You are not allowed to perform this operation",
                                success:false
                            },{
                                status: 400
                            })
                        }
        
                        const id = session.user.id
                        await dbConnect()
                        const deliveryBoy = await UserModel.findById(id);
                        if(!deliveryBoy){
                            return NextResponse.json({
                                message: "User not found",
                                success:false
                            },{
                                status: 404
                            })
                        }

                    const assignment = await AssignmentModel.findOne({assignTo: deliveryBoy._id, status: "assigned"}).populate({
                        path: "order",
                        model:OrderModel
                    })

                    if(!assignment) {
                        return NextResponse.json(
                            {
                                message: "You are not assigned to any order currently",
                                success: false
                            },
                            {
                                status: 404
                            }
                        )
                    }

                        return NextResponse.json({
                                assignment,
                                message: "Assignment fetched successfully",
                                success:true
                            },{
                                status: 200
                            })
                    } catch (error) {
                        console.log(error)
                        return NextResponse.json({
                                message: "An unexpected error occured",
                                success:false
                            },{
                                status: 500
                            })
    }
}