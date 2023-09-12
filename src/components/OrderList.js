import React, { useState } from "react";
import { useEffect } from "react";
import axios from "axios";

export default function OrderList() {
  const [paymentLog, setPaymentLog] = useState();
  const [reLoad, setReLoad] = useState(true);

  useEffect(() => {
    const getPaymentLog = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_SERVERURL}/orders`, {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.status === 200) {
          const data = await response.data;
          console.log(data)

          setPaymentLog(data);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    getPaymentLog();
  }, [reLoad]);

  const cancelOrderRequest = async (id) => {
    try {
      const response = await axios.delete(`${process.env.REACT_APP_API_SERVERURL}/orders/${id}`, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status === 200) {
        const data = await response.data;
        if (reLoad) {
          setReLoad(false);
        } else {
          setReLoad(true);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const convertUtc = (time) => {
    let date = new Date(time)
    let offset = date.getTimezoneOffset() / 60;
    let hours = date.getHours()
    date.setHours(hours - offset)
    return date.toLocaleString()
  }

  return (
    <div>
      <h1 className=" rounded-t-3xl text-2xl font-bold text-center my-4 p-3">주문 목록</h1>
      {paymentLog &&
        paymentLog.map((item) => {
          return (
            <div type="submit" key={item.id} className="flex flex-col w-[90%] mx-auto shadow-md shadow-slate-400 bg-pink-300 p-4 py-1.5 rounded-2xl font-bold text-white mb-3">
              <div className="flex flex-row justify-between">
                <p>주문 코드: {item.impUid}</p>
                <p>금액: {item.totalPrice}</p>
              </div>
              <div>구매 목록</div>
              {item.paymentDetail.length === 0 ? <div>포인트 충전</div>: item.paymentDetail.map((e) =>{ 
                  return(<div>
                    {e['product'].productName}  {e['product'].price}  X  {e.count}
                  </div>)
                })}
              <div>사용 포인트: {item.paidPoint}</div>
              <span> 주문일: {convertUtc(item.createdAt)}</span>
              <div className="flex justify-end">
                <p className="me-2">{item.status}</p>
                {item.address !== '포인트충전' ? <button value={item.id} type="submit" className="w-[10%] bg-pink-400 rounded-2xl me-2" onClick={(e) => cancelOrderRequest(e.target.value)}>
                  환불하기
                </button> : <p>포인트(환불불가)</p>}
              </div>
            </div>
          );
        })}
    </div>
  );
}
