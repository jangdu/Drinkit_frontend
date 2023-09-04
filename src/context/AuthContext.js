import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthContextProvider({ children }) {
  const [user, setUser] = useState();
  const [myStore, setMyStore] = useState();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setUser(getUser());
  }, []);

  const getUser = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_SERVERURL}/user/profile`,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const { data } = await response;
      if (response.status === 202) {
        if (data.store !== null) {
          setMyStore(data.store);
        } else {
          setMyStore({});
        }
      } else if (response.status === 200) {
        setMyStore({});
      } else {
        setMyStore({});
        setUser({});
      }
      setUser(data);
      setIsLoading(false);
    } catch (error) {
      setMyStore(null);
      setUser(null);
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, myStore, userId: user && user.id, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  return useContext(AuthContext);
}
