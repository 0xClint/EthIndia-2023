import React, { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import protobuf from "protobufjs";
import {
  useWaku,
  useContentPair,
  useLightPush,
  useStoreMessages,
  useFilterMessages,
} from "@waku/react";
import Lottie from "react-lottie-player";
import { useDataMessage, useLocalPeer, usePeerIds } from '@huddle01/react/hooks';

const ChatBox = () => {
  const { account } = useMoralis();
  const [loader, setLoader] = useState(false);
  const [xmtp, setxmtp] = useState(true);
  const [message, setMessage] = useState("");
  const [activemessage , setactivemessages] = useState([]);
  // Create and start a Light Node
  const { node, isLoading } = useWaku();
  const peerIds = usePeerIds()
  const {
    peerId
  } = useLocalPeer();
  console.log("localPear", peerId)
  useEffect(() => {
    // console.log("isLoading : ", isLoading);
    console.log("node : ", node);
  }, [node, isLoading]);

  const { decoder, encoder } = useContentPair();

  // Query Store peers for past messages
  const { messages: storeMessages } = useStoreMessages({ node, decoder });

  // Receive messages from Filter subscription
  const { messages: filterMessages } = useFilterMessages({ node, decoder });

  // Send the message using Light Push
  const { push } = useLightPush({ node, encoder });
  // Create a message structure
  const ChatMessage = new protobuf.Type("ChatMessage")
    .add(new protobuf.Field("timestamp", 1, "uint64"))
    .add(new protobuf.Field("addr", 2, "string"))
    .add(new protobuf.Field("message", 3, "string"));

  //******************** Send Message Function
  const sendMessage = async () => {
    const tempMassage = ChatMessage.create({
      timestamp: Date.now(),
      addr: "0xvhsk",
      message: "Hello me!",
    });
    const serialisedMessage = ChatMessage.encode(tempMassage).finish();
    const timestamp = new Date();

    const { recipients, errors } = await push({
      payload: serialisedMessage,
      timestamp,
    });

    // Check for errors
    if (errors.length == 0) {
      console.log("MESSAGE PUSHED");
      console.log("receipient : " + recipients);
    } else {
      console.log("error : " + errors);
    }
  };


  const { sendData } = useDataMessage({
    onMessage: (payload, from, label) => {
      console.log("Received a message!");
      console.log("Message: ", payload);
      console.log("Sender: ", from);
      if (label) console.log("Label: ", label);
      setactivemessages([...activemessage , payload]);
      // your code here
    }
  });

  return (
    <div className="absolute downMenu flex justify-end right-14 bottom-0 z-10 text-black">
      {loader && (
        <div
          className="fixed top-0 w-screen h-screen flex justify-center items-center"
          style={{ background: "rgba(223, 223, 223, 0.22)" }}
        >
          {/* <Lottie
            loop
            animationData={loaderGif}
            play
            style={{
              width: 200,
              height: 200,
            }}
          /> */}
        </div>
      )}
      {xmtp ? (
        <div className="chat-container bg-white w-[500px] h-[90vh] flex rounded-lg ">
          <div className="chatContent flex flex-col justify-end w-full  text-2xl">
            <div className="chats flex flex-col m-2 text-white gap-2 font-vt overflow-y-scroll h-full">
              {activemessage
                ? activemessage.map((item) => {
                    return (
                      <div
                        className="flex"
                        style={{
                          justifyContent: `${
                            account == item?.senderAddress?.toLowerCase()
                              ? "end"
                              : "start"
                          }`,
                        }}
                        key={item}
                      >
                        <div className="bg-[#5A5A8E] inline-block px-3 rounded-md">
                          {item}
                        </div>
                      </div>
                    );
                  })
                : ""}
            </div>
            <div className="inputContainer flex mb-2 h-10">
              <input
                type="text"
                className="border border-black w-full px-2 h-10 rounded-md font-vt"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button
                // onClick={async () =>  sendData({ to: "*" , payload : "JSON.stringify(message)" , label : "Ankit" })}
                onClick={() => {
                  console.log("sending data")
                  sendData({
                    payload: message,
                    to: "*",
                    label: "chat"
                  })
                }}
                className="btn bg-[#589fd6] text-white mx-1 hover:bg-[#4299db]"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="chat-container w-[650px] h-[90vh]  bg-[#4a4a4a41] flex justify-center items-center">
          <button className="btn hover:scale-[102%]" onClick={() => connect()}>
            Connect XMTP
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatBox;
