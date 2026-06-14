import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import dbConnect from "./lib/dbConnect"
import UserModel from "./models/user.model";
import bcrypt from "bcryptjs";
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        identifier: { label: "Emai or Mobile", type: "text"},
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any) : Promise<any>{
        await dbConnect();
        try {
          const existingUser = await UserModel.findOne({$or:[
            {email: credentials.identifier},
            {mobile: credentials.identifier}
          ]})
  
          if(!existingUser){
            throw new Error('Invalid combination')
          }
          if(!existingUser?.isVerified){
            throw new Error("Please verify your account before login")
          }

          const isPasswordCorrect = await bcrypt.compare(credentials.password, existingUser.password)

          if(!isPasswordCorrect){
            throw new Error("Incorrect password")
          }

          return existingUser
        } catch (error: any) {
          throw new Error("Error in checking inputs", error)
        }
      }
    })
  ],
  secret: process.env.BETTER_AUTH_SECRET,
  pages:{
    signIn: '/sign-in'
  },
  session:{
    strategy: "jwt",
    maxAge: 7*24*60*60*1000 //7 days
  },
  callbacks:{

    // putting user into token

    //token is that token which on signin we got and the user is that user what we have returned from signin ("existingUser")
    jwt({token, user}) {
      if(user){
        token.id = user.id?.toString()
        token.isVerified = user.isVerified,
        token.role = user.role
        token.username = user.username
        token.email = user.email
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
      }
      return session
    }
  }
})