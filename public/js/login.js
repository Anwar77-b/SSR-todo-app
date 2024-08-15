import axios from "axios";
import { showAlert } from "./alerts";

export const signup = async (username, email, password, passwordConfirm) => {
  try {
    const res = await axios({
      method: "POST",
      url: "http://localhost:3000/users/signup",
      data: { name: username, email, password, passwordConfirm },
    });
    if (res.data.status === "succes") {
      showAlert("success", "Signed up successfuly");
      window.setTimeout(() => {
        location.assign("/");
      }, 1000);
    }
  } catch (err) {
    console.log(err.response);
    showAlert("error", err.response.data.message);
  }
};

export const login = async (email, password) => {
  try {
    const res = await axios({
      method: "POST",
      url: "http://localhost:3000/users/login",
      data: { email, password },
    });
    if (res.data.status === "succes") {
      showAlert("success", "Logged in successfuly");
      window.setTimeout(() => {
        location.assign("/");
      }, 1000);
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};

export const logout = async () => {
  try {
    const res = await axios({
      method: "GET",
      url: "http://localhost:3000/users/logout",
    });
    console.log(res.data);
    if (res.data.status === "success") {
      showAlert("success", "Logged out successfuly");
      window.setTimeout(() => {
        location.reload(true);
      }, 2000);
    }
  } catch (err) {
    showAlert("error", "error when logout try again");
  }
};
