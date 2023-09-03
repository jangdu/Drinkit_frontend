import React from "react";
import Button from "./ui/Button";

export default function CategoryCard({ category, setCategory, isActive }) {
  return <Button text={category.name} isActive={isActive} onClick={() => setCategory(category)} />;
}
