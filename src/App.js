import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import { useEffect } from "react";
import { AuthContextProvider } from "./context/AuthContext";

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
        <div className="min-w-[348px] min-h-[100vh] mx-auto">
          <header className=" bg-pink-300 w-full">
            <Navbar />
          </header>
          <div className="max-w-4xl mx-auto p-4">
            <Outlet />
          </div>
        </div>
      </AuthContextProvider>
    </div>
  );
}

export default App;
