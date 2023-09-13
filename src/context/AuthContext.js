import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { RiTokenSwapLine } from "react-icons/ri";

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
      const {token, profile} = data
      if (response.status === 202) {
        if (data.store !== null) {
          setMyStore(profile.store);
        } else {
          setMyStore({});
        }
      } else if (response.status === 200) {
        setMyStore({});
      } else {
        setMyStore({});
        setUser({});
      }

      document.cookie = `AccessToken=Bearer ${token.accessToken}; Secure; SameSite=None;`;
      document.cookie = `RefreshToken=Bearer ${token.refreshToken}; Secure; SameSite=None;`;
      
      setUser(profile);
      setIsLoading(false);
    } catch (error) {
      setMyStore(null);
      setUser(null);
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, myStore, userId: user && user.id, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  return useContext(AuthContext);
}
