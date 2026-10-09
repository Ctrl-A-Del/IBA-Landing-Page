import React from "react";
import { Section } from "./ui/Section";
import { SectionTitle } from "./ui/SectionTitle";

export const Team = ({ data }) => {
  const team = data ?? [];

  return (
    <Section id="team" variant="dark">
      <SectionTitle dark subtitle="für die Infrastruktur von morgen">
        Maschinenbau aus NRW
      </SectionTitle>
      <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
        {team.map((member) => (
          <div key={member.name} className="text-center">
            <img
              src={member.img}
              alt={member.name}
              width="240"
              height="320"
              className="mx-auto h-60 w-60 rounded-[20px] object-cover"
              loading="lazy"
            />
            <h3 className="mt-5 text-lg font-semibold text-white">
              {member.name}
            </h3>
            <p className="text-white/75">{member.job}</p>
          </div>
        ))}
      </div>
    </Section>
  );
};
