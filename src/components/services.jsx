import React from "react";
import { FastForward, Recycle, User } from "lucide-react";
import { Section } from "./ui/Section";
import { SectionTitle } from "./ui/SectionTitle";

const ICONS = {
  "fast-forward": FastForward,
  recycle: Recycle,
  user: User,
};

export const Services = ({ data }) => {
  const services = data ?? [];

  return (
    <Section id="services" variant="darkAlt">
      <SectionTitle dark>
        Neue Netze brauchen leistungsfähigere Bauprozesse.
      </SectionTitle>
      <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
        {services.map((service) => {
          const Icon = ICONS[service.icon] ?? FastForward;
          return (
            <div key={service.name} className="text-center">
              <span className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-r from-accent-from to-accent-to shadow-lg">
                <Icon className="h-10 w-10 text-white" aria-hidden="true" />
              </span>
              <h3 className="mb-3 text-xl font-medium text-white">
                {service.name}
              </h3>
              <p className="text-white/75">{service.text}</p>
            </div>
          );
        })}
      </div>
    </Section>
  );
};
