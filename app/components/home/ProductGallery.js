import Image from 'next/image';
import React from 'react';

const ProductGallery = ({images}) => {
    const mainImage = Array.isArray(images) && images.length > 0 ? images[0] : images;
    return (
        <section className="content-wrapper bg-white p-3 rounded-2 mb-4">
                                    <section className="product-gallery">
                                        <section className="product-gallery-selected-image mb-3">
                                            <Image src={mainImage} alt="Main product image" width={300} height={250} />
                                        </section>
                                        <section className="product-gallery-thumbs">
                                            {/* <img className="product-gallery-thumb" src="assets/images/single-product/1.jpg" alt="" data-input="assets/images/single-product/1.jpg"> */}
                                            {/* <img className="product-gallery-thumb" src="assets/images/single-product/2.jpg" alt="" data-input="assets/images/single-product/2.jpg"> */}
                                            {/* <img className="product-gallery-thumb" src="assets/images/single-product/3.jpg" alt="" data-input="assets/images/single-product/3.jpg"> */}
                                            {/* <img className="product-gallery-thumb" src="assets/images/single-product/4.jpg" alt="" data-input="assets/images/single-product/4.jpg"> */}
                                            {/* <img className="product-gallery-thumb" src="assets/images/single-product/5.jpg" alt="" data-input="assets/images/single-product/5.jpg"> */}
                                        </section>
                                    </section>
                                </section>
    );
};

export default ProductGallery;