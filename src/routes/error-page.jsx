import { FaExclamationCircle } from "react-icons/fa";
import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="h1 flex items-end mb-3">
        <FaExclamationCircle className="inline-block me-2" /> Oops!
      </h1>
      <h3 className="h3 mb-3">Sorry, an unexpected error has occurred.</h3>
      <p>Error: {error.statusText || error.message}</p>
    </div>
  );
}
