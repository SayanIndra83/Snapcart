import NextAuth, { CredentialsSignin } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import dbConnect from "./lib/dbConnect"
import UserModel from "./models/user.model";
import bcrypt from "bcryptjs";
import Google from "next-auth/providers/google";

class AuthError extends CredentialsSignin{
  constructor(msg: string){
    super()
    this.code = msg
  }
}
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        identifier: { label: "Emai or Mobile", type: "text"},
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any) : Promise<any>{
        if(!credentials.identifier) {
          throw new AuthError("Email or Mobile number is required")
        }
        if(!credentials.password) {
          throw new AuthError("Password is required")
        }
        await dbConnect();
        try {
          const existingUser = await UserModel.findOne({$or:[
            {email: credentials.identifier},
            {mobile: credentials.identifier}
          ]})
  
          if(!existingUser){
            throw new AuthError('User does not exist')
          }
          if(!existingUser?.isVerified){
            throw new AuthError("Please verify your account before login")
          }
          if(!existingUser.password){
            throw new AuthError("You signed up with Google. Please click 'Continue with Google' below.")
          }

          const isPasswordCorrect = await bcrypt.compare(credentials.password, existingUser.password)

          if(!isPasswordCorrect){
            throw new AuthError("Incorrect password")
          }

          return existingUser
        } catch (error: any) {
          if(error instanceof AuthError){
            throw error
          }
          throw new AuthError("An unexpected server error occurred")
        }
      }
    }),
    Google({
      clientId:process.env.CLIENT_ID,
      clientSecret:process.env.CLIENT_SECRET
    })
  ],
  secret: process.env.BETTER_AUTH_SECRET,
  pages:{
    signIn: '/sign-in'
  },
  session:{
    strategy: "jwt",
    maxAge: 7*24*60*60 //7 days
  },
  callbacks:{

    // now google provider upon successfull login will return some data that we have to add to database
    async signIn({user, account}){
      if(account?.provider === "google"){
        await dbConnect()
        // console.log(user?.email)
        let existingUser = await UserModel.findOne({email: user?.email})

        // if existingUser is null -> we will create one and send to verify route
        // if exist then check isVerified, if yes then login , if not send verification email
        if(!existingUser){
          existingUser = await UserModel.create({
            username : user.name ?? user.email?.split('@')[0],
            userImage: user.image ?? "",
            email: user.email ?? "",
            isVerified: true,
            verifycodeExpiry: new Date(),
            otp:"000000", //if google so already verified
            password: ""
          })
        }
        user.id = existingUser._id.toString()
        user.role = existingUser.role
        user.isVerified = existingUser.isVerified
        user.username = existingUser.username
        user.mobile = existingUser.mobile
        user.image = existingUser.userImage
      }

      return true
    },

    // putting user into token

    //token is that token which on signin we got and the user is that user what we have returned from signin ("existingUser")
    jwt({token, user, trigger, session}) {
      if(user){
        token.id = user.id?.toString()
        token.isVerified = user.isVerified,
        token.role = user.role
        token.username = user.username
        token.email = user.email
        token.mobile = user.mobile
      }

      if((trigger === "update") && session){
        if(session.role) token.role = session.role
        if(session.mobile) token.mobile = session.mobile
      }
      return token
    },

    session({token, session}){
      if(token && session.user){
        session.user.id = token.id as string;
        session.user.isVerified = token.isVerified as boolean
        session.user.role = token.role  as string
        session.user.username = token.username  as string
        session.user.email = token.email as string
        session.user.mobile = token.mobile as string
      }
      return session
    }
  }
})