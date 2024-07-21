import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import Layout from "./Layout";
import Home from "./pages/Home";
import AddProduct from "./pages/AddProduct";
import ProductDetail from "./pages/ProductDetail";
import Login from "./pages/login";
import { useSelector } from "react-redux";
import Signup from "./pages/SignUp";

export default function App() {
  const ProtectedRoutes: React.FC<{ children: JSX.Element }> = ({
    children,
  }) => {
    const user = useSelector((state: any) => state.user.user);

    if (!user) {
      return <Navigate to="/login" />;
    }
    return children;
  };

  const routes = createBrowserRouter([
    {
      path: "/",
      element: (
        <ProtectedRoutes>
          <Layout />
        </ProtectedRoutes>
      ),
      children: [
        {
          index: true,
          element: <Home />,
        },
        {
          path: "/addproduct",
          element: <AddProduct />,
        },
        {
          path: "recipes/:id",
          element: <ProductDetail />,
        },
      ],
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/signup",
      element: <Signup />,
    },
  ]);

  return <RouterProvider router={routes} />;
}
