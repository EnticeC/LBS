import React from 'react';
import '../../css/progress-bar.css';

export default ({ max, value }) => (
    <div className="progress-bar">
        <div className="bar">
            <div className="progress" style={{ width: (value / max) * 100 + '%' }}></div>
        </div>
    </div>
);
