import React from "react";
import {useState} from "react";
import '../css/dragBar.scss'

export const cn = (...args) => args.filter(Boolean).join(" ");

const SampleSplitter = ({
    id = 'drag-bar',
    dir,
    isDragging,
    ...props
  }) => {
    const [isFocused, setIsFocused] = useState(false);
  
    return (
      <div
        id={id}
        data-testid={id}
        tabIndex={0}
        className={cn(
          'sample-drag-bar',
          dir === 'horizontal' && 'sample-drag-bar--horizontal',
          (isDragging || isFocused) && 'sample-drag-bar--dragging'
        )}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props}
      />
    );
  };
  
  export default SampleSplitter;