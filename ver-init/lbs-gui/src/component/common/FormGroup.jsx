import React from 'react';
import '../../css/form.css';

const FormGroup = ({ className, style, children }) => {
    return (
        <div className={'form-group' + (className ? ' ' + className : '')} style={style}>
            {children}
        </div>
    );
};

export default FormGroup;
