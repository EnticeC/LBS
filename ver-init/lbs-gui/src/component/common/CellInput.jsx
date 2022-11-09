import React, { forwardRef, useEffect, useState } from 'react';

export default forwardRef((props, ref) => {
    const { inputType, defaultValue, onBlur, onClick } = props;
    const [value, setValue] = useState(defaultValue !== undefined ? defaultValue : '');

    useEffect(() => {
        setValue(defaultValue !== undefined ? defaultValue : '');
    }, [defaultValue]);

    return (
        <input
            className="cell-input"
            type={inputType}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onBlur={onBlur}
            onClick={onClick}
            ref={ref}
        />
    );
});
