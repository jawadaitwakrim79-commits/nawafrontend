import type { Metadata } from "next";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = {
  title: "تواصلي | نوا للبيت",
};

export default function ContactPage() {
  return (
    <div className="max-w-[600px] mx-auto px-5 py-16">
      <h1 className="text-ink mb-2">تواصلي معنا</h1>
      <p className="text-muted mb-8">نردّ في ساعات العمل، السبت–الخميس ٩ص–٥م</p>
      <ContactForm />
    </div>
  );
}
