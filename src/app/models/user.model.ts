import mongoose, {Model, Schema, model, models} from "mongoose";

export interface IUser{
    username: string,
    email: string,
    password?: string,
    mobile?: string,
    role: "user" | "admin" | "deliveryboy",
    otp:string,
    verifycodeExpiry:Date,
    isVerified: boolean,
    userImage?: string,
    location ?: {
        type: {
        type: StringConstructor;
        enum: string[];
        default: string;
    };
    coordinates: {
        type: NumberConstructor[];
        default: number[];
    };
    },
    isOnline : boolean,
    socketId: string | null
}

const userSchema = new Schema<IUser>({
username:{
    type:String,
    required: [true, "Username is required"],
},
email:{
    type: String,
    required: [true, "Email is required"],
    unique: true,
    match:[/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Please provide a valid email address."],
},
mobile:{
    type: String,
    required: false,
    default:"",
    unique: true,
    match:[/^\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/, "Please provide a valid mobile number."],
},
password:{
        type: String,
        required: false,
    },
    otp:{
        type: String,
        required: [true, "Verify code is required."],
        length: [6, "Verify code must be 6 characters long."],
    },
    verifycodeExpiry:{
        type: Date,
        required:[true, "Verify Code expiry is required"]
    },
    isVerified:{
        type: Boolean,
        default: false,
    },
    role:{
        type: String,
        enum:["user", "deliveryboy", "admin"],
        default: "user"
    },
    userImage:{
        required: false,
        type: String
    },
    location: {
    type: { 
      type: String, 
      enum: ['Point'], 
      default: 'Point' 
    },
    coordinates: { 
      type: [Number], 
      default: [0, 0] 
    },
},
    socketId:{
        type: String,
        default: null
    },
    isOnline:{
        type: Boolean,
        default: false
    }
}, {timestamps: true})


userSchema.index({location: "2dsphere"})

const UserModel = (models.User as Model<IUser>) || model<IUser>("User", userSchema)

export default UserModel;
