import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { Recipe } from "../types";
import { useSelector, useDispatch } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import { addToCart, deleteCart } from "../store/cartSlice";
import "react-toastify/dist/ReactToastify.css";
import { FiShoppingCart } from "react-icons/fi";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const cartItems = useSelector((state: any) => state.cart.items);
  const theme = useSelector((state: any) => state.theme.theme);
  const userId = JSON.parse(localStorage.getItem("userId") || "null");
  const dispatch = useDispatch();
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

  const handleAddToCartClick = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): Promise<void> => {
    e.stopPropagation();

    if (!recipe || !recipe.id) {
      console.error("Recipe ID is missing");
      return;
    }

    const productId = recipe.id;
    const newCartItems = new Set(cartItems.map((item: any) => item.id));

    if (newCartItems.has(productId)) {
      newCartItems.delete(productId);
      toast.info("Removed from cart!");

      dispatch(deleteCart(productId));

      if (userId) {
        const cartDocRef = doc(db, "cart", userId);
        try {
          const cartDocSnap = await getDoc(cartDocRef);
          if (cartDocSnap.exists()) {
            const cartData = cartDocSnap.data();
            delete cartData[productId];
            await setDoc(cartDocRef, cartData);
          }
        } catch (error) {
          console.error("Error removing item from cart: ", error);
        }
      }
    } else {
      newCartItems.add(productId);
      toast.success("Added to cart!");

      dispatch(addToCart(recipe));

      if (userId) {
        const cartDocRef = doc(db, "cart", userId);
        try {
          const cartDocSnap = await getDoc(cartDocRef);
          if (cartDocSnap.exists()) {
            await setDoc(
              cartDocRef,
              {
                [productId]: recipe,
              },
              { merge: true }
            );
          } else {
            await setDoc(cartDocRef, {
              [productId]: recipe,
            });
          }
        } catch (error) {
          console.error("Error adding item to cart: ", error);
        }
      }
    }
  };

  if (!recipe) {
    return (
      <div className="relative mt-40 items-center justify-center">
        <div className="absolute top-[30%] left-1/2 transform -translate-x-1/2 -translate-y-1/4">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  const isProductInCart = cartItems.some((item: any) => item.id === recipe.id);

  return (
    <div className="container flex justify-center p-4">
      <div className="w-[1200px] bg-base-100 shadow-xl rounded-lg overflow-hidden">
        <div
          className={
            theme === "synthwave"
              ? "w-full max-w-[1280px] h-[360px] mx-auto shadow-xl rounded-lg overflow-hidden bg-[#221551]"
              : "w-full max-w-[1280px] h-[360px] mx-auto shadow-xl rounded-lg overflow-hidden bg-[#2a3340]"
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
            <button
              className={`border-2 rounded-lg shadow flex items-center gap-2 px-4 py-2 ${
                isProductInCart
                  ? "border-green-100 bg-green-500 text-white"
                  : "border-gray-300 bg-blue-500 text-white"
              } transition-colors duration-300 hover:bg-blue-600`}
              onClick={handleAddToCartClick}
            >
              <FiShoppingCart
                className={`text-xl ${
                  isProductInCart ? "text-green-600" : "text-white"
                }`}
              />
              {isProductInCart ? "Remove from Cart" : "Add to Cart"}
            </button>
            <button
              className="bg-gray-500 text-white px-4 py-2 rounded-lg shadow hover:bg-gray-600 transition"
              onClick={() => navigate("/")}
            >
              Back
            </button>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
