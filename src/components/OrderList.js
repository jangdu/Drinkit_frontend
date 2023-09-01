import React, { useState } from "react";
import { useEffect } from "react";
import axios from "axios";

export default function OrderList() {
    const [paymentLog, setPaymentLog] = useState()
    const [reLoad, setReLoad] = useState(true)

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
                    setPaymentLog(data)

                }
            } catch (error) {
                console.log(error.message);
            }
        };
        getPaymentLog()
    }, [reLoad])

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
                if(reLoad){
                    setReLoad(false)
                }else{
                    setReLoad(true)
                }
            }
        } catch (error) {
            console.log(error.message);
            
        }
    }

    return <div>
    <div className="h-[93%] rounded-t-3xl p-3">주문 목록</div>
        {
            paymentLog &&
            paymentLog.map((item) => {
                return  <div type="submit" className="flex flex-col w-[90%] mx-auto bg-pink-300 py-1.5 rounded-2xl font-bold text-white hover:bg-pink-500 mb-3">
                                {item.impUid}: 금액-{item.totalPrice}, 주문일-{item.createdAt}, {item.status}
                            <div className="flex justify-end">
                                <button value={item.id} type="submit" className="w-[10%] bg-pink-400 rounded-2xl me-2" onClick={(e) => (cancelOrderRequest(e.target.value))}>
                                    환불하기
                                </button>
                            </div>
                        </div>
            })
        }
    </div>
}
