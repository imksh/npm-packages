import { Outlet } from "react-router-dom";
import Header from "../ui/Header";

const PublicLayout = () => {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
};

export default PublicLayout;
