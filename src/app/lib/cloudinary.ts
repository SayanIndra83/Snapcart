import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadResult = await cloudinary.uploader
       .upload(
           'https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg', {
               public_id: 'shoes',
           }
       )
       .catch((error) => {
           console.log(error);
       });
    
    console.log(uploadResult);

const uploadOnCloudinary = async(file:Blob):Promise<string | null> =>{
    if(!file){
        return null
    }

try {
        //blob file to arrayBuffer
        const arrayBuffer = await file.arrayBuffer()
        //convert arrayBuffer to Node.js readable buffer
        const buffer = Buffer.from(arrayBuffer)
        return new Promise((resolve, reject)=> {
            const uploadedResult = cloudinary.uploader.upload_stream(
                {
                    resource_type: "auto",
                },
                (error, result) =>{
                    if(error){
                        reject(error)
                    }else{
                        resolve(result?.secure_url ?? null)
                    }
                }
            )
            uploadedResult.end(buffer)
        })
} catch (error) {
    console.log("Cloudinary error", error)
    return null
}
}

export default uploadOnCloudinary