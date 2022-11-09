import React from 'react';
import '../../css/page.css';

export default ({ pages, path }) => {
    React.useEffect(() => {
        const pageDiv = document.querySelector('page');
        if (pageDiv) pageDiv.scrollTop = 0;
    }, [path]);

    const matchingPage = pages.find((page) => page.path === path);
    return <main style={contentStyle}>{matchingPage && matchingPage.component()}</main>;
};

const contentStyle = {
    flex: '1',
    position: 'relative',
    overflowX: 'hidden',
    overflowY: 'auto',
    width: '95%',
    margin: '0 auto',
};
