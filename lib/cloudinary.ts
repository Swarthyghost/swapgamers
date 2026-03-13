export const uploadImageToCloudinary = async (fileUri: string) => {
  if (!fileUri) return null;

  const cloudName = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    console.warn('Cloudinary environment variables not set');
    return null;
  }

  const data = new FormData();
  data.append('file', {
    uri: fileUri,
    type: 'image/jpeg',
    name: fileUri.split('/').pop() || 'upload.jpg',
  } as any);
  
  data.append('upload_preset', uploadPreset);

  try {
    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: data,
    });

    const result = await response.json();
    if (result.error) {
       console.error('Cloudinary error:', result.error.message);
       return null;
    }
    return result.secure_url;
  } catch (error) {
    console.error('Error uploading image to Cloudinary: ', error);
    return null;
  }
};
