// import { RiStickyNoteAddLine } from "react-icons/ri";
// import { useNavigate } from "react-router-dom";
// import {
//   collection,
//   getDocs,
//   setDoc,
//   doc,
//   getDoc,
//   deleteDoc,
// } from "firebase/firestore";
// import { db } from "../firebase";
// import { useEffect, useState } from "react";
// import { Recipe } from "../types";
// import { useSelector, useDispatch } from "react-redux";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { addToCart } from "../store/cartSlice";
// import { FiShoppingCart } from "react-icons/fi";
// import { LuDelete } from "react-icons/lu";

// export default function Home() {
//   const [products, setProducts] = useState<Recipe[]>([]);
//   const [refresh, setRefresh] = useState(false);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [cartItems, setCartItems] = useState<Set<string>>(new Set());
//   const [showConfirm, setShowConfirm] = useState(false);
//   const [selectedProductId, setSelectedProductId] = useState<string | null>(
//     null
//   );
//   const theme = useSelector((state: any) => state.theme.theme);
//   const userId = JSON.parse(localStorage.getItem("userId") || "null");
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   console.log(refresh);

//   useEffect(() => {
//     const fetchRecipes = async () => {
//       try {
//         const querySnapshot = await getDocs(collection(db, "recipe"));
//         const fetchedRecipes = querySnapshot.docs.map((doc) => {
//           const data = doc.data();
//           return {
//             id: doc.id,
//             title: data.title,
//             cookingTime: data.cookingTime,
//             ingredients: data.ingredients || [],
//             imageURLs: data.imageURLs || [],
//             method: data.method,
//             nation: data.nation,
//             price: data.price || 0,
//           };
//         }) as Recipe[];

//         setProducts(fetchedRecipes);
//       } catch (error) {
//         console.error("Error fetching recipes: ", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     const fetchCartItems = async () => {
//       if (userId) {
//         const cartDocRef = doc(db, "cart", userId);
//         try {
//           const cartDocSnap = await getDoc(cartDocRef);
//           if (cartDocSnap.exists()) {
//             const cartData = cartDocSnap.data();
//             const cartProductIds = new Set(Object.keys(cartData));
//             setCartItems(cartProductIds);
//           }
//         } catch (error) {
//           console.error("Error fetching cart items: ", error);
//         }
//       }
//     };

//     fetchRecipes();
//     fetchCartItems();
//   }, [userId]);

//   const onClickProduct = (id?: string) => {
//     if (id) {
//       navigate(`./recipes/${id}`);
//     }
//   };

//   const handleCartClick = async (
//     product: Recipe,
//     e: React.MouseEvent<HTMLDivElement, MouseEvent>
//   ): Promise<void> => {
//     e.stopPropagation();

//     const productId = product.id;
//     if (!productId) {
//       console.error("product id da xatolik");
//       return;
//     }

//     const newCartItems = new Set(cartItems);

//     if (newCartItems.has(productId)) {
//       newCartItems.delete(productId);
//       toast.info("Removed from cart!");

//       if (userId) {
//         const cartDocRef = doc(db, "cart", userId);
//         try {
//           const cartDocSnap = await getDoc(cartDocRef);
//           if (cartDocSnap.exists()) {
//             const cartData = cartDocSnap.data();
//             delete cartData[productId];
//             await setDoc(cartDocRef, cartData);
//           }
//         } catch (error) {
//           console.error("retsepni ochirishda xatolik: ", error);
//         }
//       }
//     } else {
//       newCartItems.add(productId);
//       toast.success("Added to cart!");

//       dispatch(addToCart(product));

