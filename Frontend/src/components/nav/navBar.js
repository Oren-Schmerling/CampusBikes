import React from "react";
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

const NavBar = () => {
  return (
    <div className="fixed w-full bg-lightGray inline-flex justify-center items-center z-1000">
      {NavItem("accountCircle.svg", "Log in", "/login")}
      {NavItem("plusCircle.svg", "Sign up", "/signup")}
      {NavItem("chat.svg", "Contact us", "/contact")}
    </div>
  );
};

export default NavBar;
