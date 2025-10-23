"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";

const LogoItem = (icon, text, url="/") =>{
  return(
    <div
      data-badge="None"
      data-selected="True"
      data-show-focus-indicator="false"
      data-show-label-text="true"
      data-state="Enabled"
      className="flex-1 self-stretch py-1.5 inline-flex flex-col justify-start items-left gap-1"
    >
      <Link href={url}>
        <div className="bg-waxwingGreen hover:bg-waxwingLightGreen hover:cursor-pointer active:bg-waxwingDarkGreen rounded-2xl flex flex-col justify-center items-center overflow-hidden">
          <div className="w-14 h-8 relative inline-flex justify-center items-center">
            <div className="w-6 h-6 relative overflow-hidden">
              <img src={icon} alt="Logo"></img>
            </div>
          </div>
        </div>
      </Link>
      <div className="self-stretch text-center justify-start text-Schemes-Secondary text-xs font-medium font-['Roboto'] leading-none tracking-wide">
        {text}
      </div>
    </div>
  );
}

const NavItem = (icon, text, url = "/") => {
  return(
    <div
      data-badge="None"
      data-selected="True"
      data-show-focus-indicator="false"
      data-show-label-text="true"
      data-state="Enabled"
      className="flex-1 self-stretch py-1.5 inline-flex flex-col justify-start items-center gap-1"
    >
      <Link href={url}>
        <div className="bg-waxwingGreen hover:bg-waxwingLightGreen hover:cursor-pointer active:bg-waxwingDarkGreen rounded-2xl flex flex-col justify-center items-center overflow-hidden">
          <div className="w-14 h-8 relative inline-flex justify-center items-center">
            <div className="w-6 h-6 relative overflow-hidden">
              <img src={icon} alt="Chat bubble icon"></img>
            </div>
          </div>
        </div>
      </Link>
      <div className="self-stretch text-center justify-start text-Schemes-Secondary text-xs font-medium font-['Roboto'] leading-none tracking-wide">
        {text}
      </div>
    </div>
  );
};

const NavBar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const checkAuth = () => {
    try {
      // Only run auth check once router is ready
      const token = typeof window !== "undefined" ? window.localStorage.getItem("authToken") : null;
      if (!token){
        setIsLoggedIn(false);
      } else {
        setIsLoggedIn(true);
      }
    } catch (e) {
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    // Check auth on mount
    checkAuth();

    // Listen for auth changes
    window.addEventListener("authChange", checkAuth);

    // Cleanup listener
    return () => {
      // localStorage access might throw in some strict privacy settings or cause errors, treat this as logged out
      window.removeEventListener("authChange", checkAuth);
    };
  }, []);

  if (!isLoggedIn) {
    return (
      <div className="w-full bg-lightGray inline-flex justify-center items-center">
        {NavItem("accountCircle.svg", "Log in", "/login")}
        {NavItem("plusCircle.svg", "Sign up", "/signup")}
        {NavItem("chat.svg", "Contact us", "/contact")}
      </div>
    );
  } 
  return (
    // TODO update navbar to look like figma design
    <div className="w-full bg-lightGray inline-flex justify-center items-center">
      {LogoItem("accountCircle.svg", "CampusWheels", "/home")}
      {NavItem("accountCircle.svg", "Log in", "/login")}
      {NavItem("plusCircle.svg", "Sign up", "/signup")}
      {NavItem("chat.svg", "Contact us", "/contact")}
    </div>
  );
};

export default NavBar;