//       if (userId) {
//         const cartDocRef = doc(db, "cart", userId);
//         try {
//           const cartDocSnap = await getDoc(cartDocRef);
//           if (cartDocSnap.exists()) {
//             await setDoc(
//               cartDocRef,
//               {
//                 [productId]: {
//                   ...product,
//                 },
//               },
//               { merge: true }
//             );
//           } else {
//             await setDoc(cartDocRef, {
//               [productId]: {
//                 ...product,
//               },
//             });
//           }
//         } catch (error) {
//           console.error("mahsulotni cartga qoshishda xatolik: ", error);
//         }
//       }
//     }

//     setCartItems(newCartItems);
//   };

//   const handleDeleteClick = (
//     id: string,
//     e: React.MouseEvent<SVGElement, MouseEvent>
//   ) => {
//     e.stopPropagation();
//     setSelectedProductId(id);
//     setShowConfirm(true);
//   };

//   const handleConfirmDelete = async () => {
//     if (selectedProductId) {
//       try {
//         const productRef = doc(db, "recipe", selectedProductId);
//         await deleteDoc(productRef);
//         toast.success("Product deleted successfully!");
//         setRefresh(true);
//         setProducts(
//           products.filter((product) => product.id !== selectedProductId)
//         );
//       } catch (error) {
//         console.error("mahsulotni o'chirishda xatolik: ", error);
//         toast.error("Error deleting product.");
//       } finally {
//         setShowConfirm(false);
//         setSelectedProductId(null);
//       }
//     }
//   };

//   const handleCancelDelete = () => {
//     setShowConfirm(false);
//     setSelectedProductId(null);
//   };

//   if (loading) {
//     return (
//       <div className="relative mt-40 items-center justify-center">
//         <div className="absolute top-[30%] left-1/2 transform -translate-x-1/2 -translate-y-1/4">
//           <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin"></div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto p-4">
//       <h2 className="text-center mt-5 mb-8 font-bold text-2xl">Recipe List</h2>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
//         {products.map((product) => (
//           <div
//             key={product.id}
//             onClick={() => onClickProduct(product.id)}
//             className={
//               theme === "synthwave"
//                 ? "bg-base-300 rounded-lg shadow-md overflow-hidden cursor-pointer"
//                 : "bg-base-100 rounded-lg shadow-md overflow-hidden cursor-pointer"
//             }
//           >
//             <div className="flex flex-col p-4">
//               <div className="flex items-center">
//                 <h2 className="text-xl font-bold mb-2 mr-auto">
//                   {product.title}
//                 </h2>
//                 <LuDelete
//                   style={{ zoom: 2 }}
//                   onClick={(e) => handleDeleteClick(product.id, e)}
//                   className="cursor-pointer text-gray-700 hover:text-red-500 transition-colors duration-300"
//                 />
//               </div>
//               <p
//                 className={
//                   theme === "synthwave"
//                     ? "text-white"
//                     : "text-gray-700 font-semibold"
//                 }
//               >
//                 Method: {product.method.slice(0, 35)}...
//               </p>
//               <p
//                 className={
//                   theme === "synthwave"
//                     ? "text-white"
//                     : "text-gray-700 font-semibold"
//                 }
//               >
//                 Price: ${product.price?.toFixed(2)}
//               </p>
//               <div className="flex items-start mt-[4px] gap-y-2">
//                 <p className="mr-auto text-white bg-green-500 rounded-xl p-1">
//                   {product.cookingTime} minutes
//                 </p>
//                 <div
//                   className={`cursor-pointer text-[25px] transition-colors duration-300 border-2 ${
//                     cartItems.has(product.id)
//                       ? "border-red-100 bg-green-500 text-white"
//                       : "border-gray-300 bg-gray-400 text-white"
//                   } rounded-full p-1`}
//                   onClick={(e) => handleCartClick(product, e)}
//                 >
//                   <FiShoppingCart className="p-[1px]" />
//                 </div>
//               </div>
//             </div>
//             {product.imageURLs && product.imageURLs.length > 0 && (
//               <div className="w-full h-[280px]">
//                 <img
//                   src={product.imageURLs[0]}
//                   alt={product.title}
//                   className="object-cover w-full h-full"
//                 />
//               </div>
//             )}
//           </div>
//         ))}
//       </div>
//       <main>
//         <div
//           onClick={() => {
//             navigate("/addproduct");
//           }}
//           className="fixed bottom-5 right-5 w-16 h-16 bg-blue-500 text-white flex items-center justify-center rounded-full shadow-lg transition-transform duration-300 hover:scale-105 hover:bg-blue-600 cursor-pointer"
//         >
//           <RiStickyNoteAddLine className="text-3xl" />
//         </div>
//       </main>
//       {showConfirm && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
//           <div
//             className={
//               theme === "synthwave"
//                 ? "flex flex-col items-center bg-gray-700 text-white p-6 rounded-lg shadow-lg max-w-sm w-full"
//                 : "flex flex-col items-center bg-white text-gray-700 font-semibold p-6 rounded-lg shadow-lg max-w-sm w-full"
//             }
//           >
//             <h3 className="text-lg font-semibold mb-4">Are you sure?</h3>
//             <div className="flex justify-end gap-4">
//               <button
//                 onClick={handleCancelDelete}
//                 className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleConfirmDelete}
//                 className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//       <ToastContainer />
//     </div>
//   );
// }

