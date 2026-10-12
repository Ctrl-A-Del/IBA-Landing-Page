import React from "react";
import { Container } from "./ui/Container";

export const Features = () => (
  <section id="features" className="scroll-mt-24 bg-brand py-16 md:py-20">
    <Container>
      <img
        src="img/fraese.png"
        alt="Fräsmaschine für den Grabenaushub"
        width="1342"
        height="738"
        className="mx-auto h-auto w-full rounded-xl"
        loading="lazy"
      />
    </Container>
  </section>
);
