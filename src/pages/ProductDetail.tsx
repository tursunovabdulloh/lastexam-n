import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { Recipe } from "../types";
import { useSelector } from "react-redux";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const theme = useSelector((state: any) => state.theme.theme);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecipe = async () => {
      if (id) {
        try {
          const docRef = doc(db, "recipe", id);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setRecipe(docSnap.data() as Recipe);
          } else {
            console.log("No such document!");
          }
        } catch (error) {
          console.error("Error fetching recipe: ", error);
        }
      }
    };
    fetchRecipe();
  }, [id]);

  if (!recipe) {
    return (
      <div className="container mx-auto p-4 flex justify-center items-center h-screen">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="container flex justify-center p-4">
      <div className="w-[1200px]  bg-base-100 shadow-xl rounded-lg overflow-hidden">
        <div
          className={
            theme === "synthwave"
              ? "w-full  max-w-[1280px] h-[360px] mx-auto  shadow-xl rounded-lg overflow-hidden bg-[#221551]"
              : "w-full  max-w-[1280px] h-[360px] mx-auto  shadow-xl rounded-lg overflow-hidden bg-[#2a3340]"
          }
        >
          <div className="carousel carousel-center bg-neutral rounded-box w-full max-w-full space-x-4 p-4">
            {recipe.imageURLs && recipe.imageURLs.length > 0 ? (
              recipe.imageURLs.map((url, index) => (
                <div
                  className="carousel-item flex-shrink-0 w-full sm:w-[600px] h-[400px] sm:h-[400px]"
                  key={index}
                >
                  <img
                    src={url}
                    alt={`Recipe image ${index}`}
                    className="w-[600px] h-[320px] object-cover rounded-box"
                  />
                </div>
              ))
            ) : (
              <div className="carousel-item flex-shrink-0 w-full sm:w-[600px] h-[400px] sm:h-[400px]">
                <img
                  src="https://via.placeholder.com/600x400"
                  alt="Placeholder"
                  className="w-full h-full object-cover rounded-box"
                />
              </div>
            )}
          </div>
        </div>

        <div className="p-6">
          <h2 className="text-2xl font-bold mb-2">{recipe.title}</h2>
          <div className="flex mb-2">
            <p
              className={
                theme === "synthwave"
                  ? "text-white"
                  : "text-gray-700 font-semibold"
              }
            >
              Ingredients:
            </p>
            <div className="flex">
              <ul className="flex gap-2 list-disc list-inside pl-5">
                {recipe.ingredients.map((ingredient, index) => (
                  <p
                    className="flex gap-4 badge badge-neutral text-white"
                    key={index}
                  >
                    {ingredient}
                  </p>
                ))}
              </ul>
            </div>
          </div>
          <p
            className={
              theme === "synthwave"
                ? "text-white font-semibold mb-4"
                : "text-gray-700 font-semibold mb-4"
            }
          >
            Cooking Time:{" "}
            <span className="font-bold badge badge-accent text-white">
              {recipe.cookingTime} minutes
            </span>
          </p>
          <p
            className={
              theme === "synthwave"
                ? "text-white font-semibold mb-4"
                : "text-gray-700 font-semibold mb-4"
            }
          >
            Methods:{" "}
            <span className="font-bold badge badge-accent text-white">
              {recipe.method}
            </span>
          </p>
          <p
            className={
              theme === "synthwave"
                ? "text-white font-semibold mb-4"
                : "text-gray-700 font-semibold mb-4"
            }
          >
            Nation:{" "}
            <span className="font-bold badge badge-accent text-white">
              {recipe.nation}
            </span>
          </p>
          <div className="flex justify-end gap-4 mt-4">
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition">
              Add to Cart
            </button>
            <button
              className="bg-gray-500 text-white px-4 py-2 rounded-lg shadow hover:bg-gray-600 transition"
              // onClick={() => window.history.back()} // winodow.hitory.back() undan oldingni page ga qaytaradi
              onClick={() => navigate("/")}
            >
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
