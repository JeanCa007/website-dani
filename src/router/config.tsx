import type { RouteObject } from "react-router-dom";
import NotFound from "../pages/NotFound";
import Home from "../pages/home/page";
import CV from "../pages/cv/page";
import Research from "../pages/research/page";
import Publications from "../pages/publications/page";
import Teaching from "../pages/teaching/page";
import Contact from "../pages/contact/page";
import Admin from "../pages/admin/page";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/cv",
    element: <CV />,
  },
  {
    path: "/research",
    element: <Research />,
  },
  {
    path: "/publications",
    element: <Publications />,
  },
  {
    path: "/teaching",
    element: <Teaching />,
  },
  {
    path: "/contact",
    element: <Contact />,
  },
  {
    path: "/admin",
    element: <Admin />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

export default routes;