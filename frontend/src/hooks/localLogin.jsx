import axios from "axios";
import { AUTH_URL } from "../constants";

export const localLogin = async (credentials) => {
  const loginUrl = `${AUTH_URL}/login/local`;
  console.log(loginUrl);
  const response = await axios.post(loginUrl, credentials);
  console.log(response.data);
  return response.data;
};
