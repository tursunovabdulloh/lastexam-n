import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import { Recipe } from "../types";
import { incrementCount, decrementCount, deleteCart } from "../store/cartSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LuDelete } from "react-icons/lu";
import { BsEmojiSmileUpsideDown } from "react-icons/bs";

export default function ProductCart() {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: any) => state.cart.items);
  const theme = useSelector((state: any) => state.theme.theme);
  const userId = JSON.parse(localStorage.getItem("userId") || "null");
  const [products, setProducts] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null
  );

  console.log("Cart Items:", cartItems);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const productIds = Object.keys(cartItems);
        console.log("Product IDs:", productIds);
        if (productIds.length === 0) {
          setProducts([]);
          setLoading(false);
          return;
        }

        const fetchedProducts: Recipe[] = [];
        for (const id of productIds) {
          const productRef = doc(db, "recipe", id);
          const productDoc = await getDoc(productRef);
          if (productDoc.exists()) {
            const productData = productDoc.data();
            fetchedProducts.push({
              id: productDoc.id,
              title: productData.title,
              cookingTime: productData.cookingTime,
              ingredients: productData.ingredients || [],
              imageURLs: productData.imageURLs || [],
              method: productData.method,
              nation: productData.nation,
              price: productData.price || 0,
            } as Recipe);
          } else {
            console.warn(`Product with id ${id} not found`);
          }
        }
        setProducts(fetchedProducts);
      } catch (error) {
        console.error("Error fetching products: ", error);
        toast.error("Error fetching products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [cartItems]);

  const handleIncrement = (productId: string) => {
    dispatch(incrementCount(productId));
  };

  const handleDecrement = (productId: string) => {
    dispatch(decrementCount(productId));
  };

  const handleDelete = (productId: string) => {
    setSelectedProductId(productId);
    setShowConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedProductId) {
      try {
        dispatch(deleteCart(selectedProductId));
        toast.info("Product removed from cart");
        setShowConfirm(false);
      } catch (error) {
        console.error("Error removing item from cart: ", error);
        toast.error("Error removing product from cart");
      }
    }
  };

  const handleCancelDelete = () => {
    setShowConfirm(false);
    setSelectedProductId(null);
  };

  if (loading) {
    return (
      <div className="relative mt-40 items-center justify-center">
        <div className="absolute top-[30%] left-1/2 transform -translate-x-1/2 -translate-y-1/4">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-center mt-5 mb-8 font-bold text-2xl">Your Cart</h2>
      {products.length === 0 ? (
        <div className="text-center text-xl">
          <BsEmojiSmileUpsideDown className="mx-auto mb-4 text-4xl" />
          <p>Your cart is empty!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {products.map((product) => (
            <div
              key={product.id}
              className={
                theme === "synthwave"
                  ? "bg-base-300 rounded-lg shadow-md overflow-hidden"
                  : "bg-base-100 rounded-lg shadow-md overflow-hidden"
              }
            >
              <div className="flex flex-col p-4">
                <div className="flex items-center">
                  <h2 className="text-xl font-bold mb-2 mr-auto">
                    {product.title}
                  </h2>
                  <LuDelete
                    style={{ zoom: 2 }}
                    onClick={() => handleDelete(product.id)}
                    className="cursor-pointer text-gray-700 hover:text-red-500 transition-colors duration-300"
                  />
                </div>
                <p className="text-gray-700 font-semibold">
                  Method: {product.method.slice(0, 35)}...
                </p>
                <p className="text-gray-700 font-semibold">
                  Price: ${product.price?.toFixed(2)}
                </p>
                <div className="flex items-start mt-[4px] gap-y-2">
                  <p className="mr-auto text-white bg-green-500 rounded-xl p-1">
                    {product.cookingTime} minutes
                  </p>
                  <div className="flex items-center">
                    <button
                      onClick={() => handleIncrement(product.id)}
                      className="bg-green-500 text-white px-3 py-1 rounded-l"
                    >
                      +
                    </button>
                    <span className="bg-gray-300 text-gray-700 px-3 py-1">
                      {cartItems[product.id]?.count || 0}
                    </span>
                    <button
                      onClick={() => handleDecrement(product.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded-r"
                    >
                      -
                    </button>
                  </div>
                </div>
              </div>
              {product.imageURLs && product.imageURLs.length > 0 && (
                <div className="w-full h-[280px]">
                  <img
                    src={product.imageURLs[0]}
                    alt={product.title}
                    className="object-cover w-full h-full"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div
            className={
              theme === "synthwave"
                ? "flex flex-col items-center bg-gray-700 text-white p-6 rounded-lg shadow-lg max-w-sm w-full"
                : "flex flex-col items-center bg-white text-gray-700 font-semibold p-6 rounded-lg shadow-lg max-w-sm w-full"
            }
          >
            <h3 className="text-lg font-semibold mb-4">Are you sure?</h3>
            <div className="flex justify-end gap-4">
              <button
                onClick={handleCancelDelete}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
}
