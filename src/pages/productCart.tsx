import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { incrementCount, decrementCount, setCart } from "../store/cartSlice";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

function ProductCart() {
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const theme = useSelector((state: any) => state.theme.theme);

  const userId = JSON.parse(localStorage.getItem("userId") || "null");

  const dispatch = useDispatch();
  const cartItems = useSelector((state: any) => state.cart.items);

  useEffect(() => {
    const fetchCartItems = async () => {
      if (!userId) {
        console.log("User ID mavjud emas");
        setLoading(false);
        return;
      }
      try {
        const cartDocRef = doc(db, "cart", userId);
        const cartDocSnap = await getDoc(cartDocRef);

        if (cartDocSnap.exists()) {
          const data = cartDocSnap.data();
          const fetchedData = Object.values(data || []);
          console.log("Olingan ma'lumotlar:", fetchedData);
          dispatch(setCart(fetchedData));
        } else {
          console.log("Cart hujjati topilmadi");
        }
      } catch (error) {
        console.error("Savat ma'lumotlarini olishda xato:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, [userId, dispatch]);

  const handleCountChange = (id: string, increment: boolean) => {
    if (!id) {
      console.error("Product ID is missing or undefined");
      return;
    }

    if (increment) {
      dispatch(incrementCount(id));
    } else {
      dispatch(decrementCount(id));
    }
  };

  const handleCheckboxChange = (id: string) => {
    console.log("Checkbox change for Product ID:", id);
    setSelectedItems((prevSelectedItems) => {
      if (prevSelectedItems.includes(id)) {
        return prevSelectedItems.filter((id) => id !== id);
      } else {
        return [...prevSelectedItems, id];
      }
    });
  };

  const selectedProducts = cartItems.filter((item: any) =>
    selectedItems.includes(item.productId)
  );

  const calculateTotalPrice = (): string => {
    return selectedProducts
      .reduce(
        (total: number, item: any) =>
          total +
          (item.price || 0) *
            (cartItems.find((i: any) => i.productId === item.productId)
              ?.count || 0),
        0
      )
      .toFixed(2);
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl text-center font-bold mb-4">Product Cart</h2>
      {loading ? (
        <div className="relative mt-40 items-center justify-center">
          <div className="absolute top-[30%] left-1/2 transform -translate-x-1/2 -translate-y-1/4">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin"></div>
          </div>
        </div>
      ) : cartItems.length === 0 ? (
        <p className="text-center">No items in cart</p>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <div className="grid grid-cols-1 gap-4">
              {cartItems.map((item: any) => (
                <div
                  key={item.id}
                  className="rounded-lg p-4 flex gap-8 border-b border-gray-300 last:border-bottom-2"
                >
                  <div>
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => handleCheckboxChange(item.id)}
                    />
                  </div>
                  <div className="border-2 border-gray-300 rounded-md w-32 h-32">
                    <img
                      src={item.imageURLs[0] || "/default-image.png"}
                      alt={item.title}
                      className="w-32 h-32 object-cover rounded-md"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="w-full flex justify-between items-center mb-2">
                      <p
                        className={
                          theme === "synthwave"
                            ? "text-lg font-bold text-gray-100"
                            : "text-lg font-bold text-gray-700"
                        }
                      >
                        {item.title}
                      </p>
                      <div className="flex items-center">
                        <button
                          onClick={() => handleCountChange(item.id, false)}
                          className="btn btn-neutral rounded-full min-h-0 text-white w-8 h-8"
                        >
                          -
                        </button>
                        <p className="mx-2 text-gray-500">{item.count || 0}</p>
                        <button
                          onClick={() => handleCountChange(item.id, true)}
                          className="btn btn-neutral rounded-full min-h-0 text-white w-8 h-8"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <p
                        className={
                          theme === "synthwave"
                            ? "text-lg font-bold text-gray-100"
                            : "text-lg font-bold text-gray-800"
                        }
                      >
                        {item.price} $
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {selectedItems.length > 0 && (
            <div className="flex-1 bg-gray-100 p-4 rounded-lg border border-gray-300">
              <h3 className="text-xl font-bold mb-4">Summary</h3>
              <p className="mb-2">Total Price: {calculateTotalPrice()} $</p>
              {/* Add more summary details if needed */}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ProductCart;
