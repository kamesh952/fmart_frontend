import React from "react";

const Marquee = () => {
  const content = "Welcome to FreshMart - your one-stop online destination for fresh fruits, vegetables, groceries, dairy products, personal care, and household essentials.";
  
  return (
    <div className="bg-gradient-to-r from-blue-700 to-purple-600 text-white py-2 overflow-hidden">
      <div className="animate-marquee whitespace-nowrap flex items-center">
        {[...Array(3)].map((_, i) => (
          <span key={i} className="mx-4 flex items-center">
            <span className="mr-2">🛒</span>
            {content}
          </span>
        ))}
      </div>
    </div>
  );
};

export default Marquee;