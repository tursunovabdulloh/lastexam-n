import { useState, FormEvent, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  User as FirebaseUser,
  UserCredential,
} from "firebase/auth";
import { auth } from "../firebase";
import { useDispatch } from "react-redux";
import { login } from "../store/userSlice";
import { LoginUser } from "../types";
import { toast } from "react-toastify";
import background from "../../public/premium_photo.jfif";
import "react-toastify/dist/ReactToastify.css";

interface LoginData {
  email: string;
  password: string;
}

const mapFirebaseUserToUser = (firebaseUser: FirebaseUser): LoginUser => {
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

  const handleGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const req = await signInWithPopup(auth, provider);
      const fUser = req.user;

      console.log("Logged in user:", fUser);
      localStorage.setItem("userId", JSON.stringify(fUser.uid));
      const user = mapFirebaseUserToUser(fUser);
      dispatch(login(user));

      localStorage.setItem("user", JSON.stringify(user.providerData));
      localStorage.setItem(
        "rasm",
        user.providerData[0]?.photoURL || "/default-avatar.png"
      );
      localStorage.setItem("userData", JSON.stringify(fUser));

      toast.success("Successfully logged in with Google!");

      navigate("/");
    } catch (error) {
      console.error("Error signing in with Google", error);
      toast.error("Failed to sign in with Google.");
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!logindata.email || !logindata.password) {
      toast.error("Please fill out all fields.");
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
      localStorage.setItem("userId", JSON.stringify(userCredential.user.uid));
      const user = mapFirebaseUserToUser(firebaseUser);
      dispatch(login(user));

      localStorage.setItem("user", JSON.stringify(user.providerData));
      localStorage.setItem("rasm", user.providerData[0]?.photoURL || "");
      localStorage.setItem("userData", JSON.stringify(userCredential.user));

      toast.success("Successfully logged in!");

      navigate("/");
    } catch (error) {
      toast.error("Invalid email or password.");
      console.error("Error signing in with password and email", error);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData({ ...logindata, [name]: value });
  };

  return (
    <div
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
      className="flex justify-center items-center min-h-screen p-4"
    >
      <div className="w-full max-w-md bg-[#ffffff58] shadow-lg p-6 rounded-lg">
        <h2 className="text-2xl sm:text-3xl font-bold  text-gray-800 mb-8">
          Login
        </h2>
        <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              className="w-full h-12 px-4 border border-gray-300 rounded-lg shadow-sm outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out"
              value={logindata.email}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              className="w-full h-12 px-4 border border-gray-300 rounded-lg shadow-sm outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out"
              value={logindata.password}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out"
          >
            Login
          </button>
          <button
            type="button"
            onClick={handleGoogle}
            className="w-full py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out"
          >
            Google
          </button>
          <div className="flex justify-center mt-4">
            <a className="text-sm text-blue-600 hover:underline" href="/signup">
              I have no account yet?
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
