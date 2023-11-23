import { Link, useRouteError, useNavigate } from 'react-router-dom';

const ErrorPage = () => {
  const error = useRouteError();
  console.error(error);
  const navigate = useNavigate();

  return (
    <>
      <div className="text-center" id="error-page">
        {error ? (
          <>
            <h1 className="mb-4 text-6xl font-semibold text-red-500">{error.status}</h1>
            <p>
              <i>{error.statusText || error.message}</i>
            </p>
          </>
        ) : (
          <>
            <h1 className="mb-4 text-6xl font-semibold text-red-500">404</h1>
            <p>Not Found. No specific error was provided.</p>
          </>
        )}
        <p className="mb-4 text-lg text-gray-600">Oops! Looks like something went wrong.</p>
        <div className="animate-bounce">
          <svg
            className="mx-auto h-16 w-16 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
            ></path>
          </svg>
        </div>
        <p className="mt-4 text-gray-600">
          Let&apos;s get you back{' '}
          <Link to="/" className="link">
            home
          </Link>
          .
        </p>
        <h3>OR</h3>
        <button
          type="button" // HTML way of saying e.preventDefault()
          className="btn btn-primary mt-2"
          onClick={() => {
            navigate(-1);
          }}
        >
          Go Back One Page
        </button>
      </div>
    </>
  );
};

export default ErrorPage;
