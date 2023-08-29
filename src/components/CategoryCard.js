import React from "react";
import Button from "./ui/Button";

export default function CategoryCard({ category, setCategory, isActive }) {
  return <Button text={category} isActive={isActive} onClick={() => setCategory(category)} />;
}
