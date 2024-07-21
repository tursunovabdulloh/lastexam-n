import { RiStickyNoteAddLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { useEffect, useState } from "react";
import { Recipe } from "../types";

export default function Home() {
  const [products, setProducts] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "recipes"));
        const fetchedRecipes = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.title,
            cookingtime: data.cookingtime,
            ingredients: data.ingredients || [],
            imageurl: data.imageurl || [],
            methods: data.methods,
            nation: data.nation,
          };
        }) as Recipe[];

        setProducts(fetchedRecipes);
      } catch (error) {
        console.error("Error fetching recipes: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipe();
  }, []);

  const OnclikProduct = (id?: string) => {
    if (id) {
      navigate(`./recipes/${id}`);
    } else {
    }
  };
  if (loading) {
    return (
      <div className="container mx-auto p-4 flex justify-center items-center h-screen">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin"></div>
      </div>
    );
  }
  console.log(products);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-center mt-5 mb-8 font-bold text-2xl">Recipe List</h2>
      <div className="">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              onClick={() => OnclikProduct(product.id)}
              className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer"
            >
              <div className="flex flex-col p-4">
                <h2 className="text-xl font-bold mb-2">{product.title}</h2>
                <p className="text-gray-700">Methods: {product.methods}</p>
                <div className="flex items-start mt-1 gap-y-2">
                  <p className="text-white bg-green-500 rounded-xl p-1">
                    {product.cookingtime} minutes
                  </p>
                </div>
              </div>
              {product.imageurl && product.imageurl.length > 0 && (
                <div className="w-full h-[280px]">
                  <img
                    src={product.imageurl[0]}
                    alt={product.title}
                    className="object-cover w-full h-full"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
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
    </div>
  );
}
