import axios from "axios";
import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import Loading from "./Loding";

export default function ProductList({ category }) {
  const [productList, setProductList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const getProductList = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_SERVERURL}/products?categoryId=${category.id}&page=${page}`, {
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
        setLoading(false);
      } catch (error) {}
    };
    getProductList();
  }, [category]);

  if (productList) {
    return (
      <div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mx-auto">
          {productList.map((product) => {
            return (
              <div key={product.id}>
                <ProductCard product={product} />
              </div>
            );
          })}
        </div>
        {loading && <Loading />}
      </div>
    );
  }
}
