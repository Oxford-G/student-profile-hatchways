import * as React from 'react';
import { AiOutlinePlus } from 'react-icons/ai'
import { AiOutlineMinus } from 'react-icons/ai'
import { InputWithLabel } from './InputWithLabel';

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

  const openButton =  <button className="button" type="button" onClick={toggleItem}>
                        <AiOutlinePlus className="svg" size="40px"/>
                      </button>

  const closeButton = <button className="button" type="button" onClick={toggleItem}>
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

export { List, Item };
