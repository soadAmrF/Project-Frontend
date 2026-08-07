import { useState, useEffect, useCallback } from "react";
import { getClinicInfo, updateClinicInfo } from "../../services/api";
import "./ClinicInfo.css";

const initialForm = {
  name: "",
  nameAr: "",
  logo: "",
  slogan: "",
  phone: "",
  phone2: "",
  email: "",
  website: "",
  whatsapp: "",
  address: "",
  city: "",
  country: "مصر",
  invoicePrefix: "INV",
  invoiceNote: "",
  thankYouMessage: "شكراً لثقتكم بنا، نتمنى لكم الشفاء العاجل",
  taxRate: "0",
  taxNumber: "",
  commercialRegister: "",
  bankName: "",
  bankAccount: "",
  bankIban: "",
  workingHours: "",
  facebook: "",
  instagram: "",
  currency: "ج.م",
};

function normalizeForm(data = {}) {
  const next = { ...initialForm };

  Object.keys(initialForm).forEach((key) => {
    if (data[key] !== undefined && data[key] !== null) {
      next[key] = data[key];
    }
  });

  next.taxRate =
    data.taxRate === undefined || data.taxRate === null || data.taxRate === ""
      ? "0"
      : String(data.taxRate);

  return next;
}

export default function ClinicInfo() {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [logoError, setLogoError] = useState(false);

  const loadClinicInfo = useCallback(
    async ({ showLoading = true, silent = false } = {}) => {
      if (showLoading) {
        setLoading(true);
      }

      if (!silent) {
        setError("");
      }

      try {
        const res = await getClinicInfo();
        const data = res?.data?.data || res?.data || {};

        setForm(normalizeForm(data));
      } catch (err) {
        console.error("Failed to load clinic info:", err);

        if (!silent) {
          setError("تعذر تحميل بيانات العيادة. حاول مرة أخرى لاحقًا.");
        }
      } finally {
        if (showLoading) {
          setLoading(false);
        }
      }
    },
    [],
  );

  useEffect(() => {
    loadClinicInfo();
  }, [loadClinicInfo]);

  useEffect(() => {
    setLogoError(false);
  }, [form.logo]);

  useEffect(() => {
    if (!error && !success) return;

    const timeout = setTimeout(() => {
      setError("");
      setSuccess("");
    }, 5000);

    return () => clearTimeout(timeout);
  }, [error, success]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (!(name in initialForm)) return;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setSaving(true);

    try {
      const payload = Object.keys(initialForm).reduce((acc, key) => {
        acc[key] = form[key] ?? "";
        return acc;
      }, {});

      payload.taxRate = Math.min(100, Math.max(0, Number(form.taxRate || 0)));

      await updateClinicInfo(payload);

      setSuccess("تم حفظ بيانات العيادة بنجاح");

      await loadClinicInfo({ showLoading: false, silent: true });
    } catch (err) {
      setError(err.response?.data?.message || "فشل في حفظ البيانات");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container-fluid py-4 clinic-info-page" dir="rtl">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">
        <h2 className="mb-0">بيانات العيادة</h2>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {success && (
        <div className="alert alert-success" role="alert">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="row g-4">
          {/* البيانات الأساسية */}
          <div className="col-md-6">
            <div className="card h-100">
              <div className="card-header bg-primary text-white">
                <h5 className="mb-0">
                  <i className="bi bi-building me-2"></i>
                  البيانات الأساسية
                </h5>
              </div>

              <div className="card-body">
                <div className="mb-3">
                  <label className="form-label">اسم العيادة (إنجليزي) *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={form.name || ""}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">اسم العيادة (عربي)</label>
                  <input
                    type="text"
                    className="form-control"
                    name="nameAr"
                    value={form.nameAr || ""}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">الشعار (رابط الصورة)</label>
                  <input
                    type="text"
                    className="form-control"
                    name="logo"
                    value={form.logo || ""}
                    onChange={handleChange}
                    placeholder="https://example.com/logo.png"
                  />

                  {form.logo && !logoError && (
                    <img
                      src={form.logo}
                      alt="Logo"
                      className="mt-2"
                      style={{ maxHeight: "60px" }}
                      onError={() => setLogoError(true)}
                    />
                  )}

                  {form.logo && logoError && (
                    <div className="text-danger small mt-2">
                      تعذر تحميل صورة الشعار. تأكد من الرابط.
                    </div>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label">الشعار النصي (Slogan)</label>
                  <input
                    type="text"
                    className="form-control"
                    name="slogan"
                    value={form.slogan || ""}
                    onChange={handleChange}
                    placeholder="ابتسامتك هي أولويتنا"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* بيانات التواصل */}
          <div className="col-md-6">
            <div className="card h-100">
              <div className="card-header bg-success text-white">
                <h5 className="mb-0">
                  <i className="bi bi-telephone me-2"></i>
                  بيانات التواصل
                </h5>
              </div>

              <div className="card-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">رقم الهاتف *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="phone"
                      value={form.phone || ""}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">رقم هاتف 2</label>
                    <input
                      type="text"
                      className="form-control"
                      name="phone2"
                      value={form.phone2 || ""}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">البريد الإلكتروني</label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={form.email || ""}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">واتساب</label>
                    <input
                      type="text"
                      className="form-control"
                      name="whatsapp"
                      value={form.whatsapp || ""}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">الموقع الإلكتروني</label>
                    <input
                      type="text"
                      className="form-control"
                      name="website"
                      value={form.website || ""}
                      onChange={handleChange}
                      placeholder="https://www.example.com"
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">فيسبوك</label>
                    <input
                      type="text"
                      className="form-control"
                      name="facebook"
                      value={form.facebook || ""}
                      onChange={handleChange}
                      placeholder="https://facebook.com/clinic"
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">انستجرام</label>
                    <input
                      type="text"
                      className="form-control"
                      name="instagram"
                      value={form.instagram || ""}
                      onChange={handleChange}
                      placeholder="https://instagram.com/clinic"
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label">العنوان</label>
                    <textarea
                      className="form-control"
                      name="address"
                      rows="2"
                      value={form.address || ""}
                      onChange={handleChange}
                    ></textarea>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">المدينة</label>
                    <input
                      type="text"
                      className="form-control"
                      name="city"
                      value={form.city || ""}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">الدولة</label>
                    <input
                      type="text"
                      className="form-control"
                      name="country"
                      value={form.country || ""}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label">ساعات العمل</label>
                    <textarea
                      className="form-control"
                      name="workingHours"
                      rows="2"
                      value={form.workingHours || ""}
                      onChange={handleChange}
                      placeholder="السبت - الخميس: 9 صباحاً - 10 مساءً"
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* بيانات الفواتير */}
          <div className="col-md-6">
            <div className="card h-100">
              <div className="card-header bg-warning text-dark">
                <h5 className="mb-0">
                  <i className="bi bi-receipt me-2"></i>
                  بيانات الفواتير
                </h5>
              </div>

              <div className="card-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">بادئة الفاتورة</label>
                    <input
                      type="text"
                      className="form-control"
                      name="invoicePrefix"
                      value={form.invoicePrefix || ""}
                      onChange={handleChange}
                      placeholder="INV"
                    />
                    <small className="text-muted">مثال: INV-2026-001</small>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">نسبة الضريبة (%)</label>
                    <input
                      type="number"
                      className="form-control"
                      name="taxRate"
                      value={form.taxRate || ""}
                      onChange={handleChange}
                      min="0"
                      max="100"
                      step="0.01"
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">العملة</label>
                    <input
                      type="text"
                      className="form-control"
                      name="currency"
                      value={form.currency || ""}
                      onChange={handleChange}
                      placeholder="ج.م"
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">الرقم الضريبي</label>
                    <input
                      type="text"
                      className="form-control"
                      name="taxNumber"
                      value={form.taxNumber || ""}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">السجل التجاري</label>
                    <input
                      type="text"
                      className="form-control"
                      name="commercialRegister"
                      value={form.commercialRegister || ""}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label">ملاحظة الفاتورة</label>
                    <textarea
                      className="form-control"
                      name="invoiceNote"
                      rows="2"
                      value={form.invoiceNote || ""}
                      onChange={handleChange}
                      placeholder="تظهر هذه الملاحظة أسفل الفاتورة"
                    ></textarea>
                  </div>

                  <div className="col-12">
                    <label className="form-label">رسالة الشكر</label>
                    <textarea
                      className="form-control"
                      name="thankYouMessage"
                      rows="2"
                      value={form.thankYouMessage || ""}
                      onChange={handleChange}
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* بيانات البنك */}
          <div className="col-md-6">
            <div className="card h-100">
              <div className="card-header bg-info text-white">
                <h5 className="mb-0">
                  <i className="bi bi-bank me-2"></i>
                  بيانات البنك (اختياري)
                </h5>
              </div>

              <div className="card-body">
                <div className="mb-3">
                  <label className="form-label">اسم البنك</label>
                  <input
                    type="text"
                    className="form-control"
                    name="bankName"
                    value={form.bankName || ""}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">رقم الحساب</label>
                  <input
                    type="text"
                    className="form-control"
                    name="bankAccount"
                    value={form.bankAccount || ""}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">IBAN</label>
                  <input
                    type="text"
                    className="form-control"
                    name="bankIban"
                    value={form.bankIban || ""}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 d-flex justify-content-end">
          <button
            type="submit"
            className="btn btn-primary btn-lg"
            disabled={loading || saving}
          >
            {saving
              ? "جاري الحفظ..."
              : loading
                ? "جاري التحميل..."
                : "حفظ البيانات"}
          </button>
        </div>
      </form>
    </div>
  );
}
