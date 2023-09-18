import React, { useEffect, useState } from "react";
import Cart from "../components/Cart";
import axios from "axios";
import { RequestPay } from "../components/Iamport";
import { useCart } from "../context/CartContext";

export default function PaymentsPage() {
  const { cartItems, getTotalCount, getTotalPrice } = useCart();
  const [user, setUser] = useState();
  const [userAddressArr, setUserAddressArr] = useState([{ address: "" }]);
  const [input, setInput] = useState();
  const [usePoint, setUsePoint] = useState(0);
  const requstPay = new RequestPay();

  useEffect(() => {
    const getUserAddress = async () => {
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
        if (response.status === 200) {
          const data = await response.data;

          setUser(data);
          setUserAddressArr(JSON.parse(data.address));
          setInput(JSON.parse(data.address)[0].address);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    getUserAddress();
  }, []);

  const amount = getTotalPrice().replace(',', '')
  if(Number(amount)*0.5 < Number(usePoint) ){
    setUsePoint(amount*0.5)
  }

  return (
    <div className="flex flex-col p-2 px-4">
      <h1 className="my-4 font-mono text-2xl font-bold text-center">
        주문/결제
      </h1>
      <div className="flex flex-col justify-around gap-4 md:flex-row ">
        <div className="bg-white w-[90%] md:w-[50%] mx-auto p-4 flex items-center rounded-lg border">
          <Cart />
        </div>
        <div className="flex max-h-96 flex-col w-[90%] md:w-[40%]  font-semibold mx-auto bg-white p-3 rounded-lg border">
          <p className="p-2 mb-4 text-lg border-b-2">계산서</p>
          <div className="flex flex-row justify-between my-2 text-slate-500">
            <p>{`총 상품 갯수`}</p>
            <p className="text-black">{getTotalCount()}</p>
          </div>
          <div className="flex flex-row justify-between my-2 text-slate-500">
            <p>{`총 상품 가격`}</p>
            <p className="text-black">{getTotalPrice()}</p>
          </div>
          <div className="flex flex-col my-2">
            <div className="flex flex-row justify-between my-2 text-slate-500">
              <p>사용 가능 포인트</p>
              <p className="text-black">{user && user.point}</p>
            </div>
            <div className="flex flex-row justify-end gap-2 text-center">
              <p className="text-slate-500">포인트 사용</p>
              <input
                className="flex w-24"
                type="number"
                placeholder="사용할 포인트"
                value={usePoint}
                onChange={(e) => {
                  setUsePoint(e.target.value);
                }}
              />
            </div>
          </div>
          <div className="flex flex-row justify-between my-2 text-slate-500">
            <p>주소지 선택</p>
            <select
              className="w-[75%] my-6 text-black"
              onChange={(e) => setInput(e.target.value)}
            >
              {userAddressArr.map((item) => {
                return (
                  <option key={item.name} value={item.address}>
                    {item.address}
                  </option>
                );
              })}
            </select>
          </div>

          <button
            type="submit"
            className="w-[80%] mx-auto bg-pink-300 py-1.5 rounded-2xl font-bold text-white hover:bg-pink-500"
            onClick={() =>
              requstPay.requestPay(cartItems, input, user, usePoint, 1)
            }
          >
            주문하기
          </button>
        </div>
      </div>
    </div>
  );
}
