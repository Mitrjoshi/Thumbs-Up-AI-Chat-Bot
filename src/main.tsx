import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home.tsx";
import Interact from "./pages/Interact.tsx";
import { Toaster } from "sonner";

const router = createBrowserRouter([
  {
    index: true,
    element: <Home />,
  },
  {
    path: "/interact",
    element: <Interact />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <>
    <div className="relative">
      <RouterProvider router={router} />
    </div>
    <Toaster position="top-center" />
  </>
);
