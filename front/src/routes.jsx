import { createBrowserRouter } from "react-router-dom";
import Login from "./pages/login";
import Statistique from "./pages/components/admin/statistique";
import Employe from "./pages/components/admin/Employe";
import Projet from "./pages/components/admin/Projet";
import Dashboard from "./pages/components/dashboard";
import Client from "./pages/components/admin/Client";
import Formation from "./pages/components/admin/Formation";
import Profile from "./pages/components/admin/Profile";
import DashboardUser from './pages/components/dashboardUser'
import ProfileUser from "./pages/components/Users/ProfileUser";
import Projects from "./pages/components/Users/Projects";
import Tickets from "./pages/components/Users/Tickets";
import Schedules from "./pages/components/Users/Schedules";
import Formations from "./pages/components/Users/Formations";
import Users from "./pages/components/Users/Users";
import Sprints from "./pages/components/Users/Sprints";
import Setting from "./pages/components/admin/ProfileUser";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Login />,
    },
    {
        path: "/users",
        element: <DashboardUser />,
        children: [
            {
                path: "",
                element: <ProfileUser />,
            },
            {
                path: "projets",
                element: <Projects />,
            },
            {
                path: "tickets",
                element: <Tickets />,
            },
            {
                path: "schedules",
                element: <Schedules />,
            },
            {
                path: "formation",
                element: <Formations />,
            },
            {
                path: "users",
                element: <Users />,
            },
            
            {
                path: "sprints",
                element: <Sprints />,
            },

        ]
    },
    {
        path: "/dashboard",
        element: <Dashboard />,
        children: [
            {
                path: "",
                element: <Statistique />,
            },
            {
                path: "employes",
                element: <Employe />,
            },
            {
                path: "formation",
                element: <Formation />,
            },
            {
                path: "projet",
                element: <Projet />,
            },
            {
                path: "client",
                element: <Client />,
            },
            {
                path: "profil",
                element: <Profile />,
            },
            {
                path: "setting",
                element: <Setting />,
            },
            
        ],
    },
]);

export default router;
