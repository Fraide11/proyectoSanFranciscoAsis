import axios from 'axios';

export const uploadImageToImgBB = async (file) => {
  // Accedemos a la variable de entorno de Vite
  const API_KEY = import.meta.env.VITE_IMGBB_API_KEY;
  
  const formData = new FormData();
  formData.append('image', file);

  try {
    const response = await axios.post(`https://api.imgbb.com/1/upload?key=${API_KEY}`, formData);
    return response.data.data.url; 
  } catch (error) {
    console.error("Error en ImgBB Service:", error);
    throw error;
  }
};