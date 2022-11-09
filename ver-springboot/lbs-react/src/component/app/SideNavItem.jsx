import React, { forwardRef, useCallback } from 'react';
import { useGlobalContext } from '../../App';

const SideNavItem = forwardRef((props, ref) => {
    const { path, title, selected, setPath } = props;
    // const { appPending, ranScheduling } = useGlobalContext();

    const onClick = useCallback(() => {
        setPath(path);
    }, [setPath, path]);

    return (
        <button
            className={'nav-button' + (selected ? ' is-selected' : '')}
            ref={ref}
            onClick={onClick}
        >
            {title}
        </button>
    );
});

export default SideNavItem;
