import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import { useEffect } from "react";
import { AuthContextProvider } from "./context/AuthContext";
import CartProvider from "./context/CartContext";
import ToggleButton from "./components/ui/ToggleButton";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
function App() {
  return (
    <div className="">
      <ScrollToTop />
      <AuthContextProvider>
        <CartProvider>
          <div className="min-w-[348px] min-h-[100vh] mx-auto">
            <header className=" border-b-2 border-pink-200 w-full">
              <Navbar />
            </header>
            <div className="max-w-4xl mx-auto p-4">
              <Outlet />
            </div>
          </div>
          <ToggleButton />
        </CartProvider>
      </AuthContextProvider>
    </div>
  );
}

export default App;
