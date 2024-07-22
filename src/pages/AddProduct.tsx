import { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import ProductModal from "./productModal";

export default function AddProduct() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    cookingTime: 0,
    ingredients: [] as string[],
    ingredient: "",
    imageURL: "",
    imageURLs: [] as string[],
    method: "",
    nation: "",
    price: 0,
  });

  const [errors, setErrors] = useState({
    title: false,
    cookingTime: false,
    ingredients: false,
    imageURL: false,
    nation: false,
    price: false,
    method: false,
  });

  const [showModal, setShowModal] = useState(false);

  const isValidURL = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const validateForm = () => {
    const newErrors: any = {};

    if (formData.title.trim() === "") {
      newErrors.title = true;
    }
    if (formData.cookingTime <= 0) {
      newErrors.cookingTime = true;
    }
    if (formData.ingredients.length < 3) {
      newErrors.ingredients = true;
    }
    if (formData.nation.trim() === "") {
      newErrors.nation = true;
    }
    if (formData.price <= 0) {
      newErrors.price = true;
    }
    if (formData.method.trim() === "") {
      newErrors.method = true;
    }
    if (!isValidURL(formData.imageURL) && formData.imageURL.trim() !== "") {
      newErrors.imageURL = true;
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      toast.error("Incorrect input!");
    }

    return Object.keys(newErrors).length === 0;
  };

  const handleAddIngredient = () => {
    if (formData.ingredient.trim()) {
      setFormData((prevData) => {
        const newIngredients = [...prevData.ingredients, formData.ingredient];
        return {
          ...prevData,
          ingredients: newIngredients,
          ingredient: "",
        };
      });
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
    } else {
      toast.error("Incorrect URL format.");
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const product = {
      title: formData.title,
      cookingTime: formData.cookingTime,
      ingredients: formData.ingredients,
      imageURLs: formData.imageURLs,
      method: formData.method,
      nation: formData.nation,
      price: formData.price,
    };

    try {
      await addDoc(collection(db, "recipe"), product);
      toast.success("Recipe added successfully!");
      navigate("/");
      setFormData({
        title: "",
        cookingTime: 0,
        ingredients: [],
        ingredient: "",
        imageURL: "",
        imageURLs: [],
        method: "",
        nation: "",
        price: 0,
      });
      setErrors({
        title: false,
        cookingTime: false,
        ingredients: false,
        imageURL: false,
        nation: false,
        price: false,
        method: false,
      });
    } catch (error) {
      toast.error("Failed to add the recipe. Please try again.");
    }
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

  const openModal = () => {
    if (validateForm()) {
      setShowModal(true);
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="w-full h-full pb-5">
      <ToastContainer />
      <div className="max-w-[520px] mx-auto mt-[30px]">
        <button
          className="bg-green-500 text-white px-4 py-2 rounded-lg shadow hover:bg-green-600 transition fixed top-16 right-4 md:top-16 md:right-6 lg:top-16 lg:right-8"
          onClick={() => navigate("/")}
        >
          Back
        </button>
        <div className="flex flex-col text-center">
          <h1 className="text-[25px] font-semibold mb-[10px]">
            Add New Recipe
          </h1>
          <div className="flex flex-col gap-[6px] px-[10px]">
            <label
              className={`form-control w-full text-left ${
                errors.title ? "border-red-500" : ""
              }`}
            >
              <span className="text-lg mb-1 block">Title:</span>
              <input
                type="text"
                name="title"
                placeholder="Enter product name"
                className={`input input-bordered w-full ${
                  errors.title ? "border-red-500" : ""
                }`}
                value={formData.title}
                onChange={handleChange}
              />
            </label>
            <label
              className={`form-control w-full text-left ${
                errors.cookingTime ? "border-red-500" : ""
              }`}
            >
              <span className="text-lg mb-1 block">Cooking time:</span>
              <input
                type="number"
                name="cookingTime"
                placeholder="Enter preparation time"
                className={`input input-bordered w-full ${
                  errors.cookingTime ? "border-red-500" : ""
                }`}
                value={formData.cookingTime === 0 ? "" : formData.cookingTime}
                onChange={(e) => {
                  const value = e.target.value;
                  setFormData((prevData) => ({
                    ...prevData,
                    cookingTime: value ? Number(value) : 0,
                  }));
                }}
              />
            </label>
            <label
              className={`form-control w-full text-left ${
                errors.nation ? "border-red-500" : ""
              }`}
            >
              <span className="text-lg mb-1 block">Nation:</span>
              <select
                name="nation"
                className={`select select-bordered w-full ${
                  errors.nation ? "border-red-500" : ""
                }`}
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
            <label
              className={`form-control w-full text-left ${
                errors.price ? "border-red-500" : ""
              }`}
            >
              <span className="text-lg mb-1 block">Price:</span>
              <input
                type="number"
                name="price"
                min={0}
                max={100}
                className={`input input-bordered w-full ${
                  errors.price ? "border-red-500" : ""
                }`}
                value={formData.price === 0 ? "" : formData.price}
                onChange={(e) => {
                  const value = e.target.value;
                  setFormData((prevData) => ({
                    ...prevData,
                    price: value ? Number(value) : 0,
                  }));
                }}
              />
            </label>
            <div
              className={`text-left ${
                errors.ingredients ? "border-red-500" : ""
              }`}
            >
              <label className="text-lg mb-1">Ingredients:</label>
              <div className="flex gap-[10px] items-center mb-2">
                <input
                  type="text"
                  name="ingredient"
                  placeholder="Enter ingredient"
                  className={`input input-bordered w-full ${
                    errors.ingredients ? "border-red-500" : ""
                  }`}
                  value={formData.ingredient}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="btn btn-accent w-[80px] text-lg"
                  onClick={handleAddIngredient}
                >
                  +
                </button>
              </div>
              {formData.ingredients.length > 0 && (
                <div className="flex items-center gap-x-1">
                  <p className="badge badge-accent">Ingredients:</p>
                  {formData.ingredients.map((ing, index) => (
                    <span key={index} className="badge badge-accent">
                      {ing}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div
              className={`text-left ${errors.imageURL ? "border-red-500" : ""}`}
            >
              <label className="text-lg mb-1">Image URL:</label>
              <div className="flex gap-[10px] items-center mb-2">
                <input
                  type="text"
                  name="imageURL"
                  placeholder="Enter image URL"
                  className={`input input-bordered w-full ${
                    errors.imageURL ? "border-red-500" : ""
                  }`}
                  value={formData.imageURL}
                  onChange={handleChange}
                  disabled={formData.imageURLs.length >= 4}
                />
                <button
                  type="button"
                  className={`btn btn-accent w-[80px] text-lg ${
                    formData.imageURLs.length >= 4 ? "btn-disabled" : ""
                  }`}
                  onClick={handleAddImageURL}
                  disabled={formData.imageURLs.length >= 4}
                >
                  +
                </button>
              </div>
              {formData.imageURLs.length > 0 && (
                <div className="flex items-center gap-x-1">
                  {formData.imageURLs.map((url, index) => (
                    <img
                      key={index}
                      src={url}
                      alt={`Preview ${index}`}
                      className="w-20 h-20 object-cover rounded-md"
                    />
                  ))}
                </div>
              )}
            </div>
            <label
              className={`form-control w-full text-left ${
                errors.method ? "border-red-500" : ""
              }`}
            >
              <span className="text-lg mb-1 block">Method:</span>
              <textarea
                name="method"
                placeholder="Enter cooking method"
                className={`textarea textarea-bordered w-full ${
                  errors.method ? "border-red-500" : ""
                }`}
                value={formData.method}
                onChange={handleChange}
              />
            </label>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mt-2">
              <button
                type="button"
                className="btn btn-info w-full sm:w-[245px] text-[14px] sm:text-[16px] py-2"
                onClick={handleSubmit}
              >
                Apply
              </button>
              <button
                onClick={openModal}
                className="btn btn-success w-full sm:w-[245px] text-[14px] sm:text-[16px] py-2"
              >
                Preview
              </button>
            </div>
          </div>
        </div>
      </div>

      {showModal && <ProductModal recipe={formData} onClose={closeModal} />}
    </div>
  );
}
