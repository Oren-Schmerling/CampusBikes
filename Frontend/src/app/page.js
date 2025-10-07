import NavBar from "@/components/nav/navBar";

function BigText() {
  return (
    <div className="justify-start z-100">
      <div className="w-full">
        <span className="text-nearBlack text-6xl font-semibold font-['Poppins'] leading-[72px] tracking-wide">
          Use{" "}
        </span>
        <span className="text-waxwingGreen text-6xl font-semibold font-['Poppins'] leading-[72px] tracking-wide">
          CampusBikes
        </span>
      </div>
      <div className="w-full">
        <span className="text-nearBlack text-6xl font-semibold font-['Poppins'] leading-[72px] tracking-wide">
          {" "}
          get around{" "}
        </span>
        <span className="text-waxwingGreen text-6xl font-semibold font-['Poppins'] leading-[72px] tracking-wide">
          Greener{" "}
        </span>
      </div>
      <div className="w-full">
        <span className="text-nearBlack text-6xl font-semibold font-['Poppins'] leading-[72px] tracking-wide">
          rent wheels{" "}
        </span>
        <span className="text-waxwingGreen text-6xl font-semibold font-['Poppins'] leading-[72px] tracking-wide">
          Safer
        </span>
      </div>
    </div>
  );
}

function LittleText() {
  return (
    <div className="w-[512px] justify-start text-nearBlack text-2xl font-normal font-['Poppins'] leading-9 z-100">
      Local bike and scooter rentals for students, by students.{" "}
    </div>
  );
}

function JoinButton() {
  return (
    <div className="w-85 px-14 py-6 bg-waxwingGreen rounded-[40px] z-100">
      <div className="justify-self-center text-lighterGray text-2xl font-medium font-['Poppins']">
        Join the community
      </div>
    </div>
  );
}

function BikeImage() {
  return (
    <img className="w-[700px] h-[459px] rounded-[81px]" src="bikeImg.jpg" />
  );
}

function LowerSection() {
  return (
    <div>
      <div className="flex row w-full justify-center absolute bottom-25 gap-25">
        <div className="w-110 h-28 relative rounded-2xl outline outline-1 outline-offset-[-1px] outline-nearBlack backdrop-blur-lg overflow-hidden">
          <div className="left-[30px] top-[16px] absolute inline-flex justify-start items-start gap-6">
            <div data-style="Check" className="w-20 h-20 relative">
              <div className="w-20 h-20 left-0 top-0 absolute bg-waxwingGreen rounded-[100px]"></div>
              <div className="w-25 h-25 left-[28px] top-[28px] absolute">
                <img src="check.svg" alt="check mark icon" />
              </div>
            </div>
            <div className="w-64 justify-start text-nearBlack text-base font-normal font-['Poppins']">
              We’ve created a safe space to rent to trusted peers. All users are
              UMass verified.{" "}
            </div>
          </div>
        </div>
        <div className="w-110 h-28 relative rounded-2xl outline outline-1 outline-offset-[-1px] outline-nearBlack backdrop-blur-lg overflow-hidden">
          <div className="left-[30px] top-[16px] absolute inline-flex justify-start items-start gap-6">
            <div
              data-style="Avatar"
              className="w-20 h-20 relative bg-waxwingGreen rounded-[100px] overflow-hidden"
            >
              <img src="avatarCircle.svg" alt="person icon" />
            </div>
            <div className="w-64 justify-start text-nearBlack text-base font-normal font-['Poppins']">
              CampusBikes is built with care by a team of UMass Computer Science
              Students.
            </div>
          </div>
        </div>
        <div className="w-110 h-28 relative rounded-2xl outline outline-1 outline-offset-[-1px] outline-nearBlack backdrop-blur-lg overflow-hidden">
          <div className="left-[30px] top-[16px] absolute inline-flex justify-start items-start gap-6">
            <div className="w-20 h-20 relative overflow-hidden">
              <img src="chat2.svg" alt="chat bubble icon" />
            </div>
            <div className="w-64 justify-start text-nearBlack text-base font-normal font-['Poppins']">
              You can chat directly in our website to keep things safe and avoid
              fraud.
              <br />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div>
      <div className="relative">
        <NavBar />
        <div className="flex flex-col w-1/2 bg-lighterGray rounded-br-[25%] pl-[100px] pt-[50px] pb-[100px] gap-16 relative z=50">
          <BigText />
          <LittleText />
          <JoinButton />
        </div>
        <div className="absolute bottom-15 right-90 -z-10">
          <BikeImage />
        </div>
      </div>
      <LowerSection />
    </div>
  );
}
