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
import Signup from "./pages/SignUp";
import AuthEmail from "./pages/Email";
import PickUpPage from "./pages/PickUpPage";
import PaymentsPage from "./pages/PaymentsPage";
import OrderList from "./components/OrderList";
import OrderListByAdmin from "./components/OrderListByAdmin";
import OrderListByStore from "./components/OrderListByStore";
import CreateStore from "./pages/Store";
import AdminPage from "./pages/AdminPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <Home /> },
      {
        path: "/chats/:roomId",
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
        path: "/pickup",
        element: (
          <ProtectedRoute>
            <PickUpPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/payments",
        element: (
          <ProtectedRoute>
            <PaymentsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/orderlist",
        element: (
          <ProtectedRoute>
            <OrderList />
          </ProtectedRoute>
        ),
      },
      {
        path: "/orderlistbyadmin",
        element: (
          <ProtectedRoute>
            <OrderListByAdmin />
          </ProtectedRoute>
        ),
      },
      {
        path: "/orderlistbystore/:storeId",
        element: (
          <ProtectedRoute>
            <OrderListByStore />
          </ProtectedRoute>
        ),
      },
      {
        path: "/test",
        element: <Test />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },
      {
        path: "/authEmail",
        element: <AuthEmail />,
      },
      {
        path: "/store",
        element: (
          <ProtectedRoute>
            <CreateStore />
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin",
        element: (
          <ProtectedRoute requireAdmin={true}>
            <AdminPage />
          </ProtectedRoute>
        ),
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
