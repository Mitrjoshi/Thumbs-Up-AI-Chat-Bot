/* eslint-disable @typescript-eslint/no-unused-vars */
import { useRef, useState, useEffect, useCallback } from "react";
import StreamingAvatar, {
  AvatarQuality,
  StreamingEvents,
  TaskMode,
  TaskType,
  VoiceEmotion,
} from "@heygen/streaming-avatar";
import { Pause, Play } from "lucide-react";
import { toast } from "sonner";

const Interact = () => {
  const avatar = useRef<StreamingAvatar | null>(null);
  const isStoppedRef = useRef<boolean>(false);

  const [stream, setStream] = useState<MediaStream>();
  const mediaStream = useRef<HTMLVideoElement>(null);
  const [sessionStart, setSessionStart] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);

  const [initialTextSpoken, setInitialTextSpoken] = useState(false);
  const [avatarIsTalking, setAvatarIsTalking] = useState(false);
  const [status, setStatus] = useState("Record Now");
  const [streamLoaded, setStreamLoaded] = useState(false);

  const startCapturing = useCallback(async () => {
    if (sessionStart) return;

    isStoppedRef.current = false;
    setSessionStart(true);
    setStatus("Listening...");

    await avatar?.current?.startVoiceChat();
  }, [sessionStart]);

  const stopCapturing = () => {
    setStatus("Record Now");
    avatar.current?.closeVoiceChat();
  };

  async function fetchAccessToken() {
    try {
      const res = await fetch(
        "https://api.heygen.com/v1/streaming.create_token",
        {
          method: "POST",
          headers: {
            "x-api-key": import.meta.env.VITE_HEYGEN_API_KEY,
          },
        }
      );
      const data = await res.json();
      const token = data.data.token;

      avatar.current = new StreamingAvatar({
        token,
      });

      return token;
    } catch (e: unknown) {
      toast("Error fetching access token:");
    }
  }

  const startSession = useCallback(async () => {
    const newToken = await fetchAccessToken();

    if (!avatar.current) return;

    avatar.current = new StreamingAvatar({
      token: newToken,
    });

    avatar.current.on(StreamingEvents.AVATAR_START_TALKING, () => {
      setStatus("Answering...");
      setAvatarIsTalking(true);
    });

    avatar.current.on(StreamingEvents.AVATAR_STOP_TALKING, () => {
      closeAvatar();
      setInitialTextSpoken(true);
      stopCapturing();
      setStatus("Record Now");
      setAvatarIsTalking(false);
    });

    avatar.current.on(StreamingEvents.STREAM_DISCONNECTED, () => {});

    avatar.current?.on(StreamingEvents.STREAM_READY, async (event) => {
      setStream(event.detail);
    });

    avatar.current?.on(StreamingEvents.USER_START, () => {
      if (!avatarIsTalking) {
        setStatus("Listening...");
      }
    });

    avatar.current?.on(StreamingEvents.USER_STOP, () => {});

    avatar.current.on(StreamingEvents.USER_END_MESSAGE, () => {
      setStatus("Processing...");
    });

    try {
      await avatar.current.createStartAvatar({
        quality: AvatarQuality.Low,
        avatarName: import.meta.env.VITE_HEYGEN_AVATAR_ID,
        language: "en",
        knowledgeId: "b88c9ae7d1134efda6b626e923104159",
        knowledgeBase: "Comedy",
        voice: {
          emotion: VoiceEmotion.EXCITED,
        },
      });
    } catch (e: unknown) {
      toast("Error starting avatar session");
    }
  }, [sessionStart]);

  const closeAvatar = () => {
    if (avatar.current) {
      avatar.current.closeVoiceChat();
    }
  };

  const handleUserInteraction = () => {
    setUserInteracted(true);
    startSession();
  };

  useEffect(() => {
    if (stream && mediaStream.current && userInteracted) {
      mediaStream.current.srcObject = stream;
      mediaStream.current.onloadedmetadata = () => {
        setStreamLoaded(true);
        mediaStream.current!.play().catch(() => {
          setStreamLoaded(false);
          toast.error("Error playing the stream");
        });
      };
    }
  }, [mediaStream, stream, userInteracted]);

  useEffect(() => {
    isStoppedRef.current = false;

    return () => {
      closeAvatar();
    };
  }, []);

  async function init() {
    try {
      await avatar?.current?.speak({
        taskType: TaskType.REPEAT,
        taskMode: TaskMode.SYNC,
        text: "Hey! welcome to Thumbs up toofani biryani hunt. Tell me why your favorite biryani is the best?",
      });
    } catch (e: unknown) {
      toast("Error speaking initial text:");
    }
  }

  async function outro() {
    try {
      await avatar?.current?.speak({
        taskType: TaskType.REPEAT,
        taskMode: TaskMode.SYNC,
        text: "Here is a coupon code for you to unlock a reward",
      });
    } catch (e: unknown) {
      toast("Error speaking initial text:");
    }
  }

  useEffect(() => {
    if (status === "Record Now" && sessionStart) {
      outro();
      setSessionStart(false);
    }
  }, [status, sessionStart]);

  useEffect(() => {
    if (streamLoaded) {
      init();
    }
  }, [streamLoaded]);

  return (
    <div className="grid grid-rows-[90px,1fr,90px] h-[100dvh]">
      <div className="flex justify-start px-4 items-center">
        <img src="/thumbs-up.svg" alt="" className="h-[70px]" />
      </div>

      {userInteracted ? (
        <div className="h-full flex overflow-hidden relative">
          <video
            muted={false}
            ref={mediaStream}
            autoPlay
            playsInline
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />

          {initialTextSpoken && (
            <p className="text-white font-bold absolute bottom-4 left-1/2 transform -translate-x-1/2">
              {status}
            </p>
          )}
        </div>
      ) : (
        <div className="flex justify-center items-center">
          <p className="text-white px-4 text-center">
            Click on the button below to start voice chat!
          </p>
        </div>
      )}

      {userInteracted ? (
        <div className="flex justify-center items-center">
          {mediaStream.current?.canPlayType && streamLoaded ? (
            <>
              <button
                disabled={!initialTextSpoken || avatarIsTalking}
                className="bg-[#ff2d21] p-4 rounded-full disabled:opacity-50"
                onClick={() => {
                  if (sessionStart) {
                    stopCapturing();
                  } else {
                    startCapturing();
                  }
                }}
              >
                {sessionStart ? (
                  <Pause fill="white" color="white" />
                ) : (
                  <Play fill="white" color="white" />
                )}
              </button>
            </>
          ) : (
            <div className="flex justify-center items-center absolute top-0 left-0 w-full h-full">
              <p className="text-white font-bold">Loading...</p>
            </div>
          )}
        </div>
      ) : (
        <div className="flex justify-center items-center px-4">
          <button
            className="bg-[#ff2d21] h-[40px] text-white font-bold w-[50%] max-w-[250px] rounded-full disabled:opacity-50"
            onClick={handleUserInteraction}
          >
            Start Chatting
          </button>
        </div>
      )}
    </div>
  );
};

export default Interact;
