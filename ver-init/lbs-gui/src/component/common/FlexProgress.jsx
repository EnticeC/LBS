import React from 'react';
import '../../css/form.css';
import ProgressBar from './ProgressBar';

export default ({ max, value, width }) => (
    <div className="flex-progress" style={{ flexBasis: width }}>
        <ProgressBar max={max} value={value} />
    </div>
);
