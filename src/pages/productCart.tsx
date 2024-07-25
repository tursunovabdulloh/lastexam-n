import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { doc, updateDoc, deleteField, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import {
  decrementCount,
  deleteCart,
  incrementCount,
  setCartItems,
} from "../store/cartSlice";
import { Recipe } from "../types";
import { toast, ToastContainer } from "react-toastify";
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
            setProducts(
              products.filter((product) => product !== null) as Recipe[]
            );
            dispatch(setCartItems(cartData));
          }
        } catch (error) {
          console.error("mahsulot olib kelishda xatolik: ", error);
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
        toast.success("Product removed from cart!");
        setRefresh(!refresh);
      } catch (error) {
        console.error("mahsulot o'chirishdagi xatolik: ", error);
        toast.info("Product removed from cart!");
        setRefresh(!refresh);
      }
    }
  };

  const handleDelete = (productId: string) => {
    handleRemove(productId);
  };

  const Increment = async (productId: string) => {
    dispatch(incrementCount(productId));

    if (userId) {
      const cartDocRef = doc(db, "cart", userId);
      const cartDocSnap = await getDoc(cartDocRef);
      if (cartDocSnap.exists()) {
        const cartData = cartDocSnap.data();
        if (cartData[productId]) {
          cartData[productId].count += 1;
          await updateDoc(cartDocRef, {
            [productId]: cartData[productId],
          });
        }
      }
    }
  };

  const Decrement = async (productId: string) => {
    dispatch(decrementCount(productId));

    if (userId) {
      const cartDocRef = doc(db, "cart", userId);
      const cartDocSnap = await getDoc(cartDocRef);
      if (cartDocSnap.exists()) {
        const cartData = cartDocSnap.data();
        if (cartData[productId]) {
          if (cartData[productId].count > 1) {
            cartData[productId].count -= 1;
            await updateDoc(cartDocRef, {
              [productId]: cartData[productId],
            });
          } else {
            await updateDoc(cartDocRef, {
              [productId]: deleteField(),
            });
            dispatch(deleteCart(productId));
          }
        }
      }
    }
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
                    <div className="flex items-center">
                      <CiCircleMinus
                        onClick={() => Decrement(product.id)}
                        className="text-gray-blue hover:text-blue-600 hover:scale-110 transition-transform duration-300"
                        style={{ zoom: 1.7 }}
                      />
                      <span className="mx-4 text-lg font-semibold text-blue-500">
                        {cartItems[product.id]?.count || 1}
                      </span>
                      <CiCirclePlus
                        onClick={() => Increment(product.id)}
                        style={{ zoom: 1.7 }}
                        className="text-gray-blue hover:text-blue-600 hover:scale-110 transition-transform duration-300"
                      />
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
          {Object.keys(cartItems).length > 0 && (
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
                <span>{Object.keys(cartItems).length}</span>
              </div>
              <div className="flex justify-between mb-auto font-semibold ">
                <span>Total Price:</span>
                <span>$ {products.map((p) => p.price)}</span>
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
