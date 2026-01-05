import React from "react";

const ProductDetails = ({ name, description, stock, category }) => {
  return (
    <section className="content-wrapper bg-white p-3 rounded-2 mb-4">
      <section className="content-header mb-3">
        <section className="d-flex justify-content-between align-items-center">
          <h2 className="content-header-title content-header-title-small">
           { name }
          </h2>
          <section className="content-header-link">
            <a href="#">مشاهده همه</a>
          </section>
        </section>
      </section>
      <section className="product-info">
        <p>
          <i className="fa fa-shield-alt cart-product-selected-warranty me-1"></i>{" "}
          <span> گارانتی اصالت و سلامت فیزیکی کالا</span>
        </p>
        <p>
          <i className="fa fa-store-alt cart-product-selected-store me-1"></i>{" "}
          <span>فروشنده: فروشگاه اینترنتی شرکت آمازون ایرانیان</span><br /><br />
          موجودی{ stock > 0 ? `: ${stock} عدد` : ": ناموجود" }
        </p>
        <p>
          <span>دسته بندی: {category.name}</span>
        </p>
        <p className="mb-3 mt-5">
          <i className="fa fa-info-circle me-1"></i>
{ description }
        </p>
      </section>
    </section>
  );
};

export default ProductDetails;
