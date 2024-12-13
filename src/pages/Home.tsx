import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-end h-[100dvh] py-20">
      <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center z-[-9]">
        <img src="./thumbs-up.svg" className="w-[50%] aspect-square" alt="" />
      </div>
      <Link className="bg-[#ff2d21] px-12 py-2 rounded-full" to="/interact">
        <p className="text-white font-bold text-lg">Get Started</p>
      </Link>
    </div>
  );
};

export default Home;
