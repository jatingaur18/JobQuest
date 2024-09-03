import {v2 as cloudinary} from "cloudinary"
import fs from "fs"

    // Configuration
    cloudinary.config({ 
        cloud_name: 'drfepdbwp', 
        api_key: '588436249417821', 
        api_secret: 'oB5JqU1LG0nZa-Th3tm0lw80G3s' // Click 'View Credentials' below to copy your API secret
    });

const uploadFile = async (path)=>{
    try{
        if(!path) return null
        const response = await cloudinary.uploader.upload(path,{resource_type:"auto"})
        console.log("file uploaded",response.url);
        return response;
    }
    catch(error){
        fs.unlinkSync(path)
        return null;
    }
}

export {uploadFile}