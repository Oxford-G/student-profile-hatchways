import * as React from 'react';

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

export{ InputWithLabel }
