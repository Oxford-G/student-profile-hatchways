import * as React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import App from './App';
import { Item } from './List';
import axios from 'axios';

jest.mock('axios');

let obj = ["1", "30", "40", "50" ]

const studentOne = {
  firstName: 'React',
  lastName: 'first',
  pic: 'https://reactjs.org/',
  email: 'Jordan@gmail.com',
  company: 'ridgeway',
  skill: 'coding',
  grades: obj,
  id: 0,
};

const studentTwo = {
  firstName: 'Redux',
  lastName: 'last',
  pic: 'https://redux.js.org/',
  email: 'Dordan@gmail.com',
  company: 'widgeway',
  skill: 'cooking',
  grades: obj,
  id: 1,
};

const stories = [studentOne, studentTwo];

describe('Item', () => {
  test('renders all properties', () => {
    render(<Item item={studentOne} />);

    expect(screen.getByText('first')).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
  });
});

describe('SearchForm', () => {

  const searchFormProps = {
    searchTerm: 'React',
    filterTag: 'Redux',
    handleSearchInput: jest.fn(),
    handleTagSearch: jest.fn(),
  };

  test('renders the input field with its value', () => {
    const {getByPlaceholderText} = render(<App {...searchFormProps} />);

    expect(getByPlaceholderText("Search by name")).toBeInTheDocument();
    expect(getByPlaceholderText("Search by tag")).toBeInTheDocument();
  });

  test('calls handleTagSearch and handleSearchInput on input field change', () => {
    render(<App {...searchFormProps} />);

    fireEvent.change(screen.getByDisplayValue('in'), {
    target: { value: 'Redux' },
    });
    expect(searchFormProps.handleSearchInput).toHaveBeenCalledTimes(0);
  });
});

describe('App', () => {
  test('succeeds fetching data', async () => {
    const promise = Promise.resolve({
      data: {
        students: stories,
      },
    });

    axios.get.mockImplementationOnce(() => promise);

    render(<App />);

    screen.debug();

    expect(screen.queryByText(/Loading/)).toBeInTheDocument();

    await act(() => promise);

    expect(screen.queryByText(/Loading/)).toBeNull();

    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('Redux')).toBeInTheDocument();
    
    screen.debug();
  });

  test('fails fetching data', async () => {
    const promise = Promise.reject();

    axios.get.mockImplementationOnce(() => promise);

    render(<App />);

    expect(screen.getByText(/Loading/)).toBeInTheDocument();

    try {
      await act(() => promise);
      } catch (error) {
      expect(screen.queryByText(/Loading/)).toBeNull();
      expect(screen.queryByText(/went wrong/)).toBeInTheDocument();
    }
  })
});
