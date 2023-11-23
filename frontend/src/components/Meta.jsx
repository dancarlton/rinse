import { Helmet } from 'react-helmet-async';
import PropTypes from 'prop-types';

const Meta = ({ title, description, keywords }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
    </Helmet>
  );
};

Meta.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  keywords: PropTypes.string.isRequired,
};

Meta.defaultProps = {
  title: 'Rinse - Lorem Ipsum',
  description: 'Rinse me',
  keywords: 'cars',
};
export default Meta;
