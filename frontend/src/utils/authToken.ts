export const getAuthToken = () => {
  return localStorage.getItem("token"); 
  // or "access_token", "jwt" depending on what you stored
};
