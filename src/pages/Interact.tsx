/* eslint-disable @typescript-eslint/no-unused-vars */
import { useRef, useState, useEffect, useCallback } from "react";
import { Pause, Play, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import StreamingAvatar, {
  AvatarQuality,
  StreamingEvents,
  TaskMode,
  TaskType,
  VoiceEmotion,
} from "@heygen/streaming-avatar";

const Interact = () => {
  const avatar = useRef<StreamingAvatar | null>(null);

  const [stream, setStream] = useState<MediaStream>();
  const mediaStream = useRef<HTMLVideoElement>(null);
  const [sessionStart, setSessionStart] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);

  const [avatarIsTalking, setAvatarIsTalking] = useState(false);
  const [status, setStatus] = useState("Record Now");
  const [streamLoaded, setStreamLoaded] = useState(false);

  const [initialTextSpoken, setInitialTextSpoken] = useState(false);

  const startCapturing = useCallback(async () => {
    if (sessionStart) return;

    setSessionStart(true);
    setStatus("Listening...");

    await avatar.current?.startVoiceChat();
  }, [sessionStart]);

  const stopCapturing = () => {
    setSessionStart(false);
    avatar.current?.closeVoiceChat();
    setStatus("Record...");
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
      setAvatarIsTalking(true);
    });

    avatar.current.on(StreamingEvents.AVATAR_STOP_TALKING, () => {
      closeAvatar();
      stopCapturing();
      setAvatarIsTalking(false);
      setInitialTextSpoken(true);
    });

    avatar.current.on(StreamingEvents.STREAM_DISCONNECTED, () => {});

    avatar.current?.on(StreamingEvents.STREAM_READY, async (event) => {
      setStream(event.detail);
    });

    avatar.current?.on(StreamingEvents.USER_START, () => {});

    avatar.current?.on(StreamingEvents.USER_STOP, () => {});

    avatar.current.on(StreamingEvents.USER_END_MESSAGE, () => {});

    try {
      await avatar.current.createStartAvatar({
        quality: AvatarQuality.High,
        avatarName: import.meta.env.VITE_HEYGEN_AVATAR_ID,
        language: "en",
        knowledgeId: import.meta.env.VITE_HEYGEN_KNOWLEDGE_ID,
        voice: {
          voiceId: import.meta.env.VITE_HEYGEN_VOICE_ID,
          rate: 1,
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
    return () => {
      closeAvatar();
    };
  }, []);

  const init = async () => {
    await avatar.current?.speak({
      text: `Hello, my beloved friend! It's your cheerful host, the Biggest Fan of Biryani in the World, ready to whisk you away on a delicious adventure! Tell me, what is your favorite type of biryani, and why does it make your heart dance with joy? You have just 15 seconds!`,
      task_type: TaskType.REPEAT,
      taskMode: TaskMode.SYNC,
    });
  };

  useEffect(() => {
    if (streamLoaded) {
      init();
    }
  }, [streamLoaded]);

  return (
    <div className="grid grid-rows-[90px,1fr,90px] h-[100dvh] relative">
      <div className="flex justify-start px-4 items-center">
        <img src="/thumbs-up.svg" alt="" className="h-[70px]" />
      </div>

      {userInteracted ? (
        <div className="h-full flex overflow-hidden relative">
          <video
            muted={false}
            ref={mediaStream}
            autoPlay={true}
            playsInline={true}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          >
            <track kind="captions" />
          </video>

          {mediaStream.current?.canPlayType &&
            streamLoaded &&
            initialTextSpoken && (
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
        <div className="flex justify-center gap-4 items-center">
          {mediaStream.current?.canPlayType && streamLoaded ? (
            initialTextSpoken && (
              <>
                <button
                  disabled={avatarIsTalking}
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

                <button
                  className="bg-[#ff2d21] p-4 rounded-full disabled:opacity-50"
                  onClick={() => {
                    window.location.reload();
                  }}
                >
                  <RotateCcw color="white" />
                </button>
              </>
            )
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
