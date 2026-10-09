import {
    FaHome,
    FaUser,
    FaCog,
    FaBook
} from "react-icons/fa";

export const navigation = [
    {
        title: "Home",
        path: "/",
        icon: FaHome,
    },
    {
        title: "Courses",
        path: "/courses",
        icon: FaBook,
    },
    {
        title: "Profile",
        path: "/profile",
        icon: FaUser,
    },
    {
        title: "Settings",
        path: "/settings",
        icon: FaCog,
    },
];