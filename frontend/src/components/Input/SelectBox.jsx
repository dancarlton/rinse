import React, { useState } from "react";
import InformationCircleIcon from "@heroicons/react/24/outline/InformationCircleIcon";
import PropTypes from "prop-types";

function SelectBox(props) {
  const {
    labelTitle,
    labelDescription,
    defaultValue,
    containerStyle,
    placeholder,
    labelStyle,
    options,
    updateType,
    updateFormValue,
  } = props;

  const [value, setValue] = useState(defaultValue || "");

  const updateValue = (newValue) => {
    updateFormValue({ updateType, value: newValue });
    setValue(newValue);
  };

  return (
    <div className={`inline-block ${containerStyle}`}>
      <label className={`label  ${labelStyle}`}>
        <div className="label-text">
          {labelTitle}
          {labelDescription && (
            <div
              className="tooltip tooltip-right"
              data-tip={labelDescription}>
              <InformationCircleIcon className="w-4 h-4" />
            </div>
          )}
        </div>
      </label>

      <select
        className="select select-bordered w-full"
        value={value}
        onChange={(e) => updateValue(e.target.value)}>
        <option
          disabled
          value="PLACEHOLDER">
          {placeholder}
        </option>
        {options.map((o, k) => {
          return (
            <option
              value={o.value || o.name}
              key={k}>
              {o.name}
            </option>
          );
        })}
      </select>
    </div>
  );
}

SelectBox.propTypes = {
  labelTitle: PropTypes.string.isRequired,
  labelDescription: PropTypes.string,
  defaultValue: PropTypes.string,
  containerStyle: PropTypes.string,
  placeholder: PropTypes.string,
  labelStyle: PropTypes.string,
  options: PropTypes.array.isRequired,
  updateType: PropTypes.string.isRequired,
  updateFormValue: PropTypes.func.isRequired,
};

export default SelectBox;
