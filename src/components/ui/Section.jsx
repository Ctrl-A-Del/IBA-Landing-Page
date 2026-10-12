import React from "react";
import { Container } from "./Container";

const VARIANTS = {
  light: "bg-white",
  muted: "bg-surface",
  dark: "bg-brand",
  darkAlt: "bg-gradient-to-r from-brand to-brand-alt",
};

export const Section = ({
  id,
  variant = "light",
  className = "",
  containerClassName = "",
  children,
}) => (
  <section
    id={id}
    className={`scroll-mt-24 py-20 md:py-28 ${
      VARIANTS[variant] ?? VARIANTS.light
    } ${className}`}
  >
    <Container className={containerClassName}>{children}</Container>
  </section>
);
