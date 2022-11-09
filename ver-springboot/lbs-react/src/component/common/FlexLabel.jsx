import React from 'react';
import '../../css/form.css';

export default ({ text, style, width }) => {
    return (
        <div className="flex-label" style={{ ...style, width: width }}>
            <label className="label">{text}</label>
        </div>
    );
};
