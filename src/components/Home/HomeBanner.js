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

  return (
    <div className="">
      <Slider {...settings}>
        <img src="https://res.cloudinary.com/dyhnnmhcf/image/upload/v1693806250/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA_2023-09-04_%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE_2.44.05_xnocax.png" />
        <img src="https://res.cloudinary.com/dyhnnmhcf/image/upload/v1693806250/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA_2023-09-04_%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE_2.44.05_xnocax.png" />
        <img src="https://res.cloudinary.com/dyhnnmhcf/image/upload/v1693806250/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA_2023-09-04_%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE_2.44.05_xnocax.png" />
      </Slider>
    </div>
  );
}

//사용할 이미지를 Slider 태그 안에 위치시킴
