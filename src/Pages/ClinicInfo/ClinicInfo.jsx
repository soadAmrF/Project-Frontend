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
  country: "Egypt",
  invoicePrefix: "INV",
  invoiceNote: "",
  thankYouMessage: "Thank you for trusting us. We wish you a speedy recovery.",
  taxRate: "0",
  taxNumber: "",
  commercialRegister: "",
  bankName: "",
  bankAccount: "",
  bankIban: "",
  workingHours: "",
  facebook: "",
  instagram: "",
  currency: "EGP",
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
          setError(
            "Unable to load clinic information. Please try again later.",
          );
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

      setSuccess("Clinic information saved successfully.");

      await loadClinicInfo({
        showLoading: false,
        silent: true,
      });
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to save clinic information.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="clinic-info-page">
      {/* PAGE HEADER */}
      <div className="clinic-settings-header">
        <div>
          <div className="clinic-settings-title">
            <div className="clinic-settings-title-icon">
              <i className="bi bi-gear"></i>
            </div>

            <div>
              <h2>Clinic Settings</h2>
              <p>
                Manage your clinic information, contact details, invoices and
                banking information.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ALERTS */}
      {error && (
        <div className="clinic-alert clinic-alert-error" role="alert">
          <i className="bi bi-exclamation-circle"></i>
          <span>{error}</span>

          <button type="button" onClick={() => setError("")}>
            <i className="bi bi-x"></i>
          </button>
        </div>
      )}

      {success && (
        <div className="clinic-alert clinic-alert-success" role="alert">
          <i className="bi bi-check-circle"></i>
          <span>{success}</span>

          <button type="button" onClick={() => setSuccess("")}>
            <i className="bi bi-x"></i>
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="clinic-settings-grid">
          {/* =================================================
              BASIC INFORMATION
          ================================================= */}

          <section className="settings-card">
            <div className="settings-card-header">
              <div className="settings-card-icon primary">
                <i className="bi bi-building"></i>
              </div>

              <div>
                <h3>Basic Information</h3>
                <p>General information about your clinic</p>
              </div>
            </div>

            <div className="settings-card-body">
              <div className="settings-form-grid">
                <div className="settings-field">
                  <label>
                    Clinic Name <span>*</span>
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={form.name || ""}
                    onChange={handleChange}
                    required
                    placeholder="Enter clinic name"
                  />
                </div>

                <div className="settings-field">
                  <label>Clinic Name (Arabic)</label>

                  <input
                    type="text"
                    name="nameAr"
                    value={form.nameAr || ""}
                    onChange={handleChange}
                    placeholder="Enter Arabic name"
                  />
                </div>

                <div className="settings-field full-width">
                  <label>Logo URL</label>

                  <input
                    type="text"
                    name="logo"
                    value={form.logo || ""}
                    onChange={handleChange}
                    placeholder="https://example.com/logo.png"
                  />

                  {form.logo && !logoError && (
                    <div className="logo-preview">
                      <img
                        src={form.logo}
                        alt="Clinic Logo"
                        onError={() => setLogoError(true)}
                      />
                    </div>
                  )}

                  {form.logo && logoError && (
                    <div className="logo-error">
                      <i className="bi bi-image"></i>
                      Unable to load the logo. Please check the URL.
                    </div>
                  )}
                </div>

                <div className="settings-field full-width">
                  <label>Slogan</label>

                  <input
                    type="text"
                    name="slogan"
                    value={form.slogan || ""}
                    onChange={handleChange}
                    placeholder="Your smile is our priority"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* =================================================
              CONTACT INFORMATION
          ================================================= */}

          <section className="settings-card">
            <div className="settings-card-header">
              <div className="settings-card-icon green">
                <i className="bi bi-telephone"></i>
              </div>

              <div>
                <h3>Contact Information</h3>
                <p>How patients can reach your clinic</p>
              </div>
            </div>

            <div className="settings-card-body">
              <div className="settings-form-grid">
                <div className="settings-field">
                  <label>
                    Phone Number <span>*</span>
                  </label>

                  <input
                    type="text"
                    name="phone"
                    value={form.phone || ""}
                    onChange={handleChange}
                    required
                    placeholder="Enter phone number"
                  />
                </div>

                <div className="settings-field">
                  <label>Phone Number 2</label>

                  <input
                    type="text"
                    name="phone2"
                    value={form.phone2 || ""}
                    onChange={handleChange}
                    placeholder="Optional phone number"
                  />
                </div>

                <div className="settings-field">
                  <label>Email Address</label>

                  <input
                    type="email"
                    name="email"
                    value={form.email || ""}
                    onChange={handleChange}
                    placeholder="clinic@example.com"
                  />
                </div>

                <div className="settings-field">
                  <label>WhatsApp</label>

                  <input
                    type="text"
                    name="whatsapp"
                    value={form.whatsapp || ""}
                    onChange={handleChange}
                    placeholder="WhatsApp number"
                  />
                </div>

                <div className="settings-field">
                  <label>Website</label>

                  <input
                    type="text"
                    name="website"
                    value={form.website || ""}
                    onChange={handleChange}
                    placeholder="https://www.example.com"
                  />
                </div>

                <div className="settings-field">
                  <label>Facebook</label>

                  <input
                    type="text"
                    name="facebook"
                    value={form.facebook || ""}
                    onChange={handleChange}
                    placeholder="https://facebook.com/clinic"
                  />
                </div>

                <div className="settings-field">
                  <label>Instagram</label>

                  <input
                    type="text"
                    name="instagram"
                    value={form.instagram || ""}
                    onChange={handleChange}
                    placeholder="https://instagram.com/clinic"
                  />
                </div>

                <div className="settings-field">
                  <label>City</label>

                  <input
                    type="text"
                    name="city"
                    value={form.city || ""}
                    onChange={handleChange}
                    placeholder="Cairo"
                  />
                </div>

                <div className="settings-field">
                  <label>Country</label>

                  <input
                    type="text"
                    name="country"
                    value={form.country || ""}
                    onChange={handleChange}
                    placeholder="Egypt"
                  />
                </div>

                <div className="settings-field full-width">
                  <label>Address</label>

                  <textarea
                    name="address"
                    rows="2"
                    value={form.address || ""}
                    onChange={handleChange}
                    placeholder="Enter clinic address"
                  />
                </div>

                <div className="settings-field full-width">
                  <label>Working Hours</label>

                  <textarea
                    name="workingHours"
                    rows="2"
                    value={form.workingHours || ""}
                    onChange={handleChange}
                    placeholder="Saturday - Thursday: 9 AM - 10 PM"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* =================================================
              INVOICE INFORMATION
          ================================================= */}

          <section className="settings-card">
            <div className="settings-card-header">
              <div className="settings-card-icon orange">
                <i className="bi bi-receipt"></i>
              </div>

              <div>
                <h3>Invoice Settings</h3>
                <p>Configure your clinic invoice information</p>
              </div>
            </div>

            <div className="settings-card-body">
              <div className="settings-form-grid">
                <div className="settings-field">
                  <label>Invoice Prefix</label>

                  <input
                    type="text"
                    name="invoicePrefix"
                    value={form.invoicePrefix || ""}
                    onChange={handleChange}
                    placeholder="INV"
                  />

                  <small>Example: INV-2026-001</small>
                </div>

                <div className="settings-field">
                  <label>Tax Rate (%)</label>

                  <input
                    type="number"
                    name="taxRate"
                    value={form.taxRate || ""}
                    onChange={handleChange}
                    min="0"
                    max="100"
                    step="0.01"
                    placeholder="0"
                  />
                </div>

                <div className="settings-field">
                  <label>Currency</label>

                  <input
                    type="text"
                    name="currency"
                    value={form.currency || ""}
                    onChange={handleChange}
                    placeholder="EGP"
                  />
                </div>

                <div className="settings-field">
                  <label>Tax Number</label>

                  <input
                    type="text"
                    name="taxNumber"
                    value={form.taxNumber || ""}
                    onChange={handleChange}
                    placeholder="Enter tax number"
                  />
                </div>

                <div className="settings-field">
                  <label>Commercial Register</label>

                  <input
                    type="text"
                    name="commercialRegister"
                    value={form.commercialRegister || ""}
                    onChange={handleChange}
                    placeholder="Enter commercial register"
                  />
                </div>

                <div className="settings-field full-width">
                  <label>Invoice Note</label>

                  <textarea
                    name="invoiceNote"
                    rows="2"
                    value={form.invoiceNote || ""}
                    onChange={handleChange}
                    placeholder="This note will appear at the bottom of the invoice"
                  />
                </div>

                <div className="settings-field full-width">
                  <label>Thank You Message</label>

                  <textarea
                    name="thankYouMessage"
                    rows="2"
                    value={form.thankYouMessage || ""}
                    onChange={handleChange}
                    placeholder="Thank you for trusting us."
                  />
                </div>
              </div>
            </div>
          </section>

          {/* =================================================
              BANK INFORMATION
          ================================================= */}

          <section className="settings-card">
            <div className="settings-card-header">
              <div className="settings-card-icon blue">
                <i className="bi bi-bank"></i>
              </div>

              <div>
                <h3>Bank Information</h3>
                <p>Optional payment and banking information</p>
              </div>

              <span className="optional-badge">Optional</span>
            </div>

            <div className="settings-card-body">
              <div className="settings-form-grid">
                <div className="settings-field full-width">
                  <label>Bank Name</label>

                  <input
                    type="text"
                    name="bankName"
                    value={form.bankName || ""}
                    onChange={handleChange}
                    placeholder="Enter bank name"
                  />
                </div>

                <div className="settings-field">
                  <label>Bank Account</label>

                  <input
                    type="text"
                    name="bankAccount"
                    value={form.bankAccount || ""}
                    onChange={handleChange}
                    placeholder="Enter account number"
                  />
                </div>

                <div className="settings-field">
                  <label>IBAN</label>

                  <input
                    type="text"
                    name="bankIban"
                    value={form.bankIban || ""}
                    onChange={handleChange}
                    placeholder="Enter IBAN"
                  />
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* =================================================
            SAVE
        ================================================= */}

        <div className="clinic-settings-footer">
          <div className="save-info">
            <i className="bi bi-shield-check"></i>

            <span>Your clinic information is securely saved.</span>
          </div>

          <button
            type="submit"
            className="save-settings-btn"
            disabled={loading || saving}
          >
            {saving ? (
              <>
                <span className="save-spinner"></span>
                Saving...
              </>
            ) : loading ? (
              "Loading..."
            ) : (
              <>
                <i className="bi bi-check-lg"></i>
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
