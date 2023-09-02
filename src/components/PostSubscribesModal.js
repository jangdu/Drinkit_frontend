import React, { useState, useEffect } from "react";
import axios from "axios";

const PostSubscribesModal = (user) => {
  const [cost, setCost] = useState();
  const [userAddressArr, setUserAddressArr] = useState([{address: ""}])
  const [selectAddress, setSelectAddress] = useState()

  useEffect(() => {
    //구독 상품 가격
    setCost(18900)
    setUserAddressArr(JSON.parse(user.user.address));
    setSelectAddress(JSON.parse(user.user.address)[0].address);
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault();
        try {
            const postSubscribe = async() => {
                const response = await axios.post(
                    `${process.env.REACT_APP_API_SERVERURL}/subscribes`,
                    {isPaid: true, address: selectAddress},
                    {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "application/json",
                    },
                    }
                );
        
                if (response.status === 201) {
                        alert("구독이 완료되었습니다.");
                        window.location.reload();
                    }
            }
            postSubscribe()
        } catch (error) {
            alert(error);
            console.error("Error occurred during add point:", error);
        }
    };      
  return (
    <div>
      <h2 className="mb-5 mx-auto text-xl font-bold text-center">구독</h2>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <p className="flex justify-end text-slate-500 text-xs">해당 구독 상품은 포인트로만 결제가 가능합니다.</p>
        <p className="flex justify-end text-slate-500 text-xs">매월 1일 {cost}원이 보유 포인트에서 자동 차감됩니다.</p>
        <p className="flex justify-end text-slate-500 text-xs">매월 20~25일 사이 메일이 발송되며,</p>
        <p className="flex justify-end text-slate-500 text-xs">상품 결제 의사가 없을 경우, 구독 수정 페이지에서 결제를 보류 할 수 있습니다.</p>
        <p className="flex justify-end text-slate-500 text-xs">이때, 구독은 해제되지 않습니다.</p>
        <p className="flex justify-end text-slate-500 text-xs">보류 설정 후, 다음 월의 결제를 희망할 경우, 설정을 '구매'로 변환해주세요.</p>
        <p className="flex justify-start text-slate-500 font-bold text-xs">주소지 선택</p>
        <select onChange={(e) => setSelectAddress(e.target.value)}>
          {userAddressArr.map((item) => {
            return <option value={item.address}>{item.address}</option>;
          })}
        </select>
        <button
          type="submit"
          className="w-[80%] mx-auto bg-pink-300 py-1.5 rounded-2xl font-bold text-white hover:bg-pink-500">
          구독 하기
        </button>
      </form>
    </div>
  );
}

export default PostSubscribesModal;
