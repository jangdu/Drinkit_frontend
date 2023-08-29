import React, { useState } from "react";
import Category from "../components/Category";
import ProductList from "../components/ProductList";

export default function Products() {
  const [category, setCategory] = useState("전체");

  console.log(category);
  return (
    <div className="container mx-auto p-4">
      <div className="w-72 mx-auto">
        <Category setCategory={setCategory} category={category} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mx-auto">
        <ProductList />
      </div>
    </div>
  );
}
