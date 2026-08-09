import { Outlet } from "react-router-dom";
import HostNav from "../components/HostNav";

export default function HostWithNav() {
  return (
    <>
      <HostNav />
      <Outlet />
    </>
  );
}
