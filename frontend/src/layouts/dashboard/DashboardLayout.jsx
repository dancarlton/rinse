import PageContent from './PageContent';
import LeftSidebar from './LeftSidebar';
import RightSidebar from './RightSidebar';
import ModalLayout from './ModalLayout';

function Layout() {
  return (
    <>
      {/* Left drawer - containing page content and side bar (always open) */}
      <div className='drawer drawer-mobile lg:drawer-open'>
        <input id='left-sidebar-drawer' type='checkbox' className='drawer-toggle' />
        <PageContent />
        <LeftSidebar />
      </div>

      {/* Right drawer - containing secondary content like notifications list etc.. */}
      <RightSidebar />

      {/* Modal layout container */}
      <ModalLayout />
    </>
  );
}

export default Layout;
