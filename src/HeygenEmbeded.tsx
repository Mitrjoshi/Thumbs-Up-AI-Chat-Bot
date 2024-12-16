/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";

const HeygenEmbed = () => {
  useEffect(() => {
    if (typeof window !== "undefined") {
      const host = "https://labs.heygen.com",
        url = `${host}/guest/streaming-embed?share=eyJxdWFsaXR5IjoiaGlnaCIsImF2YXRhck5hbWUiOiJUeWxlci1pbnNoaXJ0LTIwMjIwNzIxLXYy%0D%0AIiwicHJldmlld0ltZyI6Imh0dHBzOi8vZmlsZXMyLmhleWdlbi5haS9hdmF0YXIvdjMvNzliMjQ1%0D%0ANTYxYWQ0NDhlNzk2YjdlNzdjZDI3NzNkMGJfMTQyNjMvcHJldmlld190YWxrXzIud2VicCIsIm5l%0D%0AZWRSZW1vdmVCYWNrZ3JvdW5kIjp0cnVlLCJrbm93bGVkZ2VCYXNlSWQiOiI3ODc3YTJlNTEyYzI0%0D%0AZjFmYjkyM2JmMzdjZGQ5ZTk5MiIsInVzZXJuYW1lIjoiYzY2NmZjYzZkNzlhNDhlNDgxOGU5YzJh%0D%0AMGZmNGRjNmYifQ%3D%3D&inIFrame=1`; // Add full URL here
      const clientWidth = document.body.clientWidth;

      const wrapDiv = document.createElement("div");
      wrapDiv.id = "heygen-streaming-embed";

      const container = document.createElement("div");
      container.id = "heygen-streaming-container";

      const stylesheet = document.createElement("style");
      const dynamicStyles =
        clientWidth < 540
          ? "height: 266px; width: 96%; left: 50%;"
          : "height: 366px; width: calc(366px * 16 / 9);";
      stylesheet.innerHTML = `
        #heygen-streaming-embed {
          z-index: 9999;
          position: absolute;
          left: 50%;
          bottom: 50%;
          transform: translate(-50%, 50%);
          width: 200px;
          height: 200px;
          border-radius: 50%;
          border: 2px solid #fff;
          box-shadow: 0px 8px 24px 0px rgba(0, 0, 0, 0.12);
          transition: all linear 0.1s;
          overflow: hidden;
          opacity: 0;
          visibility: hidden;
        }
        #heygen-streaming-embed.show {
          opacity: 1;
          visibility: visible;
        }
        #heygen-streaming-embed.expand {
          ${dynamicStyles}
          border: 0;
          border-radius: 8px;
        }
        #heygen-streaming-container {
          width: 100%;
          height: 100%;
        }
        #heygen-streaming-container iframe {
          width: 100%;
          height: 100%;
          border: 0;
        }
      `;

      const iframe = document.createElement("iframe");
      iframe.allowFullscreen = false;
      iframe.title = "Streaming Embed";
      iframe.role = "dialog";
      iframe.allow = "microphone";
      iframe.src = url;

      let visible = false,
        initial = false;

      const handleMessage = (e: any) => {
        if (e.origin === host && e.data && e.data.type === "streaming-embed") {
          if (e.data.action === "init") {
            initial = true;
            wrapDiv.classList.toggle("show", initial);
          } else if (e.data.action === "show") {
            visible = true;
            wrapDiv.classList.toggle("expand", visible);
          } else if (e.data.action === "hide") {
            visible = false;
            wrapDiv.classList.toggle("expand", visible);
          }
        }
      };

      window.addEventListener("message", handleMessage);

      container.appendChild(iframe);
      wrapDiv.appendChild(stylesheet);
      wrapDiv.appendChild(container);
      document.body.appendChild(wrapDiv);

      return () => {
        window.removeEventListener("message", handleMessage);
        document.body.removeChild(wrapDiv);
      };
    }
  }, []);

  return null;
};

export default HeygenEmbed;
