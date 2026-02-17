export default function Loading({ children, loadingName = "Loading" }) {
  if (children) return children;

  return loadingName !== "Loading" ? (
    <h1>Loading get {loadingName} data ...</h1>
  ) : (
    <h1>{loadingName}</h1>
  );
}
