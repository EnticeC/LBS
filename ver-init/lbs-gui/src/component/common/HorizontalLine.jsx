import React from 'react';
import '../../css/horizontal-line.css';

const HorizontalLine = ({ left, length, dashed }) => (
    <div
        className={'horizontal-line' + (dashed ? ' dashed' : '')}
        style={{
            left: left,
            width: length,
        }}
    ></div>
);

HorizontalLine.defaultProps = {
    dashed: false,
};

export default HorizontalLine;
