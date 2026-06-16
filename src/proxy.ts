import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function proxy(request: NextRequest) {

    const token = await getToken({req: request, secret: process.env.BETTER_AUTH_SECRET})
    // console.log("token",token)

    // console.log("URL", request)


    const {pathname} = request.nextUrl
    const publicRoutes =  ['/','/sign-in', '/sign-up', '/api/auth', '/favicon.ico', '/_next']
    const isPublicRoute = publicRoutes.some((path) => pathname.startsWith(path))

    if(isPublicRoute) {
        // console.log("Private Route")
        return NextResponse.next()}
    
    if(!token){
      const redirectUrl = new URL('/sign-in', request.url)
      redirectUrl.searchParams.set("callbackUrl", request.url)
    // console.log("Redirect Url",redirectUrl)
      return NextResponse.redirect(redirectUrl)
    }

    const role = token.role

    if((pathname.startsWith('/user') && role !== 'user') || (pathname.startsWith('/deliveryboy') && role !== "deliveryboy") || (pathname.startsWith('/admin') && role !== "admin")) {
      const unAuthorizedUrl = new URL('/unauthorized', request.url)
      return NextResponse.redirect(unAuthorizedUrl)
    }

    return NextResponse.next()

}

 
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|static|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
  ],
}


// authinticated -->

// for all --> /, /sign-in, /sign-out, /verify, /forgot-password
