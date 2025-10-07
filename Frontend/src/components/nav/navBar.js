import React from "react";

const NavItem = (icon, text) => {
  return (
    <div
      data-badge="None"
      data-selected="True"
      data-show-focus-indicator="false"
      data-show-label-text="true"
      data-state="Enabled"
      className="flex-1 self-stretch py-1.5 inline-flex flex-col justify-start items-center gap-1"
    >
      <div className="bg-waxwingGreen rounded-2xl flex flex-col justify-center items-center overflow-hidden">
        <div className="w-14 h-8 relative inline-flex justify-center items-center">
          <div className="w-6 h-6 relative overflow-hidden">
            <img src={icon} alt="Chat bubble icon"></img>
          </div>
        </div>
      </div>
      <div className="self-stretch text-center justify-start text-Schemes-Secondary text-xs font-medium font-['Roboto'] leading-none tracking-wide">
        {text}
      </div>
    </div>
  );
};

const NavBar = () => {
  return (
    <div className="w-full bg-lightGray inline-flex justify-center items-center">
      {NavItem("accountCircle.svg", "Log in")}
      {NavItem("plusCircle.svg", "Sign up")}
      {NavItem("chat.svg", "Contact us")}
    </div>
  );
};

export default NavBar;
