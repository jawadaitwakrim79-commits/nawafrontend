"use client";
import { useState } from "react";
import { normalizePhone } from "@/lib/phone";
import { sendContact } from "@/lib/api";

export function ContactForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const phoneResult = normalizePhone(phone);
    if (!phoneResult) {
      setPhoneError("رقم الجوال غير صحيح. استخدمي 05xxxxxxxx");
      return;
    }
    setPhoneError("");
    setSubmitting(true);
    setError("");
    try {
      await sendContact({ name, phone: phoneResult.e164, message });
      setDone(true);
    } catch {
      setError("ما أرسلت. جرّبي مرة ثانية.");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div style={{ background: "var(--color-ivory)", borderRadius: "16px", padding: "24px", border: "1px solid var(--color-line)", textAlign: "center" }}>
        <h2 style={{ fontFamily: "var(--font-amiri), serif", fontSize: "24px", marginBottom: "8px" }}>وصلت رسالتكِ</h2>
        <p style={{ color: "var(--color-muted)" }}>نردّ في ساعات العمل.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div>
        <label htmlFor="c-name" style={{ display: "block", fontSize: "14px", fontWeight: 600, marginBottom: "6px" }}>الاسم</label>
        <input
          id="c-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{ width: "100%", padding: "12px 14px", border: "1px solid var(--color-line)", borderRadius: "12px", fontSize: "16px", background: "var(--color-paper)", color: "var(--color-ink)", outline: "none" }}
        />
      </div>
      <div>
        <label htmlFor="c-phone" style={{ display: "block", fontSize: "14px", fontWeight: 600, marginBottom: "6px" }}>الجوال</label>
        <input
          id="c-phone"
          type="tel"
          inputMode="tel"
          value={phone}
          onChange={(e) => { setPhone(e.target.value); setPhoneError(""); }}
          placeholder="05xxxxxxxx"
          required
          style={{ width: "100%", padding: "12px 14px", border: `1px solid ${phoneError ? "var(--color-brand)" : "var(--color-line)"}`, borderRadius: "12px", fontSize: "16px", background: "var(--color-paper)", color: "var(--color-ink)", outline: "none", direction: "ltr", textAlign: "right" }}
        />
        {phoneError && <p style={{ color: "var(--color-brand)", fontSize: "13px", marginTop: "4px" }}>{phoneError}</p>}
      </div>
      <div>
        <label htmlFor="c-msg" style={{ display: "block", fontSize: "14px", fontWeight: 600, marginBottom: "6px" }}>الرسالة</label>
        <textarea
          id="c-msg"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          rows={5}
          style={{ width: "100%", padding: "12px 14px", border: "1px solid var(--color-line)", borderRadius: "12px", fontSize: "16px", background: "var(--color-paper)", color: "var(--color-ink)", outline: "none", resize: "vertical" }}
        />
      </div>
      {error && <p style={{ color: "var(--color-brand)", fontSize: "14px" }}>{error}</p>}
      <button
        type="submit"
        disabled={submitting}
        style={{
          background: "var(--color-brand-deep)",
          color: "var(--color-on-brand)",
          border: "none",
          borderRadius: "999px",
          padding: "14px 28px",
          fontSize: "16px",
          fontWeight: 600,
          cursor: submitting ? "not-allowed" : "pointer",
          minHeight: "52px",
        }}
      >
        {submitting ? "جاري الإرسال..." : "أرسلي"}
      </button>
    </form>
  );
}
