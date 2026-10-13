import React from "react";

export const Header = ({ data }) => {
  const title = data?.title ?? "Wir schaufeln nicht – wir fräsen";

  return (
    <header id="header">
      <div className="grid h-screen min-h-[600px] w-full grid-rows-[2fr_1fr] bg-brand supports-[height:100dvh]:h-[100dvh] md:grid-cols-[1fr_2fr] md:grid-rows-1">
        {/* Logo panel: the image keeps its own aspect ratio and is scaled to fit
            the panel, so the whole logo is visible at every breakpoint. */}
        <div className="flex items-center justify-center overflow-hidden p-4 sm:p-6 md:p-8">
          <img
            src="img/logo.jpg"
            alt="Ingenieurbüro Auner"
            className="max-h-full w-auto max-w-full rounded-[20px] object-cover ring-1 ring-white/10"
          />
        </div>
        <div className="flex items-center justify-center p-6 md:justify-start md:p-12">
          <h1 className="text-center font-heading text-3xl font-bold uppercase leading-tight text-white sm:text-4xl md:text-left md:text-5xl lg:text-6xl">
            {title}
          </h1>
        </div>
      </div>
    </header>
  );
};
