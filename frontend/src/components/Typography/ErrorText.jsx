import PropTypes from 'prop-types';

function ErrorText({ styleClass, children }) {
  return <p className={`text-center  text-error ${styleClass}`}>{children}</p>;
}

ErrorText.propTypes = {
  styleClass: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export default ErrorText;
