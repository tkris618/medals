import React, { useLayoutEffect, useRef } from 'react';

const Word = (props) => {
  const wordEl = useRef();

  const { onDelete, word } = props;
  // helper method
  const renderColor = (color) => color === undefined || color === null ? 'black' : color;
  // return random number between min & max
  const getRandomInt = (min, max) => parseInt(Math.random() * (max - min) + min);
  
  // this is equivalent to componentDidUpdate - however, it will only be called
  // on wordEl or word.word updates per the dependencies array passed as 2nd argument
  // useLayoutEffect should only be used in place of useEffect when necessary,
  // in this case it is needed to avoid component render flickering
  useLayoutEffect(() => {
    const el = wordEl.current;
    el.style.top = getRandomInt(0, window.innerHeight - el.clientHeight) + 'px';
    el.style.left = getRandomInt(0, window.innerWidth - el.clientWidth) + 'px';
    console.log(`hello, ${word.word}`);
    // this is equivalent to componentWillUnmount
    return () => {
      console.log(`goodbye, ${word.word}`);
    }
  }, [wordEl, word.word])

  return (
    <div ref={wordEl} id={ word.id } onClick={ () => onDelete(word.id) } className='Word' style={{ color: renderColor(word.color) }}>
      { word.word }
    </div>
  );
}

export default Word;