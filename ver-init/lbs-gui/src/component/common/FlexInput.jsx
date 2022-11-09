import React, { forwardRef, useCallback, useEffect, useState } from 'react';
import '../../css/form.css';

const FlexInput = forwardRef((props, ref) => {
    const { inputType, inputPlaceHolder, defaultValue, onKeyUp, onInput, onBlur, noFlexGrow, width } = props;
    const [placeholder, setPlaceholder] = useState(inputPlaceHolder);
    const [value, setValue] = useState(defaultValue !== undefined && defaultValue !== null ? defaultValue : '');

    useEffect(() => {
        setValue(defaultValue !== undefined ? defaultValue : '');
    }, [defaultValue]);

    const onFocus = useCallback(() => {
        setPlaceholder('');
    }, []);

    const onBlurCallback = useCallback(
        (e) => {
            setPlaceholder(inputPlaceHolder);
            if (onBlur) onBlur(e);
        },
        [inputPlaceHolder]
    );

    return (
        <div className="flex-input" style={{ flexGrow: !noFlexGrow ? 1 : undefined }}>
            <input
                style={{ width: width ? width : undefined }}
                className="input"
                type={inputType}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onInput={onInput}
                placeholder={placeholder}
                onFocus={onFocus}
                onBlur={onBlurCallback}
                onKeyUp={onKeyUp}
                ref={ref}
            />
        </div>
    );
});

export default FlexInput;
