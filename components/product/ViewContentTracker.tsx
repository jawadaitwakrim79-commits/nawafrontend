"use client";
import { useEffect } from "react";
import type { Slug } from "@/content/products";
import { trackViewContent } from "@/lib/tracking";
import { sendEvent } from "@/lib/api";

export function ViewContentTracker({ slug }: { slug: Slug }) {
  useEffect(() => {
    const eid = crypto.randomUUID();
    trackViewContent(eid, { value: 199, contentIds: [slug], numItems: 1 });
    void sendEvent({ event_name: "ViewContent", event_id: eid, value: 199, content_ids: [slug] });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}
