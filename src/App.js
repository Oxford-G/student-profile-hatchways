import './App.css';
import * as React from 'react';
import axios from 'axios';
import { List } from './List';
import { InputWithLabel } from './InputWithLabel';

const storiesReducer = (state, action) => {
  switch (action.type) {
    case 'STORIES_FETCH_INIT':
      return {
      ...state,
      isLoading: true,
      isError: false,
      };
    case 'STORIES_FETCH_SUCCESS':
      return {
      ...state,
      isLoading: false,
      isError: false,
      data: action.payload,
      };
    case 'STORIES_FETCH_FAILURE':
      return {
      ...state,
      isLoading: false,
      isError: true,
    };
  default:
    throw new Error();
  }
};

const API_ENDPOINT = 'https://api.hatchways.io/assessment/students';

const App = () => {

  const [searchTerm, setSearchTerm] = React.useState('');
  // const [filterTag, setFilterTag] = React.useState('tag');

  const allArray = [];
  const [stories, dispatchStories] = React.useReducer(storiesReducer,
    { data: [], isLoading: false, isError: false });

  const handleFetch = React.useCallback( async () => {

    dispatchStories({ type: 'STORIES_FETCH_INIT' });

    try {
      const result = await axios.get(API_ENDPOINT);

      dispatchStories({
        type: 'STORIES_FETCH_SUCCESS',
        payload: result.data.students,
      });
      

    } catch {
      dispatchStories({ type: 'STORIES_FETCH_FAILURE' });
    }
  }, [])

  React.useEffect(() => {
    handleFetch()
  }, [handleFetch]);

  const handleSearchInput = (event) => {
    setSearchTerm(event.target.value);
  };

  // const handleTagSearch = (event) => {
  //   setFilterTag(event.target.value);
  // };

  const searchedStories = stories.data.filter((story) => 
    (story.firstName.toLowerCase().includes(searchTerm.toLowerCase())) 
      || (story.lastName.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  // const filterTags = allArray.filter((el)=> 
  //   el.toLowerCase().includes(filterTag.toLowerCase())
  // )

  // const combineSearch = searchedStories.concat(filterTags)
  // console.log(combineSearch)

  return (
    <div className="App">
      <h1 className="header">MY STUDENTS PROFILE</h1>

      <InputWithLabel
        id="search"
        value={searchTerm}
        onInputChange={handleSearchInput}
        isFocused
        placeholder="Search by name"
      />

      <hr />

      {/* <InputWithLabel
        id="tag"
        value={filterTag}
        onInputChange={handleTagSearch}
        placeholder="Search by tag"
      /> */}

      {/* <hr /> */}

      {stories.isError && <p>Something went wrong ...</p>}

      {stories.isLoading ? (
        <p>Loading ...</p>
        ) : (
        <List
        list={searchedStories}
        allArray={allArray}
        />
      )}

    </div>
  );
}

export default App;
export { storiesReducer };
