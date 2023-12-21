import Subtitle from '../Typography/Subtitle';
import PropTypes from 'prop-types';

function TitleCard({ title, children, topMargin, TopSideButtons }) {
  return (
    <div className={'card w-full p-6 bg-base-100 shadow-xl ' + (topMargin || 'mt-6')}>
      {/* Title for Card */}
      <Subtitle styleClass={TopSideButtons ? 'inline-block' : ''}>
        {title}

        {/* Top side button, show only if present */}
        {TopSideButtons && <div className='inline-block float-right'>{TopSideButtons}</div>}
      </Subtitle>

      <div className='divider mt-2'></div>

      {/** Card Body */}
      <div className='h-full w-full pb-6 bg-base-100'>{children}</div>
    </div>
  );
}

TitleCard.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  topMargin: PropTypes.string,
  TopSideButtons: PropTypes.node,
};

export default TitleCard;
