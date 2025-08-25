import { Outlet } from "react-router-dom";
import Nav from "./Nav";

const LayoutwithNav = () => {
  return (
    <>
      <Outlet />
      <Nav />
    </>
  );
}

export default LayoutwithNav
