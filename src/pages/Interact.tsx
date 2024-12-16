/* eslint-disable @typescript-eslint/no-unused-vars */
// import { useRef, useState, useEffect, useCallback } from "react";
// import StreamingAvatar, {
//   AvatarQuality,
//   StreamingEvents,
// TaskMode,
// TaskType,
// VoiceEmotion,
// } from "@heygen/streaming-avatar";
// import { Pause, Play } from "lucide-react";
// import { toast } from "sonner";
import HeygenEmbed from "../HeygenEmbeded";

const Interact = () => {
  // const avatar = useRef<StreamingAvatar | null>(null);
  // const isStoppedRef = useRef<boolean>(false);

  // const [stream, setStream] = useState<MediaStream>();
  // const mediaStream = useRef<HTMLVideoElement>(null);
  // const [sessionStart, setSessionStart] = useState(false);
  // const [userInteracted, setUserInteracted] = useState(false);

  // const [initialTextSpoken, setInitialTextSpoken] = useState(false);
  // const [avatarIsTalking, setAvatarIsTalking] = useState(false);
  // const [status, setStatus] = useState("Record Now");
  // const [streamLoaded, setStreamLoaded] = useState(false);

  // const startCapturing = useCallback(async () => {
  //   if (sessionStart) return;

  //   isStoppedRef.current = false;
  //   setSessionStart(true);
  //   setStatus("Listening...");

  //   await avatar?.current?.startVoiceChat();
  // }, [sessionStart]);

  // const stopCapturing = () => {
  //   avatar.current?.closeVoiceChat();
  // };

  // async function fetchAccessToken() {
  //   try {
  //     const res = await fetch(
  //       "https://api.heygen.com/v1/streaming.create_token",
  //       {
  //         method: "POST",
  //         headers: {
  //           "x-api-key": import.meta.env.VITE_HEYGEN_API_KEY,
  //         },
  //       }
  //     );
  //     const data = await res.json();
  //     const token = data.data.token;

  //     avatar.current = new StreamingAvatar({
  //       token,
  //     });

  //     return token;
  //   } catch (e: unknown) {
  //     toast("Error fetching access token:");
  //   }
  // }

  // const startSession = useCallback(async () => {
  //   const newToken = await fetchAccessToken();

  //   if (!avatar.current) return;

  //   avatar.current = new StreamingAvatar({
  //     token: newToken,
  //   });

  //   avatar.current.on(StreamingEvents.AVATAR_START_TALKING, () => {
  //     // setStatus("Answering...");
  //     setAvatarIsTalking(true);
  //   });

  //   avatar.current.on(StreamingEvents.AVATAR_STOP_TALKING, () => {
  //     closeAvatar();
  //     // setInitialTextSpoken(true);
  //     stopCapturing();
  //     // setStatus("Record Now");
  //     setAvatarIsTalking(false);
  //   });

  //   avatar.current.on(StreamingEvents.STREAM_DISCONNECTED, () => {});

  //   avatar.current?.on(StreamingEvents.STREAM_READY, async (event) => {
  //     setStream(event.detail);
  //   });

  //   avatar.current?.on(StreamingEvents.USER_START, () => {
  //     if (!avatarIsTalking) {
  //       // setStatus("Listening...");
  //     }
  //   });

  //   avatar.current?.on(StreamingEvents.USER_STOP, () => {});

  //   avatar.current.on(StreamingEvents.USER_END_MESSAGE, () => {
  //     // setStatus("Processing...");
  //   });

  //   try {
  //     await avatar.current.createStartAvatar({
  //       quality: AvatarQuality.Low,
  //       avatarName: import.meta.env.VITE_HEYGEN_AVATAR_ID,
  //       language: "en",
  //       knowledgeId: "7877a2e512c24f1fb923bf37cdd9e992",
  //       knowledgeBase: "TU - Biryani Bot",
  //       voice: {
  //         emotion: VoiceEmotion.FRIENDLY,
  //         voiceId: "1985984feded457b9d013b4f6551ac94",
  //         rate: 1.5,
  //       },
  //     });
  //   } catch (e: unknown) {
  //     toast("Error starting avatar session");
  //   }
  // }, [sessionStart]);

  // const closeAvatar = () => {
  //   if (avatar.current) {
  //     avatar.current.closeVoiceChat();
  //   }
  // };

  // const handleUserInteraction = () => {
  //   setUserInteracted(true);
  //   startSession();
  // };

  // useEffect(() => {
  //   if (stream && mediaStream.current && userInteracted) {
  //     mediaStream.current.srcObject = stream;
  //     mediaStream.current.onloadedmetadata = () => {
  //       setStreamLoaded(true);
  //       mediaStream.current!.play().catch(() => {
  //         setStreamLoaded(false);
  //         toast.error("Error playing the stream");
  //       });
  //     };
  //   }
  // }, [mediaStream, stream, userInteracted]);

  // useEffect(() => {
  //   isStoppedRef.current = false;

  //   return () => {
  //     closeAvatar();
  //   };
  // }, []);

  // const init = async () => {
  //   await avatar?.current?.startVoiceChat();
  // };

  // useEffect(() => {
  //   if (streamLoaded) {
  //     init();
  //   }
  // }, [streamLoaded]);

  return (
    <div className="grid grid-rows-[90px,1fr,90px] h-[100dvh] relative">
      <div className="flex justify-start px-4 items-center">
        <img src="/thumbs-up.svg" alt="" className="h-[70px]" />
      </div>

      <HeygenEmbed />
    </div>
  );
};

export default Interact;
