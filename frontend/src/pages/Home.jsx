import React, { useState } from "react";
import { Header } from "../components";
import { bgImg } from "../assets";
import { Link } from "react-router-dom";

const Home = () => {
  const [gameMenu, setGameMenu] = useState(false);
  const [mapMenu, setMapMenu] = useState(false);

  return (
    <div>
      <img src={bgImg} className="absolute -z-10 h-screen w-screen" />
      <Header />
      {gameMenu ? (
        mapMenu ? (
          <div className="make-flex justify-start pt-28 w-screen h-screen flex-col">
            <h1 className="text-[3rem] font-bold">Arcverse</h1>
            <div className="w-screen mx-auto h-[300px] make-flex gap-14">
              <Link
                to="/game"
                className="make-flex  flex-col card-container gap-6 w-[280px] h-[280px] hover:scale-[103%] text-base cursor-pointer"
              >
                <div className="w-[200px] h-[170px] overflow-hidden rounded-lg">
                  <img src={bgImg} className="h-[100%] " />
                </div>
                <h2 className="text-[1.3rem]">Map1</h2>
              </Link>
              <div className="make-flex  flex-col card-container gap-6 w-[280px] h-[280px] hover:scale-[103%] text-base cursor-pointer">
                <div className="w-[200px] h-[170px] overflow-hidden rounded-lg">
                  <img src={bgImg} className="h-[100%] " />
                </div>
                <h2 className="text-[1.3rem]">Map2</h2>
              </div>
            </div>
          </div>
        ) : (
          <div className="make-flex justify-start pt-28 w-screen h-screen flex-col">
            <h1 className="text-[3rem] font-bold">Arcave</h1>
            <div className="w-screen mx-auto h-[300px] make-flex gap-14">
              <button
                onClick={() => setMapMenu(true)}
                className="make-flex  flex-col card-container gap-6 w-[280px] h-[280px] hover:scale-[103%] text-base"
              >
                <div className="w-[200px] h-[170px] overflow-hidden rounded-lg">
                  <img src={bgImg} className="h-[100%] " />
                </div>
                <h2 className="text-[1.3rem]">Arverse</h2>
              </button>
              <a
                href="#"
                className="make-flex  flex-col card-container gap-6 w-[280px] h-[280px] hover:scale-[103%] text-base"
              >
                <div className="w-[200px] h-[170px] overflow-hidden rounded-lg">
                  <img src={bgImg} className="h-[100%] " />
                </div>
                <h2 className="text-[1.3rem]">Arzone</h2>
              </a>

              <div className="make-flex  flex-col card-container gap-6 w-[280px] h-[280px] hover:scale-[103%] text-base">
                <div className="w-[200px] h-[170px] overflow-hidden rounded-lg">
                  <img src={bgImg} className="h-[100%] " />
                </div>
                <h2 className="text-[1.3rem]">Setting</h2>
              </div>
            </div>
          </div>
        )
      ) : (
        <div className="make-flex justify-start pt-28 w-screen h-screen flex-col">
          <h1 className="text-[3rem] font-bold">Arcave</h1>
          <div className="w-screen mx-auto h-[300px] make-flex gap-14">
            <div className="make-flex flex-col card-container gap-2 w-[450px] h-[280px] hover:scale-102 text-base">
              <h2 className="mb-10 text-[2rem]">Welcome Arcborg</h2>
              <button
                onClick={() => setGameMenu(true)}
                className="btn w-[90%] text-[1.8rem] py-5 mx-10 hover:scale-[102%] text-center"
              >
                Start
              </button>
              <p>Note : Connect first</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
