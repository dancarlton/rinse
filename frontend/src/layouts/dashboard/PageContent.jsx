import Header from "./Header";
import { Route, Routes } from "react-router-dom";
import routes from "../../routes/sidebarRoutes";
import { useSelector } from "react-redux";
import { useEffect, useRef } from "react";
import ErrorPage from "../../pages/ErrorPage";

function PageContent() {
  const mainContentRef = useRef(null);
  const { pageTitle } = useSelector((state) => state.header);

  // Scroll back to top on new page load
  useEffect(() => {
    mainContentRef.current.scroll({
      top: 0,
      behavior: "smooth",
    });
  }, [pageTitle]);

  return (
    <div className="drawer-content flex flex-col ">
      <Header />
      <main
        className="flex-1 overflow-y-auto pt-8 px-6  bg-base-200"
        ref={mainContentRef}>
        <Routes>
          {routes.map((route, key) => {
            return (
              <Route
                key={key}
                exact={true}
                path={`${route.path}`}
                element={<route.component />}
                errorElement={<ErrorPage />}
              />
            );
          })}
        </Routes>
        <div className="h-16"></div>
      </main>
    </div>
  );
}

export default PageContent;
