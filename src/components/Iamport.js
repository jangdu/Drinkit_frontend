import React from "react";
import axios from "axios";

const IMP = window.IMP;

export class RequestPay extends React.Component {
    requestPay = async (cartItems, input, user, usePoint, storeId) => {
        if(!storeId){
            throw new Error("점포 고유 아이디 값이 존재하지 않습니다.")
        }
        IMP.init("imp26455227")
        let name = '';
        let amount = 0;
        await cartItems.map((e) => {
            name += `, ${e.productName}`;
            amount += Number(e.price)*e.count
        })

        amount -= Number(usePoint)
        const uuid = ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g,c => (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16))

        let orderList = []
        for(let i = 0; i < cartItems.length; i++){
            orderList.push({productId: cartItems[i].productId , count: cartItems[i].count,
            productName: cartItems[i].productName, price: cartItems[i].price})
        }
        orderList = orderList.sort(function (a, b) {
            return b.productId === a.productId ? a.productId - b.productId : a.productId - b.productId;
        });
        try{
            const response = await axios.post(`${process.env.REACT_APP_API_SERVERURL}/orders`,
            { orderList, paidPoint: Number(usePoint), storeId } ,{
                withCredentials: true,
                headers: {
                "Content-Type": "application/json",
                },
            });

            if (response.status === 201) {
                const data = await response.data;

                IMP.request_pay(
                    {
                        pg: 'kakaopay.TC0ONETIME',
                        pay_method: 'card',
                        merchant_uid: uuid,
                        name: name.replace(', ',""),
                        amount,
                        buyer_email: user.email,
                        buyer_name: user.name,
                        buyer_tel: user.phoneNumber,
                        buyer_addr: input,
                        buyer_postcode: '123-456',
                    },
                    async function (rsp) {
                    let msg = '';
                        if (rsp.success) {
                            msg = `결제가 완료되었습니다.\n고유ID: ${rsp.imp_uid}\n상점 거래ID: ${rsp.merchant_uid}\n결제 금액: ${rsp.paid_amount}원\n카드 승인번호: ${rsp.apply_num}`;
            
                            const response = await axios.post(`${process.env.REACT_APP_API_SERVERURL}/orders/postOrder`,
                            {totalPrice: rsp.paid_amount, orderList, impUid: rsp.imp_uid, paidPoint: Number(usePoint), storeId, address: input } ,{
                                withCredentials: true,
                                headers: {
                                "Content-Type": "application/json",
                                },
                            });
    
                            if (response.status === 201) {
                                await response.data;
                                alert(msg)
                            }
                        }
                    },
                );
            }
        }catch(err){
            alert(`주문 요청 실패\n${err}`)
        }
    }

    refund = async () => {
        try {
            const imp_uid = "imp_307106818290"
            const response = await axios.post(`${process.env.REACT_APP_API_SERVERURL}/orders/refund`,{imp_uid} ,{
                withCredentials: true,
                headers: {
                "Content-Type": "application/json",
                },
            });
            if (response.status === 201) {
                const data = await response.data;
                alert(`${data.imp_uid}\n${data.name}상품이 환불되었습니다.`)
            }
        } catch (error) {
            console.log(error.message);
        }
    }
}

