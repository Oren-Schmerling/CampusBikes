"use client";
import React, { useEffect, useState } from "react";
import { Home, FileText, List, MessageSquare, User } from 'lucide-react';
import Link from "next/link";

// function for the account icon
const AccountItem = (text, url = "/") => {
  return (
    <div
      data-badge="None"
      data-selected="True"
      data-show-focus-indicator="false"
      data-show-label-text="true"
      data-state="Enabled"
      className="flex-1 self-stretch py-1.5 inline-flex flex-col justify-start items-left gap-1"
    >
      <Link href={url}>
        <div className="
          bg-waxwingGreen hover:bg-waxwingLightGreen hover:cursor-pointer active:bg-waxwingDarkGreen 
          rounded-2xl flex flex-col justify-center items-center overflow-hidden border-1 border-black
        ">
          <div className="w-14 h-8 relative inline-flex justify-center items-center">
            <div className="w-6 h-6 relative overflow-hidden">
              <User color="white" />
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

// function used for the logo
const LogoItem = () => {
  return (
    <Link href="/" className="flex bg-waxwingGreen px-4 py-1.5 rounded-2xl items-center space-x-2 text-white hover:opacity-90 transition-opacity border-1 border-black">
      <div className="text-2xl font-bold">CampusBikes</div>
      <img src="/CampusBikesLogo.svg" alt="CampusBikes" className="h-12" />
    </Link>
  );
}

const NavItem = (icon, text, url = "/") => {
  return (
    <div
      data-badge="None"
      data-selected="True"
      data-show-focus-indicator="false"
      data-show-label-text="true"
      data-state="Enabled"
      className="flex-1 self-stretch py-1.5 inline-flex flex-col justify-start items-center gap-1"
    >
      <Link href={url}>
        <div className="bg-waxwingGreen hover:bg-waxwingLightGreen hover:cursor-pointer active:bg-waxwingDarkGreen rounded-2xl flex flex-col justify-center items-center overflow-hidden border-1 border-black">
          <div className="w-14 h-8 relative inline-flex justify-center items-center">
            <div className="w-6 h-6 relative overflow-hidden">
              <img src={icon} alt="icon"></img>
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

const navbar_with_color = (color) => {
  /*
  function that has background color of the navbar as a parameter
  */
  let navColor = "bg-" + color + " py-2";
  return (
    <nav className={navColor}>
      <div className="px-2 mx-auto flex items-center justify-between">
        {LogoItem()}

        {/* Center - Main Navigation Links */}
        <div className="flex items-center space-x-40">
          <Link href="/home" className="flex bg-waxwingGreen items-center space-x-2 text-white hover:bg-green-900 px-4 py-2 rounded-2xl transition-colors border-1 border-black">
            <Home className="w-5 h-5" />
            <span className="font-medium">Home</span>
          </Link>

          <Link href="/posting" className="flex bg-waxwingGreen items-center space-x-2 text-white hover:bg-green-900 px-4 py-2 rounded-2xl transition-colors border-1 border-black">
            <FileText className="w-5 h-5" />
            <span className="font-medium">Posting</span>
          </Link>

          <Link href="/listings" className="flex bg-waxwingGreen items-center space-x-2 text-white hover:bg-green-900 px-4 py-2 rounded-2xl transition-colors border-1 border-black">
            <List className="w-5 h-5" />
            <span className="font-medium">Listing</span>
          </Link>
        </div>

        {/* Right side - Contact & Account */}
        <div className="flex items-center space-x-4">
          {NavItem("chat.svg", "Contact us", "/contact")}
          {AccountItem("Account", "/account")}
        </div>
      </div>
    </nav>
  );
}

const NavBar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const checkAuth = () => {
    try {
      // Only run auth check once router is ready
      const token = typeof window !== "undefined" ? window.localStorage.getItem("authToken") : null;
      if (!token) {
        setIsLoggedIn(false);
      } else {
        setIsLoggedIn(true);
      }
    } catch (e) {
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    // Check auth on mount (may get rid of this later?)
    checkAuth();

    // Listen for auth changes, should be coming from login page
    window.addEventListener("authChange", checkAuth);

    // run on cleanup
    return () => {
      // localStorage access might throw in some strict privacy settings or cause errors, treat this as logged out
      window.removeEventListener("authChange", checkAuth);
    };
  }, []);

  if (!isLoggedIn) {
    return (
      <div className="w-full bg-lightGray py-2 inline-flex justify-center items-center">
        <div className="px-2">
          {LogoItem()}
        </div>
        {NavItem("accountCircle.svg", "Log in", "/login")}
        {NavItem("plusCircle.svg", "Sign up", "/signup")}
        {NavItem("chat.svg", "Contact us", "/contact")}
      </div>
    );
  }

  return (
    // lightGray
    // waxwingGreen
    navbar_with_color("waxwingGreen")
  );
};

export default NavBar;
