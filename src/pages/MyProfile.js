import React, { useEffect, useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import Modal from "react-modal";
import Signup from "../components/Signup";
import Button from "../components/ui/Button";
import Loading from "../components/Loding";
import AddPoint from "../components/AddPoint";
import axios from "axios";

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
    "padding-left": "2rem",
    "padding-right": "2rem",
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

export default function MyProfile() {
  const { user, isLoading } = useAuthContext();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isPoint, setIsPoint] = useState(false);
  const [myStore, setMyStore] = useState();

  useEffect(() => {
    const getMyStore = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_SERVERURL}/stores/user/mystore`, {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        });
        console.log(response);
        if (response.status === 200) {
          const { data } = response;
          setMyStore(data[0]);
        } else {
          if (response.status === 404) {
            setMyStore();
            const data = response.json();
          }
        }
      } catch (error) {}
    };

    if (user.isPersonal) {
      getMyStore();
    }
  }, []);

  if (isLoading) {
    return <Loading></Loading>;
  }
  if (!user) {
    return <></>;
  } else {
    return (
      <div className="flex flex-col gap-5 max-w-lg p-2 mx-auto py-6">
        <div className="rounded-xl border-slate-200 my-6 bg-white text-slate-500 p-4 shadow-xl border flex flex-col gap-4">
          <div className="my-2 text-center w-fit mx-auto content-center p-2 flex flex-row text-xl font-semibold">
            <p className="text-pink-500">{user.nickname}</p>
            <p className="font-bold"> {"님의 회원정보"}</p>
          </div>
          <div className="flex justify-end text-black">
            {user && (
              <div>
                <Link to={`/orderlist`} className="font-bold w-20 hover:text-pink-300">
                  나의 주문내역
                </Link>
              </div>
            )}
            {user && user.isAdmin && (
              <div>
                <Link to={`/orderlistbyadmin`} className="font-bold ms-4 w-20 hover:text-pink-300">
                  관리자 주문내역
                </Link>
              </div>
            )}
          </div>
          <div className="flex flex-row items-center text-lg justify-between">
            <div className="flex flex-row">
              <p className="font-bold w-20">이름</p> <span className="ms-10 text-black">{user.name}</span>
            </div>
          </div>
          <div className="border-b-2 border-slate-100 w-[80%] mx-auto"></div>
          <div className="flex flex-row  items-center text-lg justify-between">
            <div className="flex flex-row justify-between">
              <p className="font-bold w-20">닉네임</p> <span className="ms-10 text-black">{user.nickname}</span>
            </div>
          </div>
          <div className="border-b-2 border-slate-100 w-[80%] mx-auto"></div>

          <div className="flex flex-row  items-center text-lg justify-between">
            <div className="flex flex-row justify-between">
              <p className="font-bold w-20">이메일</p> <span className="ms-10 text-black">{user.email}</span>
            </div>
          </div>
          <div className="border-b-2 border-slate-100 w-[80%] mx-auto"></div>

          <div className="flex flex-row  items-center text-lg justify-between">
            <div className="flex flex-row justify-between">
              <p className="font-bold w-20">전화번호</p> <span className="ms-10 text-black">{user.phoneNumber}</span>
            </div>
          </div>
          <div className="border-b-2 border-slate-100 w-[80%] mx-auto"></div>

          <div className="flex flex-row  items-center text-lg justify-between">
            <div className="flex flex-row justify-between">
              <p className="font-bold w-20">포인트</p>{" "}
              <div className="ms-10 text-black flex flex-row gap-4">
                <span>{user.point}P</span>
                <button
                  className=" text-black-300 font-bold hover:text-pink-500"
                  onClick={() => {
                    setModalIsOpen(true);
                    setIsPoint(true);
                  }}>
                  포인트 충전
                </button>
              </div>
            </div>
          </div>
          <div className="border-b-2 border-slate-100 w-[80%] mx-auto"></div>

          <div className="flex flex-row  items-center text-lg justify-between">
            <div className="flex flex-row justify-between">
              <p className="font-bold w-20">주소</p>{" "}
              <div className="ms-10 text-black">
                {user.address && (
                  <div>
                    {JSON.parse(user.address).map((item) => {
                      return (
                        <div key={item.name}>
                          <p>{item.name}</p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
            <Button
              text={"변경"}
              onClick={() => {
                setModalIsOpen(true);
                setIsPoint(false);
              }}></Button>
          </div>
        </div>
        {user.isPersonal && myStore && (
          <div className="rounded-xl border-slate-200 mb-8 bg-white text-slate-500 p-4 shadow-xl border flex flex-col gap-4">
            <h1 className="text-center my-3 text-xl font-bold">
              <span className="text-xl font-bold text-pink-500">{`${myStore.name}`}</span>
              {`님의 가게 정보`}
            </h1>
            <div className="flex justify-end text-black">
              <Link to={`/orderlistbystore/${myStore.id}`} className="font-bold w-fit flex justify-end hover:text-pink-300">
                <Button text="나의 가게 주문내역" />
              </Link>
            </div>
            <div className="flex flex-row  items-center text-lg justify-between">
              <div className="flex flex-row justify-between">
                <p className="font-bold w-20">상호명</p> <span className="ms-10 text-black">{myStore.name}</span>
              </div>
            </div>
            <div className="border-b-2 border-slate-100 w-[80%] mx-auto"></div>
            <div className="flex flex-row  items-center text-lg justify-between">
              <div className="flex flex-row justify-between">
                <p className="font-bold w-20">가게 설명</p> <span className="ms-10 text-black">{myStore.description}</span>
              </div>
            </div>
            <div className="border-b-2 border-slate-100 w-[80%] mx-auto"></div>
            <div className="flex flex-row  items-center text-lg justify-between">
              <div className="flex flex-row justify-between">
                <p className="font-bold w-20">주소</p> <span className="ms-10 text-black">{myStore.address}</span>
              </div>
            </div>
            <div className="border-b-2 border-slate-100 w-[80%] mx-auto"></div>
            <div className="flex flex-row  items-center text-lg justify-between">
              <div className="flex flex-row justify-between">
                <p className="font-bold w-20">사업자번호</p> <span className="ms-10 text-black">{myStore.businessLicense}</span>
              </div>
            </div>
          </div>
        )}
        {user.isPersonal && !myStore && (
          <div>
            <Link to={"/store"}>
              <Button text="나의 가게 등록하기" />
            </Link>
          </div>
        )}

        <Modal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)} style={customStyles}>
          <style>{slideUpAnimation}</style>
          <div className=""> {isPoint ? <AddPoint user={user} /> : <Signup isUpdateProfile={true} />}</div>
        </Modal>
      </div>
    );
  }
}
