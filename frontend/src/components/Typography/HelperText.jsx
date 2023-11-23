import PropTypes from 'prop-types';

function HelperText({ className, children }) {
  return <div className={`text-slate-400 ${className}`}>{children}</div>;
}

HelperText.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export default HelperText;
