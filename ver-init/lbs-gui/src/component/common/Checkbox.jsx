import React, { useImperativeHandle } from 'react';

export default React.forwardRef(({ indeterminate, ...rest }, ref) => {
    const defaultRef = React.useRef(null);
    useImperativeHandle(ref, () => defaultRef.current, [defaultRef]);

    return <input type="checkbox" ref={defaultRef} {...rest} onClick={(e) => e.stopPropagation()} />;
});
