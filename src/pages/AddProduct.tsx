import { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase";

export default function AddProduct() {
  const [formData, setFormData] = useState({
    title: "",
    cookingTime: undefined as number | undefined,
    ingredients: [] as string[],
    ingredient: "",
    imageURL: "",
    imageURLs: [] as string[],
    method: "",
    nation: "",
    price: 0,
  });
  const [modalOpen, setModalOpen] = useState(false);

  const isValidURL = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleAddIngredient = () => {
    if (formData.ingredient.trim()) {
      setFormData((prevData) => ({
        ...prevData,
        ingredients: [...prevData.ingredients, formData.ingredient],
        ingredient: "",
      }));
    }
  };

  const handleAddImageURL = () => {
    if (
      formData.imageURL.trim() &&
      isValidURL(formData.imageURL) &&
      formData.imageURLs.length < 4
    ) {
      setFormData((prevData) => ({
        ...prevData,
        imageURLs: [...prevData.imageURLs, formData.imageURL],
        imageURL: "",
      }));
    }
  };

  const handleSubmit = async () => {
    const product = {
      title: formData.title,
      cookingTime: formData.cookingTime,
      ingredients: formData.ingredients,
      imageURLs: formData.imageURLs,
      method: formData.method,
      nation: formData.nation,
      price: formData.price,
    };

    await addDoc(collection(db, "recipe"), product);

    alert("Product submitted successfully!");
    setFormData({
      title: "",
      cookingTime: undefined,
      ingredients: [],
      ingredient: "",
      imageURL: "",
      imageURLs: [],
      method: "",
      nation: "",
      price: 0,
    });
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: Number(value),
    }));
  };

  return (
    <div className="w-full h-full pb-5">
      <div className="max-w-[520px] mx-auto mt-[30px]">
        <div className="flex flex-col text-center">
          <h1 className="text-[25px] font-semibold mb-[20px]">
            Add New Product
          </h1>
          <div className="flex flex-col gap-[10px] px-[10px]">
            <label className="form-control w-full text-left">
              <span className="text-lg mb-1 block">Title:</span>
              <input
                type="text"
                name="title"
                placeholder="Enter product name"
                className="input input-bordered w-full"
                value={formData.title}
                onChange={handleChange}
              />
            </label>
            <label className="form-control w-full text-left">
              <span className="text-lg mb-1 block">Cooking time:</span>
              <input
                type="number"
                name="cookingTime"
                placeholder="Enter preparation time"
                className="input input-bordered w-full"
                value={formData.cookingTime ?? ""}
                onChange={handleNumberChange}
              />
            </label>
            <label className="form-control w-full text-left">
              <span className="text-lg mb-1 block">Nation:</span>
              <select
                name="nation"
                className="select select-bordered w-full"
                value={formData.nation}
                onChange={handleChange}
              >
                <option value="" disabled>
                  Select a nation
                </option>
                <option value="Uzbek">Uzbek</option>
                <option value="Uyghur">Uyghur</option>
                <option value="Russian">Russian</option>
                <option value="Kazakh">Kazakh</option>
                <option value="Turkish">Turkish</option>
              </select>
            </label>
            <label className="form-control w-full text-left">
              <span className="text-lg mb-1 block">Price:</span>
              <input
                type="number"
                name="price"
                min={0}
                max={100}
                value={formData.price}
                onChange={handleNumberChange}
                className="input input-bordered w-full"
              />
            </label>
            <div className="text-left">
              <label className="text-lg mb-1">Ingredients:</label>
              <div className="flex gap-[10px] items-center mb-2">
                <input
                  type="text"
                  name="ingredient"
                  placeholder="Enter ingredient"
                  className="input input-bordered w-full"
                  value={formData.ingredient}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="btn bg-accent text-primary-content w-[80px] text-lg"
                  onClick={handleAddIngredient}
                >
                  +
                </button>
              </div>
              <div className="flex gap-[12px] flex-wrap">
                {formData.ingredients.length > 0
                  ? formData.ingredients.map((ing, index) => (
                      <span key={index} className="p-[5px] rounded-lg border">
                        {ing}
                      </span>
                    ))
                  : null}{" "}
                {/* No ingredients message removed */}
              </div>
            </div>
            <div className="text-left">
              <label className="text-lg mb-1">Image URL:</label>
              <div className="flex gap-[10px] items-center mb-2">
                <input
                  type="text"
                  name="imageURL"
                  placeholder="Enter image URL"
                  className="input input-bordered w-full"
                  value={formData.imageURL}
                  onChange={handleChange}
                  disabled={formData.imageURLs.length >= 4}
                />
                <button
                  type="button"
                  className={`btn bg-accent text-primary-content w-[80px] text-lg ${
                    formData.imageURLs.length >= 4 ? "btn-disabled" : ""
                  }`}
                  onClick={handleAddImageURL}
                  disabled={formData.imageURLs.length >= 4}
                >
                  +
                </button>
              </div>
              <div className="flex gap-[12px] flex-wrap">
                {formData.imageURLs.length > 0 ? (
                  formData.imageURLs.map((url, index) => (
                    <img
                      key={index}
                      className="w-[40px] h-[40px] object-cover rounded-lg"
                      src={url}
                      alt={`Image ${index}`}
                    />
                  ))
                ) : (
                  <p className="p-[5px] rounded-lg border">No images yet</p>
                )}
              </div>
            </div>
            <div className="text-left">
              <label className="text-lg mb-1">Method:</label>
              <textarea
                className="textarea textarea-bordered w-full"
                placeholder="Enter method"
                name="method"
                value={formData.method}
                onChange={handleChange}
              ></textarea>
            </div>
            <div className="flex justify-center gap-[10px] flex-wrap mt-5">
              <button
                className="btn bg-info w-[245px] hover:bg-info-focus"
                onClick={handleSubmit}
              >
                Apply
              </button>
              <button
                onClick={() => setModalOpen(true)}
                className="btn bg-accent w-[245px] hover:bg-accent-focus"
              >
                Preview
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
