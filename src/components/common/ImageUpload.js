import Config from '../../config';

function getCroppedImg(image, crop, canvas, fileName) {
    if (!crop || !canvas) {
        return;
    }
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width,
        crop.height,
    );

    // As Base64 string
    // const base64Image = canvas.toDataURL('image/jpeg');

    // As a blob
    return new Promise((resolve, reject) => {
        canvas.toBlob(blob => {
            resolve(blob);
        }, 'image/jpeg', 1);
    });
}



export const cloudinaryImageUpload = async (imageRef, completedCrop, previewCanvasRef, fileName) => {


    const blob = await getCroppedImg(imageRef, completedCrop, previewCanvasRef, fileName)
    let reader = new FileReader();
    reader.readAsDataURL(blob);

    return await new Promise((resolve, reject) => {
        reader.onloadend = function () {
            var base64data = reader.result;
            const formData = new FormData();
            formData.append('file', base64data)
            formData.append('upload_preset', String(Config.CLOUDINARY_PRESET))
            const response = fetch(Config.CLOUDINARY_URL, {
                method: "POST",
                body: formData
            })
            resolve(response);
        }
    });


}
