import dotenv from 'dotenv';
dotenv.config();

console.log('API_BASE_URL:', process.env.NEXT_PUBLIC_API_BASE_URL);

const fetchData = async () => {
    // try {
    //   // Call the backend API to get the Kakao OAuth URL
    //   const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/login`);
    //   const data = await response.json();
  
    //   if (data.kakao_auth_url) {
    //     // Redirect to the Kakao login page
    //     window.location.href = data.kakao_auth_url;
    //   } else {
    //     console.error('Failed to fetch Kakao login URL:', data);
    //   }
    // } catch (error) {
    //   console.error('Error fetching Kakao login URL:', error);
    // }
  };

export default fetchData;