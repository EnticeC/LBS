import React from 'react';
import '../../css/node.css';

export default ({ left, text, note, status }) => (
    <div className={'node ' + status} style={{ left: left }}>
        {text}
        <div className={'node-note ' + status}>{note}</div>
    </div>
);
