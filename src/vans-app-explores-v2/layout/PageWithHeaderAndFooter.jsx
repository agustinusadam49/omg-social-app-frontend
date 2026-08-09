import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function PageWithHeaderAndFooter() {
  return (
    <div className="site-wrapper">
      <Header />

      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
