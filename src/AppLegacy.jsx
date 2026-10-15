import React from "react";
import { Header } from "./components/header";
import { Features } from "./components/features";
import { About } from "./components/about";
import { Services } from "./components/services";
import { Team } from "./components/Team";
import { Contact } from "./components/contact";
import { Footer } from "./components/Footer";
import JsonData from "./data/data.json";

const App = () => (
  <>
    <Header data={JsonData.Header} />
    <main>
      <Features />
      <About data={JsonData.About} />
      <Services data={JsonData.Services} />
      <Team data={JsonData.Team} />
      <Contact data={JsonData.Contact} />
    </main>
    <Footer />
  </>
);

export default App;
