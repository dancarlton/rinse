import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../slices/headerSlice';

function InternalPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: 'Generic' }));
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, []);

  return <div>Generic Page</div>;
}

export default InternalPage;
