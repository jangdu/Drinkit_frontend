import React from "react";
import CategoryCard from "./CategoryCard";

export default function Category({ setCategory, category }) {
  const count = ["전체", "전통주"];
  return (
    <div className="flex flex-row my-3 mx-auto overflow-hidden">
      {count.map((item) => {
        return (
          <div className={category === item ? `font-bold` : ""} key={item}>
            <CategoryCard category={item} isActive={category === item} setCategory={setCategory} />
          </div>
        );
      })}
    </div>
  );
}
