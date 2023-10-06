import React, { useState, useContext } from "react";

// 초기 장바구니 상태
// [{productId: , count: }]
const initialCartItems = [];

// 장바구니 관련 컨텍스트 생성
const CartContext = React.createContext();

const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(initialCartItems);
  const [clickedPickupBtn, setClickedPickupBtn] = useState(false);

  // 장바구니 추가
  const addToCart = async (newItem) => {
    // 중복된 productId를 가진 메뉴가 이미 장바구니에 있는지 체크
    const existingItemIndex = cartItems.findIndex((item) => item.productId === newItem.productId);

    if (existingItemIndex !== -1) {
      const updatedCart = [...cartItems];
      
      updatedCart[existingItemIndex].count += newItem.count;
      
      setCartItems(updatedCart);
    } else {
      setCartItems([...cartItems, newItem]);
    }
  };

  // 장바구니 내 상품 갯수 +1
  const increaseCount = (productId) => {
    const updatedCart = cartItems.map((item) => (item.productId === productId ? { ...item, count: item.count + 1 } : item));
    setCartItems(updatedCart);
  };

  // 장바구니 내 상품 갯수 -1
  const decreaseCount = (productId) => {
    const updatedCart = cartItems.map((item) => (item.productId === productId && item.count > 1 ? { ...item, count: item.count - 1 } : item));
    setCartItems(updatedCart);
  };

  // 장바구니 내 상품 삭제
  const removeFromCart = (index) => {
    const updatedCart = cartItems.filter((item) => item.productId !== index);
    setCartItems(updatedCart);
  };

  // 장바구니 내 메뉴 개수 총합
  const getTotalCount = () => {
    return cartItems.reduce((total, item) => total + item.count, 0);
  };

  // 장바구니 내 메뉴 가격의 총합
  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price * item.count, 0).toLocaleString();
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        clickedPickupBtn,
        setClickedPickupBtn,
        addToCart,
        decreaseCount,
        increaseCount,
        removeFromCart,
        getTotalCount,
        removeMyCart,
        getTotalPrice,
      }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export default CartProvider;
