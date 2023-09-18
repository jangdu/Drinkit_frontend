import React, { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";
import ReviewModal from "./reviewModal";

const customStyles = {
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  content: {
    width: "80%",
    "max-width": "450px",
    position: "absolute",
    height: "450px",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "white",
    padding: "1rem",
    borderRadius: "0.5rem",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
    animation: "slide-up 0.5s", // 애니메이션 적용
  },
};

// 슬라이드 업 애니메이션을 위한 CSS 키 프레임 정의
const slideUpAnimation = `
  @keyframes slide-up {
    from {
      transform: translate(-50%, 100%);
    }
    to {
      transform: translateY(-50%, 0);
    }
  }
`;

export default function OrderList() {
  const [paymentLog, setPaymentLog] = useState();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [reLoad, setReLoad] = useState(true);
  const [paymentDetailId, setPaymentDetailId] = useState()

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
          setPaymentLog(data);
          alert("완료 상태의 주문에만 리뷰 작성이 가능합니다.")
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
                  return(<div key={e.id} className="mb-2">
                    {e['product'].productName}  X  {e.count} {item.status !== '완료' ? <p></p> : e.isComplete ? <button className="w-[80px] cursor-default bg-pink-400 rounded-2xl me-2">작성완료</button> : <button value={e.id} key={e.id} className="w-[80px] bg-pink-400 rounded-2xl me-2" onClick={(e) => {
                        setPaymentDetailId(e.target.value); 
                        setModalIsOpen(true);
                      }}>리뷰작성</button>}
                  </div>)
                })}
              <div>사용 포인트: {item.paidPoint}</div>
              <span> 주문일: {convertUtc(item.createdAt)}</span>
              <div className="flex justify-end">
                <p className="me-2">{item.status}</p>
                {item.address !== '지급완료' ? <button value={item.id} type="submit" className="w-[100px] bg-pink-400 rounded-2xl me-2 " onClick={(e) => cancelOrderRequest(e.target.value)}>
                  환불하기
                </button> : <p>포인트(환불불가)</p>}
              </div>
            </div>
          );
        })}

        <Modal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)} style={customStyles}>
          <style>{slideUpAnimation}</style>
          <div className=""> {<ReviewModal paymentDetailId={paymentDetailId}/>}</div>
        </Modal>
    </div>
  );
}
