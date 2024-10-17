import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import RootLayout from "./pages/layout/RootLayout.tsx";
import HomePage from "./pages/Home.tsx";

// define the routes here
const router = createBrowserRouter([
  {
    element: <RootLayout />,
    errorElement: <>404 Not Found</>,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
