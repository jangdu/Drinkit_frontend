import React, { useState } from "react";
import { useEffect } from "react";
import axios from "axios";

export default function OrderListByAdmin() {
    const [paymentLog, setPaymentLog] = useState()
    const [reLoad, setReLoad] = useState(true)

    useEffect(() => {
        const getPaymentLog = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_SERVERURL}/orders/Admin`, {
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

    const statusChangeOrder = async (id) => {
        try {
            const response = await axios.put(`${process.env.REACT_APP_API_SERVERURL}/orders/${id}/Admin`,{}, {
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

    const cancelOrderComplete = async (id) => {
        try {
            const response = await axios.delete(`${process.env.REACT_APP_API_SERVERURL}/orders/${id}/Ok`, {
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

    const compulsionRefund = async (id) => {
        try {
            const response = await axios.delete(`${process.env.REACT_APP_API_SERVERURL}/orders/${id}/Admin`, {
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
    <div className="h-[93%] rounded-t-3xl p-3">어드민 주문 관리</div>
        {
            paymentLog &&
            paymentLog.map((item) => {
                return  <div type="submit" className="flex flex-col w-[90%] mx-auto bg-pink-300 py-1.5 rounded-2xl font-bold text-white hover:bg-pink-500 mb-3">
                                {item.impUid}: 금액-{item.totalPrice}, 주문일-{item.createdAt}, {item.status}
                            <div className="flex justify-end">
                                <button value={item.id} type="submit" className="w-[10%] bg-pink-400 rounded-2xl me-2" onClick={(e) => (statusChangeOrder(e.target.value))}>
                                    상태 변경
                                </button>
                                <button value={item.id} type="submit" className="w-[10%] bg-pink-400 rounded-2xl me-2" onClick={(e) => (compulsionRefund(e.target.value))}>
                                    강제 환불
                                </button>
                                <button value={item.id} type="submit" className="w-[10%] bg-pink-400 rounded-2xl me-2" onClick={(e) => (cancelOrderComplete(e.target.value))}>
                                    환불 승인
                                </button>
                            </div>
                        </div>
            })
        }
    </div>
}
