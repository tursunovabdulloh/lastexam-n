import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { Recipe } from "../types";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiShoppingCart } from "react-icons/fi";
import { useSelector } from "react-redux";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [refresh, setRefresh] = useState(false);
  const [cartItems, setCartItems] = useState<string[]>([]);
  const theme = useSelector((state: any) => state.theme.theme);
  const userId = JSON.parse(localStorage.getItem("userId") || "null");
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
            console.log("retsep topilmadi!");
            toast.error("Recipe not found.");
          }
        } catch (error) {
          console.error("xato: ", error);
          toast.error("Error fetching recipe.");
        }
      } else {
        console.error("xato");
        toast.error("Recipe ID is missing");
      }
    };

    const fetchCartItems = async () => {
      if (userId) {
        const cartDocRef = doc(db, "cart", userId);
        try {
          const cartDocSnap = await getDoc(cartDocRef);
          if (cartDocSnap.exists()) {
            setCartItems(Object.keys(cartDocSnap.data()));
          }
        } catch (error) {
          console.error("xato: ", error);
        }
      }
    };

    fetchRecipe();
    fetchCartItems();
  }, [id, userId, refresh]);

  const handleCartClick = async (
    product: Recipe,
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): Promise<void> => {
    e.stopPropagation();

    if (!id) {
      console.error("id da xatolik");
      return;
    }

    const productId = id;
    const newCartItems = new Set(cartItems);

    if (newCartItems.has(productId)) {
      newCartItems.delete(productId);
      toast.info("Removed from cart!");
      setRefresh(true);

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
          console.error("xato: ", error);
          toast.error("Error removing item from cart.");
        }
      }
    } else {
      newCartItems.add(productId);
      toast.success("Added to cart!");
      setRefresh(true);

      if (userId) {
        const cartDocRef = doc(db, "cart", userId);
        try {
          await setDoc(
            cartDocRef,
            {
              [productId]: product,
            },
            { merge: true }
          );
        } catch (error) {
          console.error("xato: ", error);
          toast.error("Error adding item to cart.");
        }
      }
    }

    setCartItems(Array.from(newCartItems));
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

  const isProductInCart = cartItems.includes(recipe.id);

  return (
    <div className="container flex justify-center p-4">
      <div className="w-[1200px] bg-base-100 shadow-xl rounded-lg overflow-hidden">
        <div
          className={`w-full max-w-full h-[360px] mx-auto shadow-xl rounded-lg overflow-hidden ${
            theme === "synthwave" ? "bg-[#221551]" : "bg-[#2a3340]"
          }`}
        >
          <div className="carousel carousel-center bg-neutral rounded-box w-full max-w-full space-x-4 p-4">
            {recipe.imageURLs && recipe.imageURLs.length > 0 ? (
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
                  ? "text-white"
                  : "text-gray-700 font-semibold"
              }
            >
              Ingredients:
            </p>
            <div className="flex">
              <ul className="flex gap-2 list-disc list-inside pl-5">
                {recipe.ingredients.map((ing, index) => (
                  <p
                    className="flex gap-4 badge badge-neutral text-white"
                    key={index}
                  >
                    {ing}
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
              className={`border-2 rounded-lg shadow flex items-center gap-2 px-4 py-2 transition-colors duration-300 ${
                isProductInCart
                  ? "border-green-100 bg-green-500 text-white hover:bg-green-600"
                  : "border-gray-300 bg-blue-500 text-white hover:bg-blue-600"
              }`}
              onClick={(e) => handleCartClick(recipe, e)}
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
