"use client";
import { useCart } from '@/app/context/CartContext';
import React, { useState } from 'react';

const AddToCartButton = ({ productId }) => {

const {addToCart, error} = useCart();
const [loading, setLoading] = useState(false);
const [localError, setLocalError] = useState(null);

const handleAddToCart = async () => {
    setLoading(true);
    setLocalError(null);

    await addToCart(productId, 1);

    if (error) {
        setLocalError(error);
    }
    setLoading(false);
};   


    return (
        <section className="">
                <button onClick={handleAddToCart} disabled={loading} className="btn btn-danger d-block">
                    {loading ? "در حال افزودن..." : "افزودن به سبد خرید"}
                </button>
                {localError && <p className="text-danger mt-2">{localError}</p>}
              </section>
    );
};

export default AddToCartButton;