import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { doc, updateDoc, deleteField, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import {
  incrementCount,
  decrementCount,
  deleteCart,
  setCartItems,
} from "../store/cartSlice";
import { Recipe } from "../types";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GoTrash } from "react-icons/go";
import { CiCircleMinus, CiCirclePlus } from "react-icons/ci";
import { FaShopify } from "react-icons/fa";

export default function ProductCart() {
  const dispatch = useDispatch();
  const userId = JSON.parse(localStorage.getItem("userId") || "null");
  const [refresh, setRefresh] = useState(false);
  const cartItems = useSelector((state: any) => state.cart.items);
  const theme = useSelector((state: any) => state.theme.theme);
  const [products, setProducts] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProducts = async () => {
      if (userId) {
        try {
          const cartDocRef = doc(db, "cart", userId);
          const cartDocSnap = await getDoc(cartDocRef);
          if (cartDocSnap.exists()) {
            const cartData = cartDocSnap.data();
            const cartProductIds = Object.keys(cartData);

            const productPromises = cartProductIds.map(async (id) => {
              const productDocRef = doc(db, "recipe", id);
              const productDocSnap = await getDoc(productDocRef);
              if (productDocSnap.exists()) {
                return {
                  id: productDocSnap.id,
                  ...productDocSnap.data(),
                } as Recipe;
              }
              return null;
            });

            const products = await Promise.all(productPromises);

            const validProducts = products.filter(
              (product): product is Recipe => product !== null
            );

            setProducts(validProducts);

            dispatch(
              setCartItems(
                validProducts.reduce((acc, product) => {
                  acc[product.id] = { id: product.id, count: 1 };
                  return acc;
                }, {} as { [key: string]: any })
              )
            );
          }
        } catch (error) {
          console.error("xato", error);
        }
      }
      setLoading(false);
    };

    fetchProducts();
  }, [userId, dispatch, refresh]);

  const handleRemove = async (productId: string) => {
    if (userId) {
      try {
        const cartDocRef = doc(db, "cart", userId);
        await updateDoc(cartDocRef, {
          [productId]: deleteField(),
        });
        dispatch(deleteCart(productId));
        toast.info("Product removed from cart!");
        setRefresh(!refresh);
      } catch (error) {
        console.error("xato", error);
        toast.error("Failed to remove product!");
        setRefresh(!refresh);
      }
    }
  };

  const handleDelete = (productId: string) => {
    handleRemove(productId);
  };

  const Increment = (productId: string) => {
    dispatch(incrementCount(productId));
  };

  const Decrement = (productId: string) => {
    dispatch(decrementCount(productId));
  };

  const totalPrice = () => {
    return products
      .reduce((total, product) => {
        const count = cartItems[product.id]?.count || 1;
        return total + product.price * count;
      }, 0)
      .toFixed(2);
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
      <h2 className="text-center mt-5 mb-8 font-bold text-2xl">
        Shopping Cart
      </h2>
      {products.length === 0 ? (
        <div className="flex items-center justify-center gap-6 text-center text-lg font-semibold mt-20">
          <FaShopify style={{ zoom: 6 }} />
          Your cart is empty
        </div>
      ) : (
        <div className="flex flex-col md:flex-row justify-between">
          <div className="flex-1">
            {products.map((product) => (
              <div
                key={product.id}
                className={
                  theme === "synthwave"
                    ? " flex flex-col md:flex-row w-full md:w-[780px] rounded shadow-md mb-4 bg-base-200 "
                    : " flex flex-col md:flex-row w-full md:w-[780px] rounded shadow-md mb-4 bg-base-100"
                }
              >
                <div className="flex items-center gap-2 p-2">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-info border-2"
                  />
                  <img
                    src={product.imageURLs[0]}
                    alt={product.title}
                    className="w-24 h-24 object-cover rounded-md sm:w-24 sm:h-24 md:w-30 md:h-24"
                  />
                </div>
                <div className="flex flex-col flex-1">
                  <div className="flex justify-between mt-2 p-2">
                    <h2 className="text-xl font-bold mb-2">{product.title}</h2>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center">
                        <button
                          onClick={() => Decrement(product.id)}
                          className={`flex items-center justify-center rounded-full w-[25px] h-[25px] min-h-0 ${
                            cartItems[product.id]?.count === 1
                              ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                              : "bg-gray-300 text-black hover:bg-gray-400"
                          }`}
                          disabled={cartItems[product.id]?.count === 1}
                        >
                          <CiCircleMinus style={{ zoom: 2 }} size={50} />
                        </button>
                        <span className="mx-4 text-lg font-semibold text-blue-500">
                          {cartItems[product.id]?.count || 1}
                        </span>
                        <button
                          onClick={() => Increment(product.id)}
                          className="flex items-center justify-center rounded-full w-[25px] h-[25px] min-h-0 bg-gray-300 text-black hover:bg-gray-400"
                        >
                          <CiCirclePlus style={{ zoom: 2 }} size={50} />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between p-2">
                    <p className="text-blue-500 font-semibold">
                      $ {product.price.toFixed(2)}
                    </p>
                    <GoTrash
                      onClick={() => handleDelete(product.id)}
                      className="cursor-pointer text-blue-700 hover:text-blue-700 transition-colors duration-300"
                      size={24}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          {products.length > 0 && (
            <div
              className={
                theme === "synthwave"
                  ? "flex flex-col bg-base-200 p-4 rounded shadow-md max-w-[350px] w-full h-[350px] mt-4 md:mt-0"
                  : "flex flex-col bg-base-100 p-4 rounded shadow-md max-w-[350px] w-full h-[350px] mt-4 md:mt-0"
              }
            >
              <h3 className="text-xl font-bold mb-4">Order Summary</h3>
              <div className="flex justify-between font-semibold mb-2">
                <span>Total Items:</span>
                <span>{products.length}</span>
              </div>
              <div className="flex justify-between mb-auto font-semibold ">
                <span>Total Price:</span>
                <span>$ {totalPrice()}</span>
              </div>
              <button className="bg-blue-500 text-white p-2 rounded w-full mt-4">
                Checkout
              </button>
            </div>
          )}
        </div>
      )}
      <ToastContainer />
    </div>
  );
}
