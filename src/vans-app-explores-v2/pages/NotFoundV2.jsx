import { Link, useRouteError } from "react-router-dom";

export default function NotFoundV2() {
  const error = useRouteError();

  const errorMessage = error?.message ?? null;

  return (
    <div className="not-found-container">
      {errorMessage ? (
        <h1>{errorMessage}</h1>
      ) : (
        <h1>Sorry, the page you were looking for was not found.</h1>
      )}

      <Link to="/" className="link-button">
        Return to home
      </Link>
    </div>
  );
}
