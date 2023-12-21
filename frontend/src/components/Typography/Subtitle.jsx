import PropTypes from 'prop-types';

function Subtitle({ styleClass, children }) {
  return <div className={`text-xl font-semibold ${styleClass}`}>{children}</div>;
}

Subtitle.propTypes = {
  styleClass: PropTypes.string,
  children: PropTypes.node.isRequired,
};
export default Subtitle;
