import { AVATAR_NFT_CONTRACT_ABI, AVATAR_NFT_CONTRACT_ADDRESS } from "./constants";
import { ethers } from "ethers";

// ******************WORLD NFT Function call****************************

export const createAvatarFunc = async (signer) => {
  const account = await signer.getAddress();
  const contract = new ethers.Contract(
    AVATAR_NFT_CONTRACT_ADDRESS,
    AVATAR_NFT_CONTRACT_ABI,
    signer
  );
  const artibute = {
    terit: {
      hair: {
        color: "black",
        style: "long"
      },
    }
  }
  const tx = await contract.createAvatar(account, "CID", "description", JSON.stringify(artibute));
  await tx.wait();
  console.log(tx)
};


export const updateUserAvatarImageFunc = async (signer) => {
  const account = await signer.getAddress();
  const contract = new ethers.Contract(
    AVATAR_NFT_CONTRACT_ADDRESS,
    AVATAR_NFT_CONTRACT_ABI,
    signer
  );
  const tx = await contract.updateUserAvatarImage("CID", "updated attribute");
  await tx.wait();
  console.log(tx)
};

export const setUserInfoFunc = async (signer) => {
  const account = await signer.getAddress();
  const contract = new ethers.Contract(
    AVATAR_NFT_CONTRACT_ADDRESS,
    AVATAR_NFT_CONTRACT_ABI,
    signer
  );
  const tx = await contract.setUserInfo(account, 1, 2, 3, 10);
  await tx.wait();
  console.log(tx)
};

export const setUserFriendsFunc = async (signer) => {
  const account = await signer.getAddress();
  const contract = new ethers.Contract(
    AVATAR_NFT_CONTRACT_ADDRESS,
    AVATAR_NFT_CONTRACT_ABI,
    signer
  );
  // const tx = await contract.setUserFriends(account, { ["add1", "add2", "add3", "add4"]});
  await tx.wait();
  console.log(tx)
};

export const fetchUserMetadataFunc = async (signer) => {
  const account = signer.getAddress();
  const contract = new ethers.Contract(
    AVATAR_NFT_CONTRACT_ADDRESS,
    AVATAR_NFT_CONTRACT_ABI,
    signer
  );
  try {
    const res = await contract.fetchUserMetadata(account);
    console.log("res : " + res);
  } catch (error) {
    console.log(error.errorArgs[0]);
    return "null";
  }
};
export const checkAvatarFunc = async (signer) => {
  const account = signer.getAddress();
  const contract = new ethers.Contract(
    AVATAR_NFT_CONTRACT_ADDRESS,
    AVATAR_NFT_CONTRACT_ABI,
    signer
  );
  try {
    const res = await contract.alreadyAvatarMinted(account);
    return res;
  } catch (error) {
    console.log(error.errorArgs[0]);
    return "null";
  }
};

// export const saveGame = async (signer, worldID, objData) => {
//   console.log(signer, objData);
//   const CID = await uploadWeb3(await makeFileObjects(objData));
//   console.log("CID : " + CID);
//   const account = signer.getAddress();
//   const contract = new ethers.Contract(
//     WORLD_CONTRACT_ADDRESS,
//     WORLD_CONTRACT_ABI,
//     signer
//   );
//   const tx = await contract.updateTokenURI(account, worldID, CID);
//   const receipt = await tx.wait();
//   console.log(receipt);
// };

// export const fetchGameData = async (signer) => {
//   const account = signer.getAddress();
//   const contract = new ethers.Contract(
//     WORLD_CONTRACT_ADDRESS,
//     WORLD_CONTRACT_ABI,
//     signer
//   );
//   try {
//     const res1 = await contract.getOwnerWorldIds(account);
//     // console.log(res1);
//     const res = await contract.fetchMetadata(account);
//     let data = [];
//     res.forEach((item) => {
//       data.push(JSON.parse(atob(item)));
//     });
//     console.log(data);
//     return [data, res1];
//   } catch (error) {
//     console.log(error.errorArgs[0]);
//     return "null";
//   }
// };
