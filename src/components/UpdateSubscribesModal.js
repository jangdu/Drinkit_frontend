import React, { useState, useEffect } from "react";
import axios from "axios";

const UpdateSubscribesModal = (user) => {
  const [cost, setCost] = useState();
  const [userAddressArr, setUserAddressArr] = useState([{address: ""}])
  const [isPaid, setIsPaid] = useState(false)
  const [selectAddress, setSelectAddress] = useState("")

  useEffect(() => {
    //구독 상품 가격
    setCost(18900)
    setUserAddressArr(JSON.parse(user.user.address));
    setSelectAddress(JSON.parse(user.user.address)[0].address);
  }, [])

  const setIsPaidFucntion = (t) => {
    if(t === 'true'){
        setIsPaid(true)
    }else{
        setIsPaid(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
        try {
            const updateSubscribe = async() => {
                const response = await axios.put(
                    `${process.env.REACT_APP_API_SERVERURL}/subscribes`,
                    {isPaid, address: selectAddress},
                    {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "application/json",
                    },
                    }
                );
        
                if (response.status === 200) {
                        alert("구독 정보 수정이 완료되었습니다.");
                        window.location.reload();
                    }
            }
            updateSubscribe()
        } catch (error) {
            alert(error);
            console.error("Error occurred during add point:", error);
        }
    };      
  return (
    <div>
      <h2 className="mb-5 mx-auto text-xl font-bold text-center">구독 정보 수정</h2>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <p className="flex justify-end text-slate-500 text-xs">상품 결제 의사가 없을 경우, 결제를 보류 할 수 있습니다.</p>
        <p className="flex justify-end text-slate-500 text-xs">이때, 구독은 해제되지 않습니다.</p>
        <p className="flex justify-end text-slate-500 text-xs">보류 설정 후, 다음 월의 결제를 희망할 경우,</p>
        <p className="flex justify-end text-slate-500 text-xs">설정을 '구매'로 변경해주세요.</p>
        <select onChange={(e) => setIsPaidFucntion(e.target.value)}>
            <option value={false}>보류</option>;
            <option value={true}>구매</option>;
        </select>
        {isPaid ? (<div>
            <p className="flex justify-end text-slate-500 text-xs">배송지를 입력해주세요.</p>
            <select onChange={(e) => setSelectAddress(e.target.value)}>
            {userAddressArr.map((item) => {
                return <option value={item.address}>{item.address}</option>;
            })}
            </select>
        </div>) : (<p className="flex justify-end text-slate-500 text-xs">다음 결제를 보류합니다.</p>)}
            <button
            type="submit"
            className="w-[80%] mx-auto bg-pink-300 py-1.5 rounded-2xl font-bold text-white hover:bg-pink-500">
            선택 완료
            </button>
        </form>
    </div>
  );
}

export default UpdateSubscribesModal;
