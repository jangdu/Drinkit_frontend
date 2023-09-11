import Slider from "react-slick";
import React from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function HomeBanner() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
  };

  const options = "top=10, left=10, width=800, height=500, status=no, menubar=no, toolbar=no, resizable=no";

  return (
    <div className="">
      <Slider {...settings}>
        <img alt="" src="https://res.cloudinary.com/devkbqyym/image/upload/v1694435010/drinkit/banner1_hphgq0.png" />
        <img alt="" src="https://res.cloudinary.com/devkbqyym/image/upload/v1694435012/drinkit/banner2_jkgylc.png" />
        <img alt="" src="https://res.cloudinary.com/devkbqyym/image/upload/v1694435026/drinkit/banner4_jvvjdn.png" />
        <img alt="" src="https://res.cloudinary.com/devkbqyym/image/upload/v1694435021/drinkit/banner3_ehelva.png" />
      </Slider>
    </div>
  );
}

//사용할 이미지를 Slider 태그 안에 위치시킴
