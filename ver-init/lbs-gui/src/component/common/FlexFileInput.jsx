import React from 'react';
import '../../css/form.css';
import FlexButton from './FlexButton';

export default React.forwardRef(({ text, accept, onChange, disabled }, ref) => {
    const defaultRef = React.useRef(null);
    React.useImperativeHandle(ref, () => defaultRef.current, [defaultRef]);

    return (
        <>
            <input type="file" onChange={onChange} ref={defaultRef} style={{ display: 'none' }} accept={accept} />
            <FlexButton text={text} onClick={(e) => defaultRef.current.click()} disabled={disabled} />
        </>
    );
});
