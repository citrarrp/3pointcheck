// import { createContext, useReducer } from "react";

// const SearchContext = createContext();

// const firstState = {
//   data: [],
//   filteredQuery: "",
// };

// function reducer(state, action) {
//   switch (action.type) {
//     case "SET_DATA":
//       return { ...state, data: action.payload };
//     case "SET_FILTER":
//       return { ...state, filteredQuery: action.payload };
//     default:
//       return state;
//   }
// }

// export function SearchProvider({ children }) {
//   const [state, dispatch] = useReducer(reducer, firstState);

//   return (
//     <SearchContext.Provider value={{ state, dispatch }}>
//       {children}
//     </SearchContext.Provider>
//   );
// }

// import React, { useState, useEffect } from "react";

// import SearchWidget from "../utils/searchWidget";

// import { fetchApiData } from "../utils/function";

// export const SearchContext = React.createContext();

// function SearchPage() {
//   const [inputValue, setInputValue] = useState("");
//   const [searchResults, setSearchResults] = useState([]);

//   useEffect(() => {
//     const filteredResults = fetchApiData(inputValue);
//     setSearchResults(filteredResults);
//   }, [inputValue]);

//   return (
//     <div className="SearchPage">
//       <SearchContext.Provider
//         value={{
//           results: searchResults,
//           setInputValue: setInputValue,
//         }}
//       >
//         <SearchWidget />
//       </SearchContext.Provider>
//     </div>
//   );
// }

// export default SearchPage;
