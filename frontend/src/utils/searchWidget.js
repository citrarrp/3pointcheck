import React from "react";

import SearchInput from "../components/search_Input";
import SearchResults from "../context/search";

function SearchWidget() {
  return (
    <div className="SearchWidget">
      <SearchInput />
      <SearchResults />
    </div>
  );
}

export default SearchWidget;