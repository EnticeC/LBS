import React, { forwardRef, useEffect, useState } from 'react';

export default forwardRef((props, ref) => {
    const { options, defaultValue, onBlur, onClick } = props;
    const [value, setValue] = useState(defaultValue !== undefined ? defaultValue : '');

    useEffect(() => {
        setValue(defaultValue !== undefined ? defaultValue : '');
    }, [defaultValue]);

    return (
        <select
            className="cell-select"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onBlur={onBlur}
            onClick={onClick}
            ref={ref}
        >
            {Array.from(options).map(([k, v], index) => (
                <option value={v} key={index}>
                    {k}
                </option>
            ))}
        </select>
    );
});
