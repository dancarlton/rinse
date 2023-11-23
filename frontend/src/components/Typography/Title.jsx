import PropTypes from 'prop-types';

function Title({ className, children }) {
  return <p className={`text-2xl font-bold  ${className}`}>{children}</p>;
}

Title.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export default Title;
