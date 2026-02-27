export default function Loading({
  children,
  onlyLoadingName = false,
  loadingName = "Loading",
}) {
  if (children) return children;

  return onlyLoadingName ? (
    <h1>{loadingName}</h1>
  ) : (
    <h1>Loading get {loadingName} data ...</h1>
  );
}
