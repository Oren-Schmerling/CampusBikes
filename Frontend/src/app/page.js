import NavBar from "@/components/nav/navBar";
import Link from "next/link";

function BigText() {
  return (
    <div className="justify-start">
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
    <div className="w-[512px] justify-start text-nearBlack text-2xl font-normal font-['Poppins'] leading-9">
      Local bike and scooter rentals for students, by students.{" "}
    </div>
  );
}

function JoinButton() {
  return (
    <Link href="/signup">
      <div className="w-85 px-14 py-6 bg-waxwingGreen rounded-[40px] hover:bg-waxwingLightGreen hover:cursor-pointer active:bg-waxwingDarkGreen active:cursor-pointer">
        <div className="justify-self-center text-lighterGray text-2xl font-medium font-['Poppins']">
          Join the community
        </div>
      </div>
    </Link>
  );
}

function FeatureCard({ icon, children }) {
  return (
    <div className="w-110 min-h-28 rounded-2xl outline outline-1 outline-offset-[-1px] outline-nearBlack backdrop-blur-lg">
      <div className="px-[30px] py-4 flex justify-start items-start gap-6">
        <div className="w-20 h-20 flex-shrink-0">
          {icon}
        </div>
        <div className="flex-1 text-nearBlack text-base font-normal font-['Poppins']">
          {children}
        </div>
      </div>
    </div>
  );
}

function CheckIcon() {
  return (
    <div className="w-20 h-20 relative">
      <div className="w-20 h-20 absolute bg-waxwingGreen rounded-full"></div>
      <div className="w-25 h-25 absolute left-[28px] top-[28px]">
        <img src="check.svg" alt="check mark icon" />
      </div>
    </div>
  );
}

function AvatarIcon() {
  return (
    <div className="w-20 h-20 bg-waxwingGreen rounded-full overflow-hidden flex items-center justify-center">
      <img src="avatarCircle.svg" alt="person icon" />
    </div>
  );
}

function ChatIcon() {
  return (
    <div className="w-20 h-20 overflow-hidden flex items-center justify-center">
      <img src="chat2.svg" alt="chat bubble icon" />
    </div>
  );
}

function BikeImage() {
  return (
    <img className="w-[700px] h-[459px] rounded-[81px]" src="bikeImg.jpg" />
  );
}

function HeroSection() {
  return (
    <section className="relative min-h-screen">
      <NavBar />
      <div className="flex flex-col w-1/2 bg-lighterGray rounded-br-[25%] pl-[100px] pt-[50px] pb-[100px] gap-16 relative z-50">
        <BigText />
        <LittleText />
        <JoinButton />
      </div>
      <div className="absolute bottom-15 right-90 z-10">
        <BikeImage />
      </div>
    </section>
  );
}

function FeaturesSection() {
  return (
    <section className="w-full py-25">
      <div className="flex flex-row w-full justify-center gap-25">
        <FeatureCard icon={<CheckIcon />}>
          We've created a safe space to rent to trusted peers. All users are
          UMass verified.
        </FeatureCard>

        <FeatureCard icon={<AvatarIcon />}>
          CampusBikes is built with care by a team of UMass Computer Science
          Students.
        </FeatureCard>

        <FeatureCard icon={<ChatIcon />}>
          You can chat directly in our website to keep things safe and avoid
          fraud.
        </FeatureCard>
      </div>
    </section>
  );
}

// Main Page Component
export default function Home() {
  return (
    <div className="relative min-h-screen">
      <HeroSection />
      <FeaturesSection />
    </div>
  );
}