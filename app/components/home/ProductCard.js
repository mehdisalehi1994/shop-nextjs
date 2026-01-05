import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { useCart } from '@/app/context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart, error } = useCart();
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState(null);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLocalError(null);

    await addToCart(product._id, 1);

    if (error) setLocalError(error);
    setLoading(false);
  };

  return (
    <div style={{ width: "100%", padding: "0 5px", boxSizing: "border-box" }}>
      <section className="item">
        <section className="lazyload-item-wrapper">
          <section className="product">

            <section className="product-add-to-cart">
              <a
                href="#"
                onClick={handleAddToCart}
                data-bs-toggle="tooltip"
                data-bs-placement="left"
                title={loading ? "در حال افزودن..." : "افزودن به سبد خرید"}
                style={{ pointerEvents: loading ? "none" : "auto" }}
              >
                <i className={`fa fa-cart-plus ${loading ? "text-muted" : ""}`}></i>
              </a>
              {localError && <p className="text-danger mt-2">{localError}</p>}
            </section>

            <section className="product-add-to-favorite">
              <a
                href="#"
                data-bs-toggle="tooltip"
                data-bs-placement="left"
                title="افزودن به علاقه مندی"
              >
                <i className="fa fa-heart"></i>
              </a>
            </section>

            <Link className="product-link" href={`/products/${product._id}`}>
              <section className="product-image">
                <Image
                  src={product.imageUrl?.trim() || "/uploads/default.jpg"}
                  alt={product.name}
                  width={300}
                  height={270}
                  className="img-fluid"
                  unoptimized
                />
              </section>
              <section className="product-colors"></section>
              <section className="product-name">
                <h3 className="text-center">{product.name}</h3>
              </section>
              <section className="product-price-wrapper">
                <section className="product-price">{product.price} تومان</section>
              </section>
            </Link>
          </section>
        </section>
      </section>
    </div>
  );
};

export default ProductCard;
