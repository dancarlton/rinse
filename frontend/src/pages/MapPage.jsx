import React from "react";
import PropTypes from "prop-types";
import AutoComplete from "../components/AutoComplete";
import Map from "../components/Map";

const SearchPage = (props) => {
  return (
    <>
      <AutoComplete />
      <div>SearchPage</div>
	  <Map />
    </>
  );
};

SearchPage.propTypes = {};

export default SearchPage;
