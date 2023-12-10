import React, { useState, useEffect } from "react";
import ConnectWallet from "./ConnectWallet";
import { ethers } from "ethers";
import Loader from "./Loader";
import {
  checkAvatarFunc,
  createAvatarFunc,
  fetchUserMetadataFunc,
  setUserFriendsFunc,
  setUserInfoFunc,
  updateUserAvatarImageFunc,
} from "../utils/functionCall";

const Header = () => {
  const [loader, setLoader] = useState(false);

  return (
    <div className="absolute z-10 top-0 w-screen flex flex-col">
      <div className="w-full flex text-[2rem] justify-between items-center h-16 px-5 ">
        <div className="flex gap-4 items-center">
          <div className="leading-7 m-0 p-0 font-bold text-white">
            {/* <img src={blockCraftName} className="h-8  " /> */}ARCAVE
          </div>
        </div>

        <div className="flex items-center justify-center gap-3">
          <button
            className="btn w-[80px] bg-[#5295c9f4] hover:scale-[102%]"
            onClick={() => createAvatar()}
          >
            Save
          </button>
          <ConnectWallet />
        </div>
      </div>
      {loader && <Loader />}
    </div>
  );
};

export default Header;

// const fetchUserMetaData = async () => {
//   try {
//     const provider = new ethers.providers.Web3Provider(window.ethereum);
//     await provider.send("eth_requestAccounts", []);
//     const signer = await provider.getSigner();
//     await fetchUserMetadataFunc(signer);
//   } catch (error) {
//     console.log(error);
//   }
// };

// const updateUserAvatarImage = async () => {
//   setLoader(true);
//   try {
//     const provider = new ethers.providers.Web3Provider(window.ethereum);
//     await provider.send("eth_requestAccounts", []);
//     const signer = await provider.getSigner();
//     await updateUserAvatarImageFunc(signer);
//     setLoader(false);
//   } catch (error) {
//     console.log(error);
//   }
// };
// const setUserInfo = async () => {
//   setLoader(true);
//   try {
//     const provider = new ethers.providers.Web3Provider(window.ethereum);
//     await provider.send("eth_requestAccounts", []);
//     const signer = await provider.getSigner();
//     await setUserInfoFunc(signer);
//     setLoader(false);
//   } catch (error) {
//     console.log(error);
//   }
// };
// const setUserFriends = async () => {
//   setLoader(true);
//   try {
//     const provider = new ethers.providers.Web3Provider(window.ethereum);
//     await provider.send("eth_requestAccounts", []);
//     const signer = await provider.getSigner();
//     await setUserFriendsFunc(signer);
//     setLoader(false);
//   } catch (error) {
//     console.log(error);
//   }
// };
