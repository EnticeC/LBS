import React from 'react';
import '../../css/datetime-picker.css';
import { range } from '../../utils/array';
import { daysInMonth, formatDatetime } from '../../utils/datetime';
import useOnClickOutside from '../../utils/useOnClickOutside';

export default React.forwardRef(({ value, dateOnChange, style }, ref) => {
    const [pickerOpen, setPickerOpen] = React.useState(false);
    const [innerValue, setInnerValue] = React.useState(new Date(value));
    const onClickOutsideRef = React.useRef(null);

    const onClickOutsideHandler = React.useCallback(() => {
        setPickerOpen(false);
        dateOnChange(innerValue);
    }, [innerValue]);
    useOnClickOutside(onClickOutsideRef, onClickOutsideHandler);

    const components = React.useMemo(() => {
        const comps = [
            innerValue.getFullYear(),
            innerValue.getMonth() + 1,
            innerValue.getDate(),
            innerValue.getHours(),
            innerValue.getMinutes(),
            innerValue.getSeconds(),
        ];
        return comps;
    }, [innerValue]);

    const scrollRefCallback = React.useCallback((node) => {
        if (!node) return;
        const topPos = node.offsetTop;
        const parent = node.parentElement;
        if (!parent) return;
        parent.scrollTop = topPos - parent.offsetHeight / 2 + node.offsetHeight / 2;
    }, []);

    const onClick = React.useCallback(
        (e, current, clicked, compIndex) => {
            e.stopPropagation();
            if (current === clicked) return;
            const newComponents = [...components];
            newComponents[compIndex] = clicked;
            const newDate = new Date(
                newComponents[0],
                newComponents[1] - 1,
                newComponents[2],
                newComponents[3],
                newComponents[4],
                newComponents[5]
            );
            setInnerValue(newDate);
        },
        [components]
    );

    return (
        <div className="datetime-picker-wrapper" style={style}>
            <input
                className="input"
                value={formatDatetime(innerValue)}
                onClick={(e) => {
                    e.stopPropagation();
                    setPickerOpen(true);
                }}
                onChange={(e) => {}}
                ref={ref}
            ></input>
            {pickerOpen && (
                <div className="datetime-picker" ref={onClickOutsideRef}>
                    <ul className="scroller">
                        {range(components[0] - 5, components[0] + 6).map((year, index) => (
                            <li
                                className={year === components[0] ? 'selected scroller-item' : 'scroller-item'}
                                ref={year === components[0] ? scrollRefCallback : undefined}
                                onClick={(e) => onClick(e, components[0], year, 0)}
                                key={index}
                            >
                                {year}
                            </li>
                        ))}
                    </ul>
                    <ul className="scroller">
                        {range(1, 13).map((month, index) => (
                            <li
                                className={month === components[1] ? 'selected scroller-item' : 'scroller-item'}
                                ref={month === components[1] ? scrollRefCallback : undefined}
                                onClick={(e) => onClick(e, components[1], month, 1)}
                                key={index}
                            >
                                {month}
                            </li>
                        ))}
                    </ul>
                    <ul className="scroller">
                        {range(1, daysInMonth(components[1], components[0]) + 1).map((day, index) => (
                            <li
                                className={day === components[2] ? 'selected scroller-item' : 'scroller-item'}
                                ref={day === components[2] ? scrollRefCallback : undefined}
                                onClick={(e) => onClick(e, components[2], day, 2)}
                                key={index}
                            >
                                {day}
                            </li>
                        ))}
                    </ul>
                    <ul className="scroller">
                        {range(0, 24).map((hour, index) => (
                            <li
                                className={hour === components[3] ? 'selected scroller-item' : 'scroller-item'}
                                ref={hour === components[3] ? scrollRefCallback : undefined}
                                onClick={(e) => onClick(e, components[3], hour, 3)}
                                key={index}
                            >
                                {hour}
                            </li>
                        ))}
                    </ul>
                    <ul className="scroller">
                        {range(0, 60).map((minute, index) => (
                            <li
                                className={minute === components[4] ? 'selected scroller-item' : 'scroller-item'}
                                ref={minute === components[4] ? scrollRefCallback : undefined}
                                onClick={(e) => onClick(e, components[4], minute, 4)}
                                key={index}
                            >
                                {minute}
                            </li>
                        ))}
                    </ul>
                    <ul className="scroller">
                        {range(0, 60).map((second, index) => (
                            <li
                                className={second === components[5] ? 'selected scroller-item' : 'scroller-item'}
                                ref={second === components[5] ? scrollRefCallback : undefined}
                                onClick={(e) => onClick(e, components[5], second, 5)}
                                key={index}
                            >
                                {second}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
});
