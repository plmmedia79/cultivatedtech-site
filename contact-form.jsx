// Contact form — React 18, JSX. Validates client-side; on submit, calls
// the placeholder handler `submitContact()` which a real backend can replace.
// Replace the body of `submitContact` with a fetch() to /api/contact (or similar).

const { useState } = React;

const COUNTRIES = [
  "United States", "Canada", "United Kingdom", "Australia", "Germany",
  "France", "Netherlands", "Ireland", "Mexico", "Japan", "Singapore",
  "United Arab Emirates", "Other"
];

async function submitContact(payload) {
  // Placeholder submission — wire this to a real handler (e.g. /api/contact)
  // when deploying. Resolves successfully after a short delay for the demo.
  console.log("[contact] submission payload:", payload);
  await new Promise(r => setTimeout(r, 900));
  return { ok: true };
}

function ContactForm() {
  const [values, setValues] = useState({
    fullName: "", email: "", company: "", country: "United States", description: ""
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error

  const setField = (k) => (e) => {
    setValues(v => ({ ...v, [k]: e.target.value }));
    setErrors(er => ({ ...er, [k]: undefined }));
  };

  const validate = () => {
    const er = {};
    if (!values.fullName.trim() || values.fullName.trim().length < 2)
      er.fullName = "Please provide your full name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email))
      er.email = "Please provide a valid business email address.";
    if (!values.company.trim())
      er.company = "Please provide your company name.";
    if (!values.description.trim() || values.description.trim().length < 20)
      er.description = "Please describe the project (at least a couple of sentences).";
    return er;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const er = validate();
    if (Object.keys(er).length) { setErrors(er); return; }
    setStatus("submitting");
    try {
      const res = await submitContact(values);
      if (res && res.ok) setStatus("success");
      else setStatus("error");
    } catch (_) {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="form-success" role="status" aria-live="polite">
        <div className="check" aria-hidden="true">✓</div>
        <h3>Thank you — your message has been received.</h3>
        <p style={{ margin: "8px 0 16px", color: "var(--ink-2)" }}>
          A member of the firm will respond within two business days. If your inquiry is time-sensitive,
          you can reach us directly at <a href="mailto:contact@cultivatedtech.space" style={{ color: "var(--ink)", textDecoration: "underline" }}>contact@cultivatedtech.space</a>.
        </p>
        <p style={{ fontFamily: "var(--mono)", fontSize: "12px", letterSpacing: "0.08em", color: "var(--ink-3)", textTransform: "uppercase", margin: 0 }}>
          REF · {Date.now().toString(36).toUpperCase()}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <div className="form-row">
        <div className="form-field">
          <label htmlFor="fullName">Full Name<span className="req">*</span></label>
          <input
            id="fullName" name="fullName" type="text" autoComplete="name"
            value={values.fullName} onChange={setField("fullName")}
            className={errors.fullName ? "invalid" : ""}
            aria-invalid={!!errors.fullName}
          />
          {errors.fullName && <span className="err">{errors.fullName}</span>}
        </div>
        <div className="form-field">
          <label htmlFor="email">Business Email<span className="req">*</span></label>
          <input
            id="email" name="email" type="email" autoComplete="email"
            value={values.email} onChange={setField("email")}
            className={errors.email ? "invalid" : ""}
            aria-invalid={!!errors.email}
          />
          {errors.email && <span className="err">{errors.email}</span>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-field">
          <label htmlFor="company">Company Name<span className="req">*</span></label>
          <input
            id="company" name="company" type="text" autoComplete="organization"
            value={values.company} onChange={setField("company")}
            className={errors.company ? "invalid" : ""}
            aria-invalid={!!errors.company}
          />
          {errors.company && <span className="err">{errors.company}</span>}
        </div>
        <div className="form-field">
          <label htmlFor="country">Country<span className="req">*</span></label>
          <select id="country" name="country" value={values.country} onChange={setField("country")}>
            {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div className="form-field">
        <label htmlFor="description">Project Description<span className="req">*</span></label>
        <textarea
          id="description" name="description" rows="6"
          placeholder="A few sentences on what you're trying to build, the constraints, and your timeline."
          value={values.description} onChange={setField("description")}
          className={errors.description ? "invalid" : ""}
          aria-invalid={!!errors.description}
        />
        {errors.description && <span className="err">{errors.description}</span>}
      </div>

      {status === "error" && (
        <div className="notice" role="alert" style={{ background: "#FBEAE5", borderLeftColor: "#B43A3A", color: "#7A2424" }}>
          Something went wrong submitting your message. Please try again, or email us directly.
        </div>
      )}

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, marginTop: 8, flexWrap: "wrap" }}>
        <p style={{ fontSize: 12.5, color: "var(--ink-3)", margin: 0, maxWidth: "44ch", lineHeight: 1.5 }}>
          By submitting this form you agree to our <a href="privacy.html" style={{ textDecoration: "underline", color: "var(--ink-2)" }}>Privacy Policy</a>. We use the information you provide solely to respond to your inquiry.
        </p>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={status === "submitting"}
          style={{ opacity: status === "submitting" ? 0.6 : 1 }}
        >
          {status === "submitting" ? "Sending…" : (<>Send Inquiry <span className="arrow">→</span></>)}
        </button>
      </div>
    </form>
  );
}

const root = ReactDOM.createRoot(document.getElementById("contact-form-root"));
root.render(<ContactForm />);
