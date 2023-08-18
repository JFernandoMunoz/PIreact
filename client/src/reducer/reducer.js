

const initialState = {
    searchResults: [],
    originalSearchResults: [],
    sortOrder: 'asc',
  };
  
  const recipesReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'SET_SEARCH_RESULTS':
        return { ...state, searchResults: action.payload };
      
      case 'SET_ORIGINAL_SEARCH_RESULTS':
      return {
        ...state,
        originalSearchResults: action.payload,
      };
      
      case 'SET_SORT_ORDER':
        return { ...state, sortOrder: action.payload };
      default:
        return state;
    }
  };
  
  export default recipesReducer;
  