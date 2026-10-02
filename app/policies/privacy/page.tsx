import { copy } from "@/content/copy";

export default function PrivacyPage() {
  return (
    <div className="max-w-[720px] mx-auto px-5 py-20">
      <h1 className="text-ink mb-6">{copy.policies.privacy.title}</h1>
      <p className="text-muted text-base leading-relaxed">{copy.policies.privacy.body}</p>
    </div>
  );
}
