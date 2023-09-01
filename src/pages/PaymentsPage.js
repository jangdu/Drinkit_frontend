import React, { useEffect, useState } from "react";
import Cart from "../components/Cart";
import axios from "axios";
import { RequestPay } from "../components/Iamport";
import { useCart } from "../context/CartContext";

export default function PaymentsPage() {
  const { cartItems } = useCart();
  const [user, setUser] = useState()
  const [userAddressArr, setUserAddressArr] = useState([{address: ""}]);
  const [input, setInput] = useState();
  const [usePoint, setUsePoint] = useState(0)
  const requstPay = new RequestPay()

  useEffect(() => {
    const getUserAddress = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_SERVERURL}/user/profile`, {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.status === 200) {
          const data = await response.data;

          setUser(data)
          setUserAddressArr(JSON.parse(data.address))
          setInput(JSON.parse(data.address)[0].address)
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    getUserAddress()
  }, [])

  useEffect(() => {
    if(user){
      if(Number(usePoint) > Number(user.point)){
        setUsePoint(user.point)
      }
    }
  }, [usePoint])

  return <div>
          주문하는 페이지
          <Cart />
          <div>
            <p>주소 선택하기</p>
            <select onChange={(e) => setInput(e.target.value)}>
              {
                userAddressArr.map((item)=>{
                  return <option value={item.address} >{item.address}</option>
                })
              }
            </select>
            <p>사용 가능 포인트: {user && user.point}</p>
            <input type="number" value={usePoint} onChange={(e) => {setUsePoint(e.target.value)}} />
          </div>
          <button type="submit" className="w-[80%] mx-auto bg-pink-300 py-1.5 rounded-2xl font-bold text-white hover:bg-pink-500" onClick={() => requstPay.requestPay(cartItems, input, user, usePoint, 1)}>
            주문하기
          </button>
        </div>;
}
