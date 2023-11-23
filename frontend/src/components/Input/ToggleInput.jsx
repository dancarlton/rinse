import { useState } from 'react';
import PropTypes from 'prop-types';

function ToogleInput({
  labelTitle,
  labelStyle,
  type,
  containerStyle,
  defaultValue,
  placeholder,
  updateFormValue,
  updateType,
}) {
  const [value, setValue] = useState(defaultValue);

  const updateToogleValue = () => {
    setValue(!value);
    updateFormValue({ updateType, value: !value });
  };

  return (
    <div className={`form-control w-full ${containerStyle}`}>
      <label className="label cursor-pointer">
        <span className={'label-text text-base-content ' + labelStyle}>{labelTitle}</span>
        <input
          type="checkbox"
          className="toggle"
          checked={value}
          onChange={(e) => updateToogleValue()}
        />
      </label>
    </div>
  );
}

ToogleInput.propTypes = {
  labelTitle: PropTypes.string.isRequired,
  labelStyle: PropTypes.string,
  type: PropTypes.string,
  containerStyle: PropTypes.string,
  defaultValue: PropTypes.bool,
  placeholder: PropTypes.string,
  updateFormValue: PropTypes.func.isRequired,
  updateType: PropTypes.string.isRequired,
};

export default ToogleInput;