// // <div className="bg-white p-6 shadow-md rounded-md">
// //   <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
// //   <div className="border-t pt-4">
// //     <p className="flex justify-between">
// //       <span>Items:</span>
// //       <span>{selectedItems.length}</span>
// //     </p>
// //     <p className="flex justify-between">
// //       <span>Subtotal:</span>
// //       <span>${calculateTotal().toFixed(2)}</span>
// //     </p>
// //     <p className="flex justify-between font-bold">
// //       <span>Total:</span>
// //       <span>${calculateTotal().toFixed(2)}</span>
// //     </p>
// //     <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md">
// //       Check out
// //     </button>
// //   </div>
// // </div>;
import { RiStickyNoteAddLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import {
  collection,
  getDocs,
  setDoc,
  doc,
  getDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { useEffect, useState } from "react";
import { Recipe } from "../types";
import { useSelector, useDispatch } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { addToCart, deleteCart } from "../store/cartSlice";
import { FiShoppingCart } from "react-icons/fi";
import { LuDelete } from "react-icons/lu";

export default function Home() {
  const [products, setProducts] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [cartItems, setCartItems] = useState<Set<string>>(new Set());
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null
  );
  const theme = useSelector((state: any) => state.theme.theme);
  const userId = JSON.parse(localStorage.getItem("userId") || "null");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "recipe"));
        const fetchedRecipes = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.title,
            cookingTime: data.cookingTime,
            ingredients: data.ingredients || [],
            imageURLs: data.imageURLs || [],
            method: data.method,
            nation: data.nation,
            price: data.price || 0,
          };
        }) as Recipe[];

        setProducts(fetchedRecipes);
      } catch (error) {
        console.error("Error fetching recipes: ", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchCartItems = async () => {
      if (userId) {
        const cartDocRef = doc(db, "cart", userId);
        try {
          const cartDocSnap = await getDoc(cartDocRef);
          if (cartDocSnap.exists()) {
            const cartData = cartDocSnap.data();
            const cartProductIds = new Set(Object.keys(cartData));
            setCartItems(cartProductIds);
          }
        } catch (error) {
          console.error("Error fetching cart items: ", error);
        }
      }
    };

    fetchRecipes();
    fetchCartItems();
  }, [userId]);

  const onClickProduct = (id?: string) => {
    if (id) {
      navigate(`./recipes/${id}`);
    }
  };

  const handleCartClick = async (
    product: Recipe,
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ): Promise<void> => {
    e.stopPropagation();

    const productId = product.id;
    if (!productId) {
      console.error("product id da xatolik");
      return;
    }

    const newCartItems = new Set(cartItems);

    if (newCartItems.has(productId)) {
      newCartItems.delete(productId);
      toast.info("Removed from cart!");

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
          console.error("retsepni ochirishda xatolik: ", error);
        }
      }

      dispatch(deleteCart(productId));
    } else {
      newCartItems.add(productId);
      toast.success("Added to cart!");

      dispatch(addToCart({ id: productId, count: 1 }));

      if (userId) {
        const cartDocRef = doc(db, "cart", userId);
        try {
          const cartDocSnap = await getDoc(cartDocRef);
          if (cartDocSnap.exists()) {
            await setDoc(
              cartDocRef,
              {
                [productId]: {
                  ...product,
                },
              },
              { merge: true }
            );
          } else {
            await setDoc(cartDocRef, {
              [productId]: {
                ...product,
              },
            });
          }
        } catch (error) {
          console.error("mahsulotni cartga qoshishda xatolik: ", error);
        }
      }
    }

    setCartItems(newCartItems);
  };

  const handleDeleteClick = (
    id: string,
    e: React.MouseEvent<SVGElement, MouseEvent>
  ) => {
    e.stopPropagation();
    setSelectedProductId(id);
    setShowConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedProductId) {
      try {
        const productRef = doc(db, "recipe", selectedProductId);
        await deleteDoc(productRef);
        toast.success("Product deleted successfully!");
        setProducts(
          products.filter((product) => product.id !== selectedProductId)
        );
      } catch (error) {
        console.error("mahsulotni o'chirishda xatolik: ", error);
        toast.error("Error deleting product.");
      } finally {
        setShowConfirm(false);
        setSelectedProductId(null);
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
      <h2 className="text-center mt-5 mb-8 font-bold text-2xl">Recipe List</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
        {products.map((product) => (
          <div
            key={product.id}
            onClick={() => onClickProduct(product.id)}
            className={
              theme === "synthwave"
                ? "bg-base-300 rounded-lg shadow-md overflow-hidden cursor-pointer"
                : "bg-base-100 rounded-lg shadow-md overflow-hidden cursor-pointer"
            }
          >
            <div className="flex flex-col p-4">
              <div className="flex items-center">
                <h2 className="text-xl font-bold mb-2 mr-auto">
                  {product.title}
                </h2>
                <LuDelete
                  style={{ zoom: 2 }}
                  onClick={(e) => handleDeleteClick(product.id, e)}
                  className="cursor-pointer text-gray-700 hover:text-red-500 transition-colors duration-300"
                />
              </div>
              <p
                className={
                  theme === "synthwave"
                    ? "text-white"
                    : "text-gray-700 font-semibold"
                }
              >
                Method: {product.method.slice(0, 35)}...
              </p>
              <p
                className={
                  theme === "synthwave"
                    ? "text-white"
                    : "text-gray-700 font-semibold"
                }
              >
                Price: ${product.price?.toFixed(2)}
              </p>
              <div className="flex items-start mt-[4px] gap-y-2">
                <p className="mr-auto text-white bg-green-500 rounded-xl p-1">
                  {product.cookingTime} minutes
                </p>
                <div
                  className={`cursor-pointer text-[25px] transition-colors duration-300 border-2 ${
                    cartItems.has(product.id)
                      ? "border-red-100 bg-green-500 text-white"
                      : "border-gray-300 bg-gray-400 text-white"
                  } rounded-full p-1`}
                  onClick={(e) => handleCartClick(product, e)}
                >
                  <FiShoppingCart className="p-[1px]" />
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
      <main>
        <div
          onClick={() => {
            navigate("/addproduct");
          }}
          className="fixed bottom-5 right-5 w-16 h-16 bg-blue-500 text-white flex items-center justify-center rounded-full shadow-lg transition-transform duration-300 hover:scale-105 hover:bg-blue-600 cursor-pointer"
        >
          <RiStickyNoteAddLine className="text-3xl" />
        </div>
      </main>
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
