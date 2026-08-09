import { Suspense } from "react";
import { Await } from "react-router-dom";

export default function SuspenseAndAwaitGlobal({
  fallback,
  resolveResult,
  children,
  errorElement,
}) {
  return (
    <Suspense fallback={fallback}>
      <Await resolve={resolveResult} errorElement={errorElement}>
        {children}
      </Await>
    </Suspense>
  );
}
