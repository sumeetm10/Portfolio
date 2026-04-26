"use client";

import { Download } from "lucide-react";

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-ink text-bg text-sm font-medium hover:bg-accent transition-colors"
    >
      <Download size={14} /> Save as PDF
    </button>
  );
}
