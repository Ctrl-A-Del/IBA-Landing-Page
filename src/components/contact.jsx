import React from "react";
import { Mail, Phone } from "lucide-react";
import { Section } from "./ui/Section";
import { SectionTitle } from "./ui/SectionTitle";

export const Contact = ({ data }) => {
  const phone = data?.phone ?? "";
  const email = data?.email ?? "";

  return (
    <Section id="contact" variant="dark">
      <SectionTitle
        dark
        subtitle="Lassen Sie uns über den Grabenaushub von morgen sprechen."
      >
        Kontakt
      </SectionTitle>
      <div className="mx-auto flex max-w-md flex-col gap-5">
        {phone && (
          <a
            href={`tel:${phone.replace(/\s+/g, "")}`}
            className="flex items-center gap-4 text-white transition-colors hover:text-accent-to focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-to focus-visible:ring-offset-2 focus-visible:ring-offset-brand"
          >
            <Phone className="h-6 w-6 shrink-0" aria-hidden="true" />
            <span>{phone}</span>
          </a>
        )}
        {email && (
          <a
            href={`mailto:${email}`}
            className="flex items-center gap-4 text-white transition-colors hover:text-accent-to focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-to focus-visible:ring-offset-2 focus-visible:ring-offset-brand"
          >
            <Mail className="h-6 w-6 shrink-0" aria-hidden="true" />
            <span className="break-all">{email}</span>
          </a>
        )}
      </div>
    </Section>
  );
};
