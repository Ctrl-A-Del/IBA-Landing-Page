import React from "react";
import { Container } from "./ui/Container";

const LINKS = [
  { href: "/datenschutz.html", label: "Datenschutzerklärung" },
  { href: "/impressum.html", label: "Impressum" },
];

export const Footer = () => (
  <footer className="bg-brand py-8">
    <Container>
      <ul className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-8">
        {LINKS.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              className="text-sm text-link transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-to focus-visible:ring-offset-2 focus-visible:ring-offset-brand"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </Container>
  </footer>
);
