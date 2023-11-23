import { useState } from 'react';
import PropTypes from 'prop-types';

function TextAreaInput({
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

  const updateInputValue = (val) => {
    setValue(val);
    updateFormValue({ updateType, value: val });
  };

  return (
    <div className={`form-control w-full ${containerStyle}`}>
      <label className="label">
        <span className={'label-text text-base-content ' + labelStyle}>{labelTitle}</span>
      </label>
      <textarea
        value={value}
        className="textarea textarea-bordered w-full"
        placeholder={placeholder || ''}
        onChange={(e) => updateInputValue(e.target.value)}
      ></textarea>
    </div>
  );
}

TextAreaInput.propTypes = {
  labelTitle: PropTypes.string.isRequired,
  labelStyle: PropTypes.string,
  type: PropTypes.string,
  containerStyle: PropTypes.string,
  defaultValue: PropTypes.string,
  placeholder: PropTypes.string,
  updateFormValue: PropTypes.func.isRequired,
  updateType: PropTypes.string.isRequired,
};

export default TextAreaInput;
