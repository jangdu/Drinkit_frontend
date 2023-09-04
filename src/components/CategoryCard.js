import React from "react";
import Button from "./ui/Button";

export default function CategoryCard({ category, setCategory, isActive }) {
  return (
    <div className="">
      <Button text={category.name} isActive={isActive} onClick={() => setCategory(category)} />
    </div>
  );
}
