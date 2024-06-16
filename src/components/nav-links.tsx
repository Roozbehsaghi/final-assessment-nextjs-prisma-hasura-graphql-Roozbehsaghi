"use client";

import Link from "next/link";

export function NavLinks() {
  return [
    ["Your Profile", "/user-profile"],
    ["FAQs", "/faqs"],
  ].map(([label, href]) => (
    <Link
      key={label}
      href={href}
      className="relative -mx-3 -my-2 rounded-lg px-3 py-2 text-sm text-gray-700 transition-colors delay-150 hover:text-gray-900 hover:delay-0"
    >
      <span className="relative z-10">{label}</span>
    </Link>
  ));
}
