import React from "react";
import { TbBrandMeta } from "react-icons/tb";
import { IoLogoInstagram } from "react-icons/io";
import { RiTwitterXLine } from "react-icons/ri";

const Topbar = () => {
  return (
    <div className="bg-[#ea2e0e] text-white">
      <div className="container mx-auto flex justify-between items-center py-2.5  px-12">
        <div className="hidden md:flex items-center space-x-4">
          <a href="#" className="text-white hover:text-gray-300">
            <TbBrandMeta className="h-5 w-5" />
          </a>
          <a
            href="#"
            className="text-white hover:text-red-600 md:hover:text-red-700 lg:hover:text-red-800 transition-colors duration-300"
          >
            <IoLogoInstagram className="h-5 w-5" />
          </a>
          <a href="#" className="text-white hover:text-gray-300">
            <RiTwitterXLine className="h-4 w-4" />
          </a>
        </div>

        <div className="text-sm text-center flex-grow">
          <span>We ship worldwide – Fast and reliable shipping!</span>
        </div>

        <div className="text-sm hidden md:block text-white">
          <a href="tel:+1234567890" className="hover:text-gray-300">
            +91 8680892898
          </a>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
