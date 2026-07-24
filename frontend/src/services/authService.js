import axiosInstance from '../api/axiosInstance';

// Register User
export async function registerUser(formData) {
  try {
    const response = await axiosInstance.post(
      'auth/register/',
      formData
    );

    return response.data;
  } catch (error) {
    throw error;
  }
}

// Login User
export async function loginUser(credentials) {
  try {
    const response = await axiosInstance.post(
      'auth/login/',
      credentials
    );

    return response.data;
  } catch (error) {
    const responseData = error.response?.data;

    throw new Error(
      responseData?.detail ||
      responseData?.message ||
      'Login failed. Check username and password.'
    );
  }
}

// Get Profile
export async function getUserProfile() {
  try {
    const response = await axiosInstance.get('auth/profile/');
    return response.data;
  } catch (error) {
    throw new Error('Failed to load profile.');
  }
}