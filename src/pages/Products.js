import React, { useState } from "react";
import Category from "../components/Category";
import ProductList from "../components/ProductList";

export default function Products() {
  const [category, setCategory] = useState({ name: "전체", id: 0 });
  const [categories, setCategories] = useState([]);

  return (
    <div className="container mx-auto p-4">
      <div className="w-72 mx-auto">
        <Category categories={categories} setCategories={setCategories} setCategory={setCategory} category={category} />
      </div>
      <div>
        <ProductList categories={categories} setCategories={setCategories} category={category} />
      </div>
    </div>
  );
}
