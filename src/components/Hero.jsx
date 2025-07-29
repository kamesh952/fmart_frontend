import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import hero1 from "./slide1.jpg";
import hero2 from "./fresh-vegetables.jpg";
import hero3 from "./fish-meat.jpg";
import hero4 from "./organic-fru.jpg";
const slides = [
  {
    name: "Welcome to Fresh Mart",
    image: hero1, // ✅ correct
    title: "Fresh Fruits",
    subtitle: "Sourced daily from local farms, delivered to your doorstep.",
  },
  {
    name: "Welcome to Fresh Mart",
    image: hero2,
    title: "Organic Vegetables",
    subtitle: "Healthy, clean, and naturally grown vegetables for your family.",
  },
  {
    name: "Welcome to Fresh Mart",
    image: hero3,
    title: "Dairy Products",
    subtitle: "Groceries, dairy, grains and more — all in one place.",
  },
  {
    name: "Welcome to Fresh Mart",
    image: hero4,
    title: "Fast & Fresh Delivery",
    subtitle: "Your daily needs, delivered in hours — not days.",
  },
];

const Hero = () => {
  const [index, setIndex] = useState(0);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ margin: 0 }}>
      <section className="relative h-[400px] md:h-[600px] lg:h-[550px] overflow-hidden m-0">
        {slides.map((slide, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              i === index ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            {/* Fixed image rendering */}
            <div 
              className="w-full h-full"
              style={{
                backgroundImage: `url(${slide.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            ></div>
            <div className="absolute inset-0 bg- bg-opacity-30 flex items-center justify-center">
              <div className="text-center text-white p-6">
                <h1
                  className="text-4xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-10"
                  style={{ fontFamily: "'Dancing Script', cursive" }}
                >
                  {slide.name}
                </h1>
                <h1 className="text-2xl mt-6 md:text-4xl lg:text-5xl font-bold tracking-tight uppercase mb-4">
                  {slide.title}
                </h1>
                <p className="text-sm md:text-lg tracking-tight mb-6 max-w-xl mx-auto">
                  {slide.subtitle}
                </p>
                {isAuthenticated ? (
                  <Link
                    to="/shop"
                    className="bg-white text-green-700 no-underline px-8 py-3 rounded-full text-lg font-semibold shadow-md hover:shadow-lg hover:bg-gray-100 transition-transform duration-300 ease-in-out transform hover:-translate-y-1"
                  >
                    Shop Now
                  </Link>
                ) : (
                  <Link
                    to="/login"
                    className="bg-white no-underline text-green-700 px-8 py-3 rounded-full text-lg font-semibold shadow-md hover:shadow-lg hover:bg-gray-100 transition-transform duration-300 ease-in-out transform hover:-translate-y-1"
                  >
                    Shop Now
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default Hero;