import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../features/common/headerSlice";
import Generic from "../../features/generic";

function InternalPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: "Generic" }));
  /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, []);

  return <Generic />;
}

export default InternalPage;
