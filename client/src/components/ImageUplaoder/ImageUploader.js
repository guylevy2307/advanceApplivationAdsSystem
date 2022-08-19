import React, {useState} from "react"
import ImageUploader from "react-images-upload";

export const LoadImage = props =>{
    const [imgUrl,setImgUrl] = useState(undefined)

    const onImage = async (failedImages, sucessImages)=>{
        if(sucessImages.length!==1)
            return
        setImgUrl(sucessImages)
        console.log(sucessImages)
    }

    return (
        <>
            <ImageUploader
            key="image-uploader"
            withIcon={true}
            singleImage={true}
            withPreview={true}
            label="maximum size file: 5MB"
            buttonText="upload an image"
            onChange={onImage}
            maxFileSize={5242880}
            imgExtension={[".jpg",".jpeg",".png"]}
            />
        </>
    )
}