import { copy } from "@/content/copy";

export default function TermsPage() {
  return (
    <div className="max-w-[720px] mx-auto px-5 py-20">
      <h1 className="text-ink mb-6">{copy.policies.terms.title}</h1>
      <p className="text-muted text-base leading-relaxed">{copy.policies.terms.body}</p>
    </div>
  );
}
