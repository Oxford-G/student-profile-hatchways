import './App.css';
import * as React from 'react';
import axios from 'axios';

// const useSemiPersistentState = (key, initialState) => {
//   const [value, setValue] = React.useState(
//     localStorage.getItem(key) || initialState
//   );

//   React.useEffect(() => {
//     localStorage.setItem(key, value);
//   }, [value, key]);

//   return [value, setValue];
// };

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

  const [searchTerm, setSearchTerm] = React.useState('React');

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

  const searchedStories = stories.data.filter((story) => 
    (story.firstName.toLowerCase() && story.lastName.toLowerCase())
      .includes(searchTerm.toLowerCase())
  )

  return (
    <div className="App">
      <h1 className="header">MY STUDENTS PROFILE</h1>

      <InputWithLabel
        id="search"
        value={searchTerm}
        onInputChange={handleSearchInput}
        isFocused
        />

      {/* <button
        type="button"
        disabled={!searchTerm}
        onClick={handleSearchSubmit}
        >
        Submit
      </button> */}

      <hr />

      {stories.isError && <p>Something went wrong ...</p>}

      {stories.isLoading ? (
        <p>Loading ...</p>
        ) : (
        <List
        list={searchedStories}
        // onRemoveItem={handleRemoveStory}
        />
      )}

    </div>
  );
}

const List = ({list}) => {
  return (
    <ul className="ul">
      {list.map((item) => (
        <Item key={item.id} item={item} />
      ))}
    </ul>
  );
}

const Item = ({item}) => {

  const average = (value) => {
    let sum = 0;
    for (let grade of Object.values(value)) {
      sum += Number(grade)
    }
    return sum / 2
  }

  return (
  <li className="li">
    <span className="imgSpan"><img className="img" src={item.pic} alt="avatar"/></span>
    <span>
      <span className="name">{item.firstName}</span>
      <span className="name">{item.lastName}</span>
      <span className="text">Email {item.email}</span>
      <span className="text">Company {item.company}</span>
      <span className="text">Skill {item.skill}</span>
      <span className="text">Average {average(item.grades)}%</span>
    </span>

    {/* <span>
      <button type="button" onClick={() => onRemoveItem(item)}>
      Dismiss
      </button>
    </span> */}
  </li>
)};

const InputWithLabel = ({ id, value, onInputChange, type = 'text', isFocused }) => {
  const inputRef = React.useRef();

  React.useEffect(() => {
    if (isFocused && inputRef.current) {
    inputRef.current.focus();
    }
    }, [isFocused]);
  return (
    <>
      {/* <label className="label" htmlFor={id}>{children}</label> */}
      <input 
        className="input" 
        id={id} type={type} 
        value={value} 
        onChange={onInputChange} 
        ref={inputRef} 
        placeholder="Search by name"
        /> 
    </>
  );
}
export default App;
