import React, { useState, useEffect } from "react";
import ConnectWallet from "./ConnectWallet";
import { ethers } from "ethers";
import Loader from "./Loader";

const Header = () => {
  const [loader, setLoader] = useState(false);

  return (
    <div className="absolute z-10 top-0 w-screen flex flex-col">
      <div className="w-full flex text-[2rem] justify-between items-center h-16 px-5 ">
        <div className="flex gap-4 items-center">
          <div className="leading-7 m-0 p-0">
            {/* <img src={blockCraftName} className="h-8  " /> */}ARCAVE
          </div>
        </div>

        <div className="flex items-center justify-center gap-3">
          <ConnectWallet />
        </div>
      </div>
      {loader && <Loader />}
    </div>
  );
};

export default Header;
