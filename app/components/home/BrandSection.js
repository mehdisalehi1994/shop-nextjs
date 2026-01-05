import Image from 'next/image';
import React from 'react';

const BrandSection = () => {

    const brands = [
        {id : 1, src: '/images/brand/huawei.jpg', alt: 'Huawei'},
        {id : 2, src: '/images/brand/adata.png', alt: 'ADATA'},
        {id : 3, src: '/images/brand/nokia.jpg', alt: 'Nokia'},
    ];

    return (
        <section className="brand-part mb-4 py-4">
            <section className="container-xxl">
                <section className="row">
                    <section className="col">
                       
                        <section className="content-header">
                            <section className="d-flex align-items-center">
                                <h2 className="content-header-title">
                                    <span>برندهای ویژه</span>
                                </h2>
                            </section>
                        </section>
                      
                        <section className="brands-wrapper py-4">
                            <section className="brands dark-owl-nav owl-carousel owl-theme">
                                {brands.map(brand => (
                                    <section className="item" key={brand.id}>
                                        <section className="brand-item">
                                            <a href="#">
                                                <Image 
                                                    src={brand.src} 
                                                    alt={brand.alt} 
                                                    width={150} 
                                                    height={100} 
                                                    className="rounded-2" 
                                                />
                                            </a>
                                        </section>
                                    </section>
                                ))}
                            </section>
                        </section>

                    </section>
                </section>
            </section>
        </section>
    );
};

export default BrandSection;
