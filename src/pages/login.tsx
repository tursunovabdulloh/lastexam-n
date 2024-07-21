import { useState, FormEvent, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  User as FirebaseUser,
  UserCredential,
} from "firebase/auth";
import { auth } from "../firebase";
import { useDispatch } from "react-redux";
import { login } from "../store/userSlice";
import { message } from "antd";
import "antd/dist/reset.css";
import { User } from "../types";

interface LoginData {
  email: string;
  password: string;
}

const mapFirebaseUserToUser = (firebaseUser: FirebaseUser): User => {
  return {
    uid: firebaseUser.uid,
    email: firebaseUser.email || "",
    emailVerified: firebaseUser.emailVerified,
    apiKey: "",
    appName: "",
    createdAt: firebaseUser.metadata.creationTime || "",
    isAnonymous: firebaseUser.isAnonymous,
    lastLoginAt: firebaseUser.metadata.lastSignInTime || "",
    providerData: firebaseUser.providerData.map((provider) => ({
      providerId: provider.providerId,
      uid: provider.uid,
      displayName: provider.displayName || null,
      email: provider.email || "",
      phoneNumber: provider.phoneNumber || null,
      photoURL: provider.photoURL || null,
    })),
    stsTokenManager: {
      refreshToken: "",
      accessToken: "",
      expirationTime: 0,
    },
  };
};

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [logindata, setLoginData] = useState<LoginData>({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!logindata.email || !logindata.password) {
      message.error("Please fill out all fields.");
      return;
    }

    try {
      const userCredential: UserCredential = await signInWithEmailAndPassword(
        auth,
        logindata.email,
        logindata.password
      );

      const firebaseUser = userCredential.user;
      console.log("Logged in user:", firebaseUser);

      const user = mapFirebaseUserToUser(firebaseUser);
      dispatch(login(user));

      localStorage.setItem("user", JSON.stringify(user.providerData));
      localStorage.setItem(
        "rasm",
        user.providerData[0]?.photoURL || "/default-avatar.png"
      );
      localStorage.setItem("userData", JSON.stringify(userCredential.user));

      message.success("Successfully logged in!");
      navigate("/");
    } catch (error) {
      console.error("Error signing in with password and email", error);
      message.error("Invalid email or password.");
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData({ ...logindata, [name]: value });
  };

  return (
    <div className="flex flex-col items-center justify-center mx-auto mt-24 max-w-md bg-white shadow-xl rounded-lg p-6 space-y-6 md:max-w-lg md:mt-32 lg:max-w-xl lg:mt-40">
      <h2 className="text-3xl font-bold text-center text-gray-700">Login</h2>
      <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            className="w-full h-12 px-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            value={logindata.email}
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            name="password"
            className="w-full h-12 px-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            value={logindata.password}
            onChange={handleChange}
          />
        </div>
        <button
          type="submit"
          className="w-full py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          LOGIN
        </button>
        <div className="flex justify-center mt-4">
          <a className="text-sm text-gray-700" href="/signup">
            Not a member yet?
          </a>
        </div>
      </form>
    </div>
  );
}

export default Login;
