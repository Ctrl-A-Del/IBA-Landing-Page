import React from "react";

export const SectionTitle = ({ children, subtitle, dark = false }) => (
  <div className="mb-12 text-center md:mb-16">
    <h2
      className={`text-2xl font-extrabold uppercase tracking-wide md:text-4xl ${
        dark ? "text-white" : "text-neutral-900"
      }`}
    >
      {children}
    </h2>
    <span className="mx-auto mt-5 block h-1 w-16 rounded-full bg-gradient-to-r from-accent-from to-accent-to" />
    {subtitle && (
      <p
        className={`mx-auto mt-5 max-w-2xl text-base md:text-lg ${
          dark ? "text-white/75" : "text-neutral-500"
        }`}
      >
        {subtitle}
      </p>
    )}
  </div>
);
