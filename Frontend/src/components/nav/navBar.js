"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";

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
const AltNavItem = (icon, text, url = "/") => {
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
        <div className="bg-waxwingGreen hover:bg-waxwingDarkGreen hover:cursor-pointer active:bg-waxwingLightGreen rounded-2xl flex flex-col justify-center items-center overflow-hidden">
          <div className="w-14 h-8 relative inline-flex justify-center items-center">
            <div className="w-6 h-6 relative overflow-hidden">
              <img src={icon} alt="Chat bubble icon"></img>
            </div>
          </div>
        </div>
      </Link>
      <div className="self-stretch text-center text-white text-sm font-semibold font-sans leading-none tracking-wide">
        {text}
      </div>
    </div>
  );
}

const NavBar = () => {
  const [loggedIn, setLoggedIn] = useState(null);

  useEffect(() => {
    async function checkLogin() {
      const result = await verifyAuth();
      setLoggedIn(result.success);
    }
    checkLogin();
  }, []);

  if (loggedIn === null) return null;

  if (!loggedIn) {
    return (
      <div className="fixed w-full bg-lightGray inline-flex justify-center items-center z-50">
        {NavItem("accountCircle.svg", "Log in", "/login")}
        {NavItem("plusCircle.svg", "Sign up", "/signup")}
        {NavItem("chat.svg", "Contact us", "/contact")}
      </div>
    );
  }
  return (
    <div className="fixed w-full bg-waxwingGreen z-50 flex items-center px-6 h-16">
      <div className="flex items-center">
        <span className="text-3xl font-bold text-white">
          CampusBikes
        </span>
        <img
          src="/logo.svg"
          alt="Site Logo"
          className="h-13 w-auto"
        />

      </div>
      <div className="flex w-full justify-between ml-20">
        {AltNavItem("homeIcon.svg", "Home Page", "/home")}
        {AltNavItem("plusCircle.svg", "Listings", "/listings")}
        {AltNavItem("accountCircle.svg", "Account", "/contact")}
      </div>
    </div>
  );
};

export async function verifyAuth() {
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
  const url = `${BASE_URL}/auth/verify`;

  const token = localStorage.getItem("authToken");
  if (!token) {
    return { success: false };
  }

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    const text = await res.text();
    let parsed;

    try {
      parsed = text ? JSON.parse(text) : {};
    } catch {
      parsed = { message: text };
    }

    if (!res.ok) {
      return { success: false, message: parsed?.message };
    }

    return { success: true, data: parsed };
  } catch (err) {
    console.error("verifyAuth network error:", err);
    return { success: false };
  }
}

export default NavBar;
