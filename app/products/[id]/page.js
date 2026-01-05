import AddToCartButton from "@/app/components/home/AddToCartButton";
import DiscountApply from "@/app/components/home/DiscountApply";
import ProductDetails from "@/app/components/home/ProductDetails";
import ProductGallery from "@/app/components/home/ProductGallery";
import RelatedProducts from "@/app/components/home/RelatedProducts";
import ProductComments from "@/app/components/product/ProductComments";  // ⬅️ اضافه شد
import React from "react";

async function getProductData(id) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/products/home/${id}`,
    {
      next: { revalidate: 60 },
      cache: "force-cache",
    }
  );

  if (!res.ok) {
    throw new Error("خطا در دریافت اطلاعات محصول");
  }

  return res.json();
}

const SingleProduct = async ({ params }) => {
  const { id } = await params;
  const product = await getProductData(id);

  return (
    <main id="main-body-one-col" className="main-body">
      <section className="container-xxl">
        <section className="row">
          <section className="col-md-4">
            <ProductGallery images={product.imageUrl} />
          </section>

          <section className="col-md-5">
            <ProductDetails
              name={product.name}
              description={product.description}
              stock={product.stock}
              category={product.category}
            />
          </section>

          <section className="col-md-3">
            <section className="content-wrapper bg-white p-3 rounded-2 cart-total-price">
              <section className="d-flex justify-content-between align-items-center">
                <p className="text-muted">قیمت کالا</p>
                <p className="text-muted">
                  {product.price.toLocaleString()}{" "}
                  <span className="small">تومان</span>
                </p>
              </section>

              <br />
              <section className="border-bottom mb-3"></section>

              <section className="d-flex justify-content-end align-items-center">
                <p className="fw-bolder">
                  {product.price.toLocaleString()}{" "}
                  <span className="small">تومان</span>
                </p>
              </section>

              <AddToCartButton productId={product._id} />
            </section>
          </section>
        </section>

        {/* کالاهای مرتبط */}
        <RelatedProducts categoryId={product.category._id} />

        {/* بخش ثبت و نمایش دیدگاه‌ها */}
        <ProductComments productId={product._id} />  {/* ⬅️ فقط همین اضافه شد */}

      </section>
    </main>
  );
};

export default SingleProduct;
