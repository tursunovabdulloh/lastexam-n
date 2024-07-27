import React from "react";
import { useSelector } from "react-redux";

interface PreviewModalProps {
  recipe: {
    title: string;
    cookingTime: number;
    ingredients: string[];
    imageURLs: string[];
    method: string;
    nation: string;
  };
  onClose: () => void;
}

const ProductModal: React.FC<PreviewModalProps> = ({ recipe, onClose }) => {
  const theme = useSelector((state: any) => state.theme.theme);

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center">
      <div className="w-[1200px] bg-base-100 shadow-xl rounded-lg overflow-hidden">
        <div
          className={`w-full max-w-full h-[360px] mx-auto shadow-xl rounded-lg overflow-hidden ${
            theme === "synthwave" ? "bg-[#221551]" : "bg-[#2a3340]"
          }`}
        >
          <div className="carousel carousel-center bg-neutral rounded-box w-full max-w-full space-x-4 p-4">
            {recipe.imageURLs.length > 0 ? (
              recipe.imageURLs.map((url, index) => (
                <div
                  className="carousel-item flex-shrink-0 w-full sm:w-[500px] h-[400px] sm:h-[400px]"
                  key={index}
                >
                  <img
                    src={url}
                    alt={`Recipe image ${index}`}
                    className="w-[500px] h-[320px] object-cover rounded-box"
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
                  ? "text-white font-semibold mb-1"
                  : "text-gray-700 font-semibold mb-1"
              }
            >
              Ingredients:
            </p>
            <div className="flex">
              <ul className="flex gap-2 list-disc list-inside pl-5">
                {recipe.ingredients.map((ingredient, index) => (
                  <p
                    className={
                      theme === "synthwave"
                        ? " flex gap-4 badge badge-neutral text-white "
                        : "text-gray-700  flex gap-4 badge badge-neutral"
                    }
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
                ? "text-white  font-semibold mb-4"
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
            <button
              className="bg-gray-500 text-white px-4 py-2 rounded-lg shadow hover:bg-gray-600 transition"
              onClick={onClose}
            >
              Back to List
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
