import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile,
  User as FirebaseUser,
} from "firebase/auth";
import background from "../../public/premium_photo.jfif";
import { doc, setDoc } from "firebase/firestore";
import { SignupData, SignUser } from "../types";
import { useDispatch } from "react-redux";
import { login } from "../store/userSlice";

function Signup() {
  const [signupData, setSignupData] = useState<SignupData>({
    username: "",
    photoUrl: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleGoogle = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const req = await signInWithPopup(auth, provider);
      const fUser = req.user as FirebaseUser;

      const user: SignUser = {
        uid: fUser.uid,
        email: fUser.email || "",
        emailVerified: fUser.emailVerified || false,
        apiKey: "",
        appName: "",
        createdAt: new Date().toISOString(),
        isAnonymous: fUser.isAnonymous || false,
        lastLoginAt: fUser.metadata.lastSignInTime || "",
        providerData: fUser.providerData || [],
        stsTokenManager: {},
        username: fUser.displayName || "",
        photoUrl: fUser.photoURL || "/default-avatar.png",
      };

      await setDoc(doc(db, "users", fUser.uid), user);

      dispatch(login(user));

      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("rasm", user.photoUrl);

      navigate("/");
    } catch (error) {
      console.error("Error signing up with Google:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!signupData.email || !signupData.password) return;

    setLoading(true);

    try {
      const { username, photoUrl, email, password } = signupData;
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await updateProfile(user, {
        displayName: username,
        photoURL: photoUrl,
      });

      const userData: SignUser = {
        uid: user.uid,
        email: user.email || "",
        emailVerified: user.emailVerified || false,
        apiKey: "",
        appName: "",
        createdAt: new Date().toISOString(),
        isAnonymous: user.isAnonymous || false,
        lastLoginAt: user.metadata.lastSignInTime || "",
        providerData: user.providerData || [],
        stsTokenManager: {},
        username,
        photoUrl,
      };

      await setDoc(doc(db, "users", user.uid), userData);

      dispatch(login(userData));

      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("rasm", userData.photoUrl);

      navigate("/");
    } catch (error) {
      console.error("Error signing up:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignupData({ ...signupData, [name]: value });
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSubmit();
  };

  return (
    <div
      className="relative flex justify-center items-center min-h-screen p-4"
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin"></div>
        </div>
      )}
      <div className="w-full max-w-md bg-[#ffffff58] shadow-lg p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-6 text-gray-700">Signup</h2>
        <form onSubmit={handleFormSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Username</label>
            <input
              type="text"
              name="username"
              placeholder="Enter your username"
              value={signupData.username}
              onChange={handleChange}
              className="w-full h-12 px-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Photo URL</label>
            <input
              type="url"
              name="photoUrl"
              placeholder="Enter your photo URL"
              value={signupData.photoUrl}
              onChange={handleChange}
              className="w-full h-12 px-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={signupData.email}
              onChange={handleChange}
              className="w-full h-12 px-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={signupData.password}
              onChange={handleChange}
              className="w-full h-12 px-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col gap-y-4">
            <button
              type="submit"
              className="w-full py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Signup
            </button>
            <button
              type="button"
              onClick={handleGoogle}
              className="w-full py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Google
            </button>
          </div>
        </form>
        <div className="flex justify-center mt-4">
          <a className="text-sm text-blue-600 hover:underline" href="/login">
            I have an account
          </a>
        </div>
      </div>
    </div>
  );
}

export default Signup;
