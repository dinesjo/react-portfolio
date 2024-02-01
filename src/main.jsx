import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import Root from "./routes/root";
import Home from "./Home.jsx";
import Contact from "./Contact.jsx";
import Projects from "./Projects";
import ErrorPage from "./routes/error-page";
import Courses from "./Courses.jsx";

const router = createBrowserRouter(
  [
    {
      path: "",
      element: <Root />,
      errorElement: <ErrorPage />,
      children: [
        {
          path: "",
          element: <Home />,
        },
        {
          path: "/contact",
          element: <Contact />,
        },
        {
          path: "/projects",
          element: <Projects />,
        },
        {
          path: "/courses",
          element: <Courses />,
        },
      ],
    },
  ],
  { basename: import.meta.env.DEV ? "/" : "/react-portfolio/" }
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* Navbar */}
    <RouterProvider router={router} />
  </React.StrictMode>
);
