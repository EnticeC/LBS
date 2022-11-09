import React from 'react';
import '../../css/dialog-box.css';

const DialogBox = ({ children, style, className }) => {
    return (
        <div className={'dialog-box ' + (className ? className : '')} style={style}>
            {children}
        </div>
    );
};

export default DialogBox;
