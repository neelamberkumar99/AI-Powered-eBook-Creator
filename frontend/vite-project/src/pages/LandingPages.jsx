import React from "react";
import Navbar from "../components/layout/Navbar";
import Hero from "../components/landing/Hero";
import Features from "../components/landing/Features";

const LandingPages = () => {
  return (
    <div className="mb-[100vh]">
      <Navbar />
      <Hero />
      <Features />
      <Tastimonials />
      <Footer />
    </div>
  );
};

export default LandingPages;
