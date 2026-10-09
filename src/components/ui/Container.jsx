import React from "react";

export const Container = ({ className = "", children }) => (
  <div className={`mx-auto w-full max-w-container px-4 sm:px-6 lg:px-8 ${className}`}>
    {children}
  </div>
);
