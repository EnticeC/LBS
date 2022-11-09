import React from 'react';
import '../../css/spinner.css';

export default ({ active, style }) => {
    return (
        <div className={'spinner-bars' + (active === undefined || active ? ' active' : '')} style={style}>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
        </div>
    );
};
