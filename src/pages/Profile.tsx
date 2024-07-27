import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Profile() {
  const theme = useSelector((state: any) => state.theme.theme);
  const user = JSON.parse(localStorage.getItem("userData") || "{}");

  const edit = () => {
    toast.info("As soon as this method is being!");
  };

  return (
    <div
      className={`flex min-h-screen ${
        theme === "synthwave" ? "bg-base-100" : "bg-gray-100"
      }`}
    >
      <div className="flex flex-col md:flex-row w-full">
        <div className="w-full md:w-20 h-20 md:h-[100vh] bg-cover bg-center"></div>

        <div className="flex-1 h-[100vh] flex items-center justify-center bg--800 bg-opacity-75">
          <div className="bg-gray-800 p-4 rounded-lg shadow-lg relative transition-transform duration-1000 transform perspective-1000 hover:rotate-y-360 hover:scale-110 w-full max-w-md lg:max-w-lg xl:max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <div className="flex space-x-1">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div className="h-3 w-10 bg-purple-600 rounded-full"></div>
            </div>
            <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
              <div className="w-24 h-24 bg-white rounded-full flex justify-center items-center">
                <div className="w-20 h-20 bg-blue-500 rounded-full flex justify-center items-center overflow-hidden">
                  <img
                    src={user?.photoURL}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="text-white text-center md:text-left">
                <div className="text-lg font-semibold">
                  {user?.displayName || ""}
                </div>
                <div className="text-sm text-gray-400">{user?.email}</div>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <div className="w-full h-4 bg-green-500 rounded-full"></div>
              <div className="w-full h-4 bg-green-500 rounded-full"></div>
            </div>
            <div className="mt-4 flex justify-center md:justify-end">
              <button
                onClick={edit}
                className="py-2 px-4 cursor-pointer bg-purple-600 text-white rounded-lg shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-150 ease-in-out"
              >
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Profile;
