import { useRemoteVideo, useRemoteAudio } from '@huddle01/react/hooks';
import React, { useEffect, useRef } from 'react';

const RemotePeer = (props) => {
    console.log("RemotePeer Page", props.peerId)
    const { stream, state } = useRemoteVideo({ peerId: props.peerId });
    const { stream: audioStream } = useRemoteAudio({ peerId: props.peerId });
    const vidRef = useRef(null);
    const audioRef = useRef(null);


    useEffect(() => {
        if (stream && vidRef.current && state === "playable") {
            vidRef.current.srcObject = stream;

            vidRef.current.onloadedmetadata = async () => {
                try {
                    console.log("here 2");
                    vidRef.current?.play();
                } catch (error) {
                    console.error(error);
                }
            };

            vidRef.current.onerror = () => {
                console.error("videoCard() | Error is hapenning...");
            };
        }
    }, [stream, state]);


    useEffect(() => {
        if (audioStream && audioRef.current) {
            audioRef.current.srcObject = audioStream;
            audioRef.current.onloadedmetadata = async () => {
                try {
                    console.log("here 2");
                    audioRef.current?.play();
                } catch (error) {
                    console.error(error);
                }
            };

            audioRef.current.onerror = () => {
                console.error("AudioCard() | Error is hapenning...");
            };
        }
    }, [audioStream, state]);

    return (
        <div className="w-[90%] h-[160px] rounded-lg bg-black py-5 my-2">
            <video
                ref={vidRef}
                style={{ width: '100%', height: '100%' }}
                autoPlay
                muted
            ></video>
            <audio ref={audioRef} autoPlay></audio>
            {/* <button
                className="bg-blue-500 p-2 mx-2"
                onClick={async () => {
                    await LeaveRoom(props.peerId);
                }}
            >
                Leave Room
            </button> */}
        </div>
    );
};

export default React.memo(RemotePeer);
