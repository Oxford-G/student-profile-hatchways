import './App.css';
import * as React from 'react';
import axios from 'axios';
import { AiOutlinePlus } from 'react-icons/ai'
import { AiOutlineMinus } from 'react-icons/ai'

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
  const [filterTag, setFilterTag] = React.useState('');

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

  const handleTagSearch = (event) => {
    setFilterTag(event.target.value);
  };

  const searchedStories = stories.data.filter((story) => 
    (story.firstName.toLowerCase().includes(searchTerm.toLowerCase())) 
      || (story.lastName.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const filterTags = allArray.filter((el)=> 
    el.toLowerCase().includes(filterTag.toLowerCase())
  )

  const combineSearch = searchedStories.concat(filterTags)
  console.log(combineSearch)

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

      <InputWithLabel
        id="tag"
        value={filterTag}
        onInputChange={handleTagSearch}
        placeholder="Search by tag"
      />

      <hr />

      {stories.isError && <p>Something went wrong ...</p>}

      {stories.isLoading ? (
        <p>Loading ...</p>
        ) : (
        <List
        list={combineSearch}
        allArray={allArray}
        />
      )}

    </div>
  );
}

const List = ({list, allArray}) => {
  return (
    <ul className="ul">
      {list.map((item) => (
        <Item key={item.id} 
        item={item} 
        allArray={allArray}
        />
      ))}
    </ul>
  );
}

const Item = ({item, allArray}) => {

  const average = (value) => {
    let sum = 0;
    for (let grade of Object.values(value)) {
      sum += Number(grade)
    }
    return sum / 2
  }

  const [open, setOpen] = React.useState(false)
  const [searchTag, setSearchTag] = React.useState('');
  const [tag, setTag] = React.useState([]);

  const toggleItem = () => {
    setOpen(!open)
  }

  const tagArray = (param1, param2) => {
    let tagPush = param1.concat(param2)
    return tagPush
  }

  const handleSearchTag = (event) => {
    setSearchTag(event.target.value);
  };

  const handleTagSubmit = (event) => {
    setTag(tagArray(allArray, searchTag))
    event.preventDefault();
  }

  const openButton =  <button className="button" type="button" onClick={() => toggleItem(item)}>
                        <AiOutlinePlus className="svg" size="40px"/>
                      </button>

  const closeButton = <button className="button" type="button" onClick={() => toggleItem(item)}>
                        <AiOutlineMinus className="svg" size="40px"/>
                      </button>

  return (
  <li className="li">
    <span className="imgSpan"><img className="img" src={item.pic} alt="avatar"/></span>
    <span className="imgSpan2">
      <span className="name">{item.firstName}</span>
      <span className="name">{item.lastName}</span>
      <span className="text">Email: {item.email}</span>
      <span className="text">Company: {item.company}</span>
      <span className="text">Skill: {item.skill}</span>
      <span className="text">Average: {average(item.grades)}%</span>

      <span className="tag"><strong>{tag}</strong></span>

      <span>
        <form onSubmit={handleTagSubmit}>
          <InputWithLabel
          id="search"
          value={searchTag}
          onInputChange={handleSearchTag}
          placeholder="Add a tag"
          />

          <button className="button1" type="submit" disabled={!searchTag}>
          Submit
          </button>
        </form>
      </span>


      <span>
        {item.grades.map((grade, index) => {
        return (
          <span className={`text grade ${open}`} key={index}>
            <span>Test {index + 1} <span className="grade-space">{grade}%</span></span>
          </span>
        )
        })}
      </span>
    </span>

    <span className="imgSpan3">
     {open ? closeButton : openButton}
    </span>
  </li>
)};

const InputWithLabel = ({ id, value, onInputChange, type = 'text', isFocused, placeholder }) => {
  const inputRef = React.useRef();

  React.useEffect(() => {
    if (isFocused && inputRef.current) {
    inputRef.current.focus();
    }
    }, [isFocused]);
  return (
    <>
      <input 
        className="input" 
        id={id} 
        type={type} 
        value={value} 
        onChange={onInputChange} 
        ref={inputRef} 
        placeholder={placeholder}
        /> 
    </>
  );
}
export default App;
