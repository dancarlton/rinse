import PropTypes from "prop-types";

const Avatar = ({ source, name }) => {
  return (
    <div className="avatar online">
      <div className="w-24 h-24 rounded-full overflow-hidden">
        <img
          src={source || "/images/icons/avatar-missing.jpg"}
          alt={`${name}'s Avatar`}
          className="object-cover w-full h-full"
        />
      </div>
    </div>
  );
};

Avatar.propTypes = {
  source: PropTypes.string,
  name: PropTypes.string,
};


export default Avatar;
