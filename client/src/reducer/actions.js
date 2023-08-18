// actions/recipesActions.js

export const setSearchResults = (results) => ({
    type: 'SET_SEARCH_RESULTS',
    payload: results,
  });
  
  export const setSortOrder = (order) => ({
    type: 'SET_SORT_ORDER',
    payload: order,
  });

  export const setOriginalSearchResults = (results) => {
    return {
      type: 'SET_ORIGINAL_SEARCH_RESULTS',
      payload: results,
    };
  };
  