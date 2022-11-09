import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { formatDatetime } from './utils/datetime';

Date.prototype.toJSON = function() {
    return formatDatetime(this);
}

ReactDOM.render(
    <App />,
    /* <React.StrictMode>
        <App />
        </React.StrictMode>, */
    document.getElementById('root')
);
