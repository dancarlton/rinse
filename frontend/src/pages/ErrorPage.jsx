import { Link } from "react-router-dom";
import { useRouteError } from "react-router-dom";

const ErrorPage = () => {
  const error = useRouteError();
  console.error(error);
  return (
    <>
      <div
        className="text-center"
        id="error-page">
        <h1 className="mb-4 text-6xl font-semibold text-red-500">
          {error.status}
        </h1>
        <p>
          <i>{error.statusText || error.message}</i>
        </p>
        <p className="mb-4 text-lg text-gray-600">
          Oops! Looks like something went wrong.
        </p>
        <div className="animate-bounce">
          <svg
            className="mx-auto h-16 w-16 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
          </svg>
        </div>
        <p className="mt-4 text-gray-600">
          Let&apos;s get you back{" "}
          <Link
            to="/"
            className="text-blue-500">
            home
          </Link>
          .
        </p>
      </div>
    </>
  );
};

export default ErrorPage;

