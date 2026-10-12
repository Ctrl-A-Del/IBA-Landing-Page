import React from "react";
import { Section } from "./ui/Section";
import { SectionTitle } from "./ui/SectionTitle";

export const About = ({ data }) => {
  const heading =
    data?.heading ?? "Entwickelt für den Energie- und Versorgungsnetzausbau";
  const cards = data?.cards ?? [];

  return (
    <Section id="about" variant="dark">
      <SectionTitle dark>{heading}</SectionTitle>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.title}
            className="rounded-xl bg-white p-6 text-center shadow-md"
          >
            <h3 className="mb-2 text-lg font-semibold text-neutral-900">
              {card.title}
            </h3>
            <p className="text-sm text-neutral-500">{card.text}</p>
          </div>
        ))}
      </div>
    </Section>
  );
};
