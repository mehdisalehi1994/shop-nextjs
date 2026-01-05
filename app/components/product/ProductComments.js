"use client";
import React, { useEffect, useState } from "react";
import { Button, Alert } from "react-bootstrap";
import { useSession } from "next-auth/react";

const ProductComments = ({ productId }) => {
  const { data: session } = useSession();
  const [comments, setComments] = useState([]);
  const [productName, setProductName] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [showSuccess, setShowSuccess] = useState("");
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [text, setText] = useState("");

  const toJalali = (isoDate) => {
    try {
      if (!isoDate) return "نامشخص";
      const d = new Date(isoDate);
      return new Intl.DateTimeFormat("fa-IR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(d);
    } catch {
      return "نامشخص";
    }
  };

  const fetchComments = async () => {
    setLoading(true);
    setLoadError("");
    try {
      const res = await fetch("/api/comments");
      if (!res.ok) throw new Error("خطا در دریافت نظرات از سرور");
      const data = await res.json();

      const filtered = Array.isArray(data)
        ? data.filter(
            (c) =>
              c.productId &&
              c.productId._id === productId &&
              c.isApproved
          )
        : [];
      setComments(filtered);

      // نام محصول را هم بگیریم
      const resP = await fetch(`/api/products/${productId}`);
      if (resP.ok) {
        const p = await resP.json();
        setProductName(p.name || "");
      }
    } catch (err) {
      console.error(err);
      setLoadError("خطایی در بارگذاری دیدگاه‌ها رخ داد.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (productId) fetchComments();
  }, [productId]);

  const handleOpenAddModal = async () => {
    setFormError("");
    setShowSuccess("");

    if (!session?.user) {
      setFormError("لطفا به سایت وارد شوید تا بتوانید دیدگاه ثبت کنید.");
      return;
    }

    try {
      // اطلاعات کاربر
      const resUser = await fetch(`/api/users/${session.user.id}`);
      if (resUser.ok) {
        const u = await resUser.json();
        setName(u.name || session.user.name || "");
        setPhone(u.phone || session.user.phone || "");
      } else {
        setName(session.user.name || "");
        setPhone(session.user.phone || "");
      }

      const modalEl = document.getElementById("add-comment");
      if (modalEl) {
        if (typeof window !== "undefined" && window.bootstrap && window.bootstrap.Modal) {
          const modal = new window.bootstrap.Modal(modalEl);
          modal.show();
        } else {
          modalEl.classList.add("show");
          modalEl.style.display = "block";
          modalEl.removeAttribute("aria-hidden");
        }
      }
    } catch (err) {
      console.error("Open modal error:", err);
      setFormError("خطا در بارگذاری اطلاعات. لطفا مجدداً تلاش کنید.");
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    setFormError("");
    setShowSuccess("");

    if (!session?.user) {
      setFormError("لطفا به سایت وارد شوید تا بتوانید دیدگاه ثبت کنید.");
      return;
    }

    if (!text || text.trim().length < 3) {
      setFormError("متن دیدگاه باید حداقل 3 کاراکتر باشد.");
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        productId,
        userId: session.user.id,
        text: text.trim(),
      };

      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "خطا در ثبت دیدگاه");

      setText("");
      setShowSuccess(
        "دیدگاه شما با موفقیت ارسال گردید و بعد از تایید ادمین نمایش داده خواهد شد."
      );

      // بعد از ثبت، مجدداً کامنت‌ها را fetch کنیم
      fetchComments();

      // بستن مودال
      const modalEl = document.getElementById("add-comment");
      if (modalEl) {
        if (typeof window !== "undefined" && window.bootstrap && window.bootstrap.Modal) {
          const instance = window.bootstrap.Modal.getInstance(modalEl);
          if (instance) instance.hide();
        } else {
          modalEl.classList.remove("show");
          modalEl.style.display = "none";
          modalEl.setAttribute("aria-hidden", "true");
        }
      }
    } catch (err) {
      console.error("submit comment", err);
      setFormError(err.message || "خطا در ارسال دیدگاه");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section>
      <section id="comments" className="content-header mt-2 mb-4">
        <section className="d-flex justify-content-between align-items-center">
          <h2 className="content-header-title content-header-title-small">دیدگاه ها</h2>
        </section>
      </section>

      <section className="product-comments mb-4">
        <section className="comment-add-wrapper mb-3">
          <button
            className="comment-add-button btn btn-sm btn-outline-primary"
            type="button"
            onClick={handleOpenAddModal}
          >
            <i className="fa fa-plus" /> افزودن دیدگاه
          </button>
          {formError && <div className="mt-2 text-danger">{formError}</div>}
          {showSuccess && <div className="mt-2 text-success">{showSuccess}</div>}
        </section>

        {/* مودال */}
        <section className="modal fade" id="add-comment" tabIndex="-1" aria-hidden="true">
          <section className="modal-dialog">
            <section className="modal-content">
              <section className="modal-header">
                <h5 className="modal-title">
                  <i className="fa fa-plus" /> افزودن دیدگاه
                </h5>
                {/* دکمه بستن اصلاح شده */}
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    const modalEl = document.getElementById("add-comment");
                    if (modalEl) {
                      if (typeof window !== "undefined" && window.bootstrap && window.bootstrap.Modal) {
                        const instance = window.bootstrap.Modal.getInstance(modalEl);
                        if (instance) instance.hide();
                      } else {
                        modalEl.classList.remove("show");
                        modalEl.style.display = "none";
                        modalEl.setAttribute("aria-hidden", "true");
                      }
                    }
                    setText("");
                    setFormError("");
                    setShowSuccess("");
                  }}
                  aria-label="Close"
                />
              </section>

              <section className="modal-body">
                {formError && <Alert variant="danger">{formError}</Alert>}
                {showSuccess && <Alert variant="success">{showSuccess}</Alert>}

                <form className="row" onSubmit={handleSubmitComment}>
                  <section className="col-12 mb-2">
                    <label className="form-label mb-1">نام</label>
                    <input type="text" className="form-control form-control-sm" value={name} readOnly />
                  </section>
                  <section className="col-12 mb-2">
                    <label className="form-label mb-1">شماره موبایل</label>
                    <input type="text" className="form-control form-control-sm" value={phone} readOnly />
                  </section>
                  <section className="col-12 mb-2">
                    <label className="form-label mb-1">نام محصول</label>
                    <input type="text" className="form-control form-control-sm" value={productName} readOnly />
                  </section>
                  <section className="col-12 mb-2">
                    <label className="form-label mb-1">دیدگاه شما</label>
                    <textarea
                      className="form-control form-control-sm"
                      rows="4"
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      disabled={submitting || Boolean(showSuccess)}
                    />
                  </section>

                  <section className="modal-footer py-1">
                    <button type="submit" className="btn btn-sm btn-primary" disabled={submitting || Boolean(showSuccess)}>
                      {submitting ? "در حال ارسال ..." : "ثبت دیدگاه"}
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-danger"
                      onClick={() => {
                        const modalEl = document.getElementById("add-comment");
                        if (modalEl) {
                          if (typeof window !== "undefined" && window.bootstrap && window.bootstrap.Modal) {
                            const instance = window.bootstrap.Modal.getInstance(modalEl);
                            if (instance) instance.hide();
                          } else {
                            modalEl.classList.remove("show");
                            modalEl.style.display = "none";
                            modalEl.setAttribute("aria-hidden", "true");
                          }
                        }
                        setText("");
                        setFormError("");
                        setShowSuccess("");
                      }}
                    >
                      بستن
                    </button>
                  </section>
                </form>
              </section>
            </section>
          </section>
        </section>

        {loading ? (
          <p>در حال بارگذاری...</p>
        ) : loadError ? (
          <p className="text-danger">{loadError}</p>
        ) : comments.length === 0 ? (
          <div className="alert alert-secondary">دیدگاهی برای این محصول ثبت نشده است</div>
        ) : (
          comments.map((comment) => (
            <section className="product-comment mb-3" key={comment._id}>
              <section className="product-comment-header d-flex justify-content-start">
                <section className="product-comment-date">{toJalali(comment.createdAt)}</section>
                <section className="product-comment-title ms-3">{comment.userId?.name || "کاربر حذف شده"}</section>
              </section>
              <section className="product-comment-body mt-2">{comment.text}</section>
            </section>
          ))
        )}
      </section>
    </section>
  );
};

export default ProductComments;
