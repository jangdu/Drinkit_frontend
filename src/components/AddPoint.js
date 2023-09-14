import React, { useState, useEffect } from "react";
import _debounce from "lodash/debounce";
import axios from "axios";

const IMP = window.IMP;

const AddPoint = (user) => {
  const [cost, setCost] = useState();
  const [isButton, setIsButton] = useState(false);
  useEffect(() => {
    if (cost > 1000000) {
      setCost(1000000);
    }

    const debouncedSendRequest = _debounce(() => {
      const newCost = cost - (cost % 1000);
      if (newCost >= 1000) {
        setCost(newCost);
      }
      setIsButton(true);
    }, 300);

    debouncedSendRequest();

    return () => {
      debouncedSendRequest.cancel();
    };
  }, [cost]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isButton) {
      return;
    }

    if (cost < 1000) {
      alert("최소 충전금액은 1,000원 입니다.");
      setCost(1000);
      return;
    }
    try {
      IMP.init("imp26455227");

      const uuid = ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
        (
          c ^
          (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
        ).toString(16)
      );
      const buyer_addr = JSON.parse(user.user.address)[0].address;
      IMP.request_pay(
        {
          pg: "kakaopay.TC0ONETIME",
          pay_method: "card",
          merchant_uid: uuid,
          name: `${cost}포인트`,
          amount: cost,
          buyer_email: user.user.email,
          buyer_name: user.user.name,
          buyer_tel: user.user.phoneNumber,
          buyer_addr,
          buyer_postcode: "123-456",
        },
        async function (rsp) {
          if (rsp.success) {
            const response = await axios.put(
              `${process.env.REACT_APP_API_SERVERURL}/orders/addPoint`,
              { point: cost, impUid: rsp.imp_uid, address: buyer_addr },
              {
                withCredentials: true,
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );

            if (response.status === 200) {
              alert("충전이 완료되었습니다.");
              window.location.reload();
            } else {
              const data = await response.json();
            }
          }
        }
      );
    } catch (error) {
      alert(error);
      console.error("Error occurred during add point:", error);
    }
  };

  return (
    <div>
      <h2 className="mx-auto mb-5 text-xl font-bold text-center">
        포인트 충전
      </h2>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <p className="flex justify-end text-xs text-slate-400">
          1회 충전 한도는 1,000,000원 입니다.
        </p>
        <p className="flex justify-end text-xs text-slate-400">
          구독을 제외한 배송, 픽업 결제 시
        </p>
        <p className="flex justify-end text-xs text-slate-400">
          포인트는 총 결제 금액의 50% 까지만 사용 가능합니다.
        </p>
        <input
          id="cost"
          type="number"
          placeholder="충전 금액"
          value={cost}
          onChange={(e) => {
            setCost(e.target.value);
            setIsButton(false);
          }}
        />
        <button
          type="submit"
          className="w-[80%] mx-auto bg-pink-300 py-1.5 rounded-2xl font-bold text-white hover:bg-pink-500"
        >
          충전 하기
        </button>
      </form>
    </div>
  );
};

export default AddPoint;
