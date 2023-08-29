import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import NotFound from "./pages/NotFound.js";
import Home from "./pages/Home";
import Chats from "./pages/Chats";
import ChatsList from "./pages/ChatsList";
import ProtectedRoute from "./context/ProtectedRoute";
import MyProfile from "./pages/MyProfile";
import ProductDetail from "./pages/ProductDetail";
import Subscribes from "./pages/subscribes";
import Test from "./pages/Test";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <Home /> },
      {
        path: "/chats",
        element: (
          <ProtectedRoute>
            <Chats />
          </ProtectedRoute>
        ),
      },
      {
        path: "/chatlist",
        element: (
          <ProtectedRoute>
            <ChatsList />
          </ProtectedRoute>
        ),
      },
      {
        path: "/profile",
        element: (
          <ProtectedRoute>
            <MyProfile />
          </ProtectedRoute>
        ),
      },
      {
        path: "/products/:productId",
        element: <ProductDetail />,
      },
      {
        path: "/subscribes",
        element: (
          <ProtectedRoute>
            <Subscribes />
          </ProtectedRoute>
        ),
      },
      {
        path: "/test",
        element: <Test />,
      },
      // {
      //   path: '/stores/:storeId',
      //   element: <Stores />,
      // },
      // {
      //   path: '/payments',
      //   element: (
      //     <ProtectedRoute>
      //       <Payments />
      //     </ProtectedRoute>
      //   ),
      // },
      // {
      //   path: '/ordered',
      //   element: (
      //     <ProtectedRoute>
      //       <OrderedPage />
      //     </ProtectedRoute>
      //   ),
      // },
      // {
      //   path: '/userOrdered',
      //   element: (
      //     <ProtectedRoute>
      //       <UserOrderedPage />
      //     </ProtectedRoute>
      //   ),
      // },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<RouterProvider router={router} />);

reportWebVitals();
