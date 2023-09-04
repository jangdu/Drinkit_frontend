import React, { useEffect, useState } from "react";
import CategoryCard from "./CategoryCard";
import axios from "axios";

export default function Category({ setCategory, category, categories, setCategories }) {
  useEffect(() => {
    const getCategoryList = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_SERVERURL}/category`, {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.status === 200) {
          const { data } = response;
          setCategories([{ name: "전체", id: 0 }, ...data]);
        } else {
          const data = response.json();
          alert(data.message);
        }
      } catch (error) {}
    };

    getCategoryList();
  }, []);
  return (
    <div className="flex flex-row my-3 mx-auto overflow-scroll" style={{ whiteSpace: "nowrap" }}>
      {categories &&
        categories.map((item) => {
          return (
            <div className={category === item ? `font-bold` : ""} key={item.id}>
              <CategoryCard category={item} isActive={category.name === item.name} setCategory={setCategory} />
            </div>
          );
        })}
    </div>
  );
}
