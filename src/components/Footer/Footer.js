import React from "react";
import { BsGithub } from "react-icons/bs";
import { SiBloglovin } from "react-icons/si";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-pink-300 py-4 flex flex-col px-8 sm:px-24 text-white">
      <div className="flex flex-row justify-between">
        <div className="container mx-auto flex flex-col">
          <p className="titleFont text-4xl my-2">Drink!t</p>
          <div className="flex text-lg titleFont flex-row items-center gap-2">
            <p className="w-20">backend</p>
            <Link to="https://github.com/Drinkit-project/Develop-Drinkit" className="flex flex-row items-center gap-1 hover:text-pink-500">
              <BsGithub /> GitHub
            </Link>
          </div>
          <div className="flex text-lg titleFont flex-row items-center gap-2">
            <p className="w-20">webRTC</p>
            <Link to="https://github.com/Drinkit-project/Drinkit-webRTC" className="flex flex-row items-center gap-1 hover:text-pink-500">
              <BsGithub /> GitHub
            </Link>
          </div>
          <div className="flex text-lg titleFont flex-row items-center gap-2">
            <p className="w-20">openAI</p>
            <Link to="https://github.com/Drinkit-project/Drinkit-openAi" className="flex flex-row items-center gap-1 hover:text-pink-500">
              <BsGithub /> GitHub
            </Link>
          </div>
          <div className="flex text-lg titleFont flex-row items-center gap-2">
            <p className="w-20">frontend</p>
            <Link to="https://github.com/Drinkit-project/Drinkit_frontend" className="flex flex-row items-center gap-1 hover:text-pink-500">
              <BsGithub /> GitHub
            </Link>
          </div>
        </div>
        {/* <div className="container mx-auto ">
        <p className="">© 2023 Your Company. All rights reserved.</p>
      </div> */}
        <div className="container titleFont text-slate-500  w-fit text-lg my-8 flex text-center flex-col gap-2 ">
          <div className="flex flex-row items-center gap-2">
            <p className="w-20 text-slate-500">장두혁</p>
            <Link to={"https://github.com/jangdu"} className="flex flex-row items-center gap-1 hover:text-pink-500">
              <BsGithub /> GitHub
            </Link>
            <Link to={"https://velog.io/@jangdu"} className="flex flex-row items-center gap-1 hover:text-pink-500">
              Blog
            </Link>
          </div>
          <div className="flex flex-row items-center gap-2">
            <p className="w-20 text-slate-500">정영훈</p>
            <Link to={"https://github.com/yhjs1211"} className="flex flex-row items-center gap-1 hover:text-pink-500">
              <BsGithub /> GitHub
            </Link>
            <Link to={""} className="flex flex-row items-center gap-1 hover:text-pink-500">
              Blog
            </Link>
          </div>
          <div className="flex flex-row items-center gap-2">
            <p className="w-20 text-slate-500">남현진</p>
            <Link to={"https://github.com/hyun20230508"} className="flex flex-row items-center gap-1 hover:text-pink-500">
              <BsGithub /> GitHub
            </Link>
            <Link to={""} className="flex flex-row items-center gap-1 hover:text-pink-500">
              Blog
            </Link>
          </div>
          <div className="flex flex-row items-center gap-2">
            <p className="w-20 text-slate-500">오태환</p>
            <Link to={"https://github.com/othwan410"} className="flex flex-row items-center gap-1 hover:text-pink-500">
              <BsGithub /> GitHub
            </Link>
            <Link to={""} className="flex flex-row items-center gap-1 hover:text-pink-500">
              Blog
            </Link>
          </div>
        </div>
      </div>
      <p className="titleFont sm:hidden text-4xl text-center my-2">Drink!t</p>
    </footer>
  );
}

export default Footer;
