import axios from "axios";
import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";

export default function ProductList() {
  const [productList, setProductList] = useState([]);

  useEffect(() => {
    const getProductList = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_SERVERURL}/products`, {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.status === 200) {
          const { data } = response;
          setProductList(data);
        } else {
          const data = response.json();
          setProductList();
          alert(data.message);
        }
      } catch (error) {}
    };
    getProductList();
  }, []);

  if (productList) {
    return productList.map((product) => {
      return (
        <div key={product.id}>
          <ProductCard product={product} />
        </div>
      );
    });
  }
}
