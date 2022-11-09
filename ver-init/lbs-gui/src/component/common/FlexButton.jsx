import React from 'react';
import { Button } from 'antd';

export default React.forwardRef((props, ref) => {
    const { text, onClick, disabled } = props;
    return (
        <Button type="default" onClick={onClick} disabled={disabled} ref={ref}>{text}</Button>
    );
});
