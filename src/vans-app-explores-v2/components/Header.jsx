import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header>
      <Link className="site-logo" to="/">
        #VANLIFE
      </Link>
      <nav>
        <Link to="/vans">Vans</Link>
        <Link to="/host">Host</Link>
        <Link to="/about">About</Link>
      </nav>
    </header>
  );
}
