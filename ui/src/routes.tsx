import { createBrowserRouter } from "react-router-dom";
import {Cart} from "./pages/cart/index";
import Home from "./pages/home";
import Error from "./pages/error";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <Error />,
  },
  {
    path: "/cart",
    element: <Cart />,
    errorElement: <Error />,
  },
]);
