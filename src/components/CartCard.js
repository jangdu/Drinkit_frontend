import React from "react";
import { RiCloseFill } from "react-icons/ri";
import { TiMinus, TiPlus } from "react-icons/ti";

export default function CartCard({ product, removeFromCart, increaseCount, decreaseCount }) {
  return (
    <div>
      <div className="py-8 mx-auto flex justify-between items-center bg-white ">
        <div className="flex flex-row">
          <div className="flex flex-col gap-6">
            <p className="text-lg text-black font-semibold">{product.productName}</p>
            <p className="text-slate-500 font-medium">{Number(product.price).toLocaleString()}원</p>
          </div>
        </div>
        <div className="items-center text-center">
          <RiCloseFill onClick={() => removeFromCart(product.productId)} className="text-3xl ms-11 cursor-pointer hover:text-red-500 " />
          <div className="flex flex-row items-center mt-4 gap-3 text-xl">
            <TiMinus onClick={() => decreaseCount(product.productId)} className="cursor-pointer hover:text-red-500" />
            <p className="">{product.count}</p>
            <TiPlus onClick={() => increaseCount(product.productId)} className="cursor-pointer hover:text-red-500" />
          </div>
        </div>
      </div>
      <div className="w-[80%] mx-auto border-b-2"></div>
    </div>
  );
}
