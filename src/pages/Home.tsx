/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Home = () => {
  const navigate = useNavigate();

  const handleNavigate = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => track.stop());
      navigate("/interact");
    } catch (error: any) {
      if (error.name === "NotAllowedError") {
        toast("Microphone access is required to proceed. Please grant access.");
      } else if (error.name === "NotFoundError") {
        toast("No microphone device found. Please connect one to continue.");
      } else {
        toast(
          "An error occurred while requesting microphone access. Please try again."
        );
      }
    }
  };

  return (
    <div className="grid grid-rows-[1fr,90px] h-[100dvh] relative items-center justify-center py-10">
      <div className="w-full  h-full flex items-center justify-center z-[-9]">
        <img src="./thumbs-up.svg" className="w-[50%] aspect-square" alt="" />
      </div>

      <button
        onClick={handleNavigate}
        className="bg-[#ff2d21] px-12 py-2 rounded-full max-w-[250px] m-auto"
      >
        <p className="text-white font-bold text-lg">Get Started</p>
      </button>
    </div>
  );
};

export default Home;
