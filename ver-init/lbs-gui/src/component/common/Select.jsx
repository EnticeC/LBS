import React from 'react';
import '../../css/select.css';
import useOnClickOutside from '../../utils/useOnClickOutside';

export default React.forwardRef(
    ({ currentValue, values, valueOnChange, inputWidth, scrollerWidth, scrollerMaxHeight, style }, outerRef) => {
        const [scrollerOpen, setScrollerOpen] = React.useState(false);
        const [value, setValue] = React.useState(currentValue);
        const ref = React.useRef(null);

        React.useEffect(() => {
            setValue(currentValue);
        }, [currentValue]);

        const onClickOutsideHandler = React.useCallback(() => {
            setScrollerOpen(false);
        }, []);

        useOnClickOutside(ref, onClickOutsideHandler);

        const onClick = React.useCallback((v, i) => {
            setScrollerOpen(false);
            setValue(v);
            if (valueOnChange) valueOnChange(v, i);
        }, []);

        const scrollRefCallback = React.useCallback((node) => {
            if (!node) return;
            const topPos = node.offsetTop;
            const parent = node.parentElement;
            if (!parent) return;
            parent.scrollTop = topPos - parent.offsetHeight / 2 + node.offsetHeight / 2;
        }, []);

        return (
            <div className="select-wrapper" style={style}>
                <input
                    className="input"
                    value={value}
                    onClick={(e) => {
                        e.stopPropagation();
                        setScrollerOpen(true);
                    }}
                    onChange={() => {}}
                    style={{ width: inputWidth ? inputWidth : undefined }}
                    ref={outerRef}
                />
                {scrollerOpen && (
                    <div className="select" ref={ref}>
                        <ul
                            className="scroller"
                            style={{
                                width: scrollerWidth ? scrollerWidth : undefined,
                                maxHeight: scrollerMaxHeight ? scrollerMaxHeight : undefined,
                            }}
                        >
                            {values.map((v, i) => (
                                <li
                                    className={v === value ? 'scroller-item selected' : 'scroller-item'}
                                    onClick={() => onClick(v, i)}
                                    ref={v === value ? scrollRefCallback : undefined}
                                    key={i}
                                >
                                    {v}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        );
    }
);
