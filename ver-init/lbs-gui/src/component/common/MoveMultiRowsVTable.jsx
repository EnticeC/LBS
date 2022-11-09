import React from 'react';
import { FaArrowDown, FaArrowRight, FaArrowUp } from 'react-icons/fa';
import { useBlockLayout, useGlobalFilter, useRowSelect, useSortBy, useTable } from 'react-table';
import { FixedSizeList } from 'react-window';
import '../../css/table.css';
import Checkbox from './Checkbox';
import { GlobalFilter } from './VirtualizedTable';

export default ({ columns, data, movedDataRef, height, moveDataCallback, rowProps, cellProps, hasGlobalFilter }) => {
    const defaultColumn = React.useMemo(
        () => ({
            width: 150,
        }),
        []
    );

    const rangeStart = React.useRef(-1);
    const rangeEnd = React.useRef(-1);

    React.useEffect(() => {
        if (movedDataRef && movedDataRef.current && movedDataRef.current.length > 0 && data.length > 0) {
            rangeStart.current = -1;
            rangeEnd.current = -1;
            let idx = -1;
            for (let i = 0, j = 0; i < data.length; i++) {
                if (idx < 0) {
                    if (data[i] === movedDataRef.current[0]) idx = i;
                    else continue;
                }

                if (data[i] !== movedDataRef.current[j]) break;
                if (j === movedDataRef.current.length - 1) {
                    rangeStart.current = idx;
                    rangeEnd.current = i;
                    break;
                }
                j++;
            }
        }
    }, [data]);

    const checkboxOnChange = React.useCallback((row) => {
        if (rangeStart.current < 0) {
            rangeStart.current = row.index;
            selectedFlatRows.push(row);
            row.toggleRowSelected(true);
        } else {
            const a1 = rangeStart.current;
            const a2 = row.index;
            if (a1 < a2) {
                for (let i = a1 + 1; i <= a2; i++) {
                    selectedFlatRows.push(rows[i]);
                    rows[i].toggleRowSelected(true);
                }
                rangeEnd.current = a2;
            } else if (a1 > a2) {
                selectedFlatRows.length = 0;
                for (let i = a2; i < a1; i++) {
                    selectedFlatRows.push(rows[i]);
                    rows[i].toggleRowSelected(true);
                }
                rangeStart.current = a2;
                rangeEnd.current = a1;
            } else {
                rangeEnd.current = a1;
                row.toggleRowSelected(false);
                row.toggleRowSelected(true);
            }
            if (movedDataRef) {
                movedDataRef.current = data.slice(rangeStart.current, rangeEnd.current + 1);
            }
        }
    }, []);

    const checkboxOnMouseOver = React.useCallback((e, row) => {
        if (rangeStart.current < 0 || rangeEnd.current >= 0) return;
        const a1 = rangeStart.current;
        const a2 = row.index;
        if (a1 === a2) return;

        const cb = e.target;
        let tr = cb.parentElement.parentElement.parentElement;

        tr.children[0].children[0].children[0].classList.add('pseudo-checked');

        if (a1 < a2) {
            let count = 1;
            while (tr.previousElementSibling && count < a2 - a1) {
                tr = tr.previousElementSibling;
                tr.children[0].children[0].children[0].classList.add('pseudo-checked');
                count++;
            }
        } else {
            let count = 1;
            while (tr.nextElementSibling && count < a1 - a2) {
                tr = tr.nextElementSibling;
                tr.children[0].children[0].children[0].classList.add('pseudo-checked');
                count++;
            }
        }
    }, []);

    const checkboxOnMouseOut = React.useCallback((e, row) => {
        if (rangeStart.current < 0 || rangeEnd.current >= 0) return;
        const a1 = rangeStart.current;
        const a2 = row.index;
        if (a1 === a2) return;

        const cb = e.target;
        let tr = cb.parentElement.parentElement.parentElement;

        tr.children[0].children[0].children[0].classList.remove('pseudo-checked');

        if (a1 < a2) {
            let count = 1;
            while (tr.previousElementSibling && count < a2 - a1) {
                tr = tr.previousElementSibling;
                tr.children[0].children[0].children[0].classList.remove('pseudo-checked');
                count++;
            }
        } else {
            let count = 1;
            while (tr.nextElementSibling && count < a1 - a2) {
                tr = tr.nextElementSibling;
                tr.children[0].children[0].children[0].classList.remove('pseudo-checked');
                count++;
            }
        }
    }, []);

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        totalColumnsWidth,
        selectedFlatRows,
        preGlobalFilteredRows,
        setGlobalFilter,
        state,
    } = useTable(
        {
            columns,
            defaultColumn,
            data,
            autoResetPage: false,
            autoResetExpanded: false,
            autoResetGroupBy: false,
            autoResetSelectedRows: false,
            autoResetSortBy: false,
            autoResetFilters: false,
            autoResetRowState: false,
        },
        useGlobalFilter,
        useSortBy,
        useRowSelect,
        useBlockLayout,
        (hooks) => {
            hooks.visibleColumns.push((columns) => [
                // Let's make a column for selection
                {
                    id: 'selection',
                    // The header can use the table's getToggleAllRowsSelectedProps method
                    // to render a checkbox
                    // Header: ({ getToggleAllRowsSelectedProps }) => (
                    //     <div>
                    //         <Checkbox {...getToggleAllRowsSelectedProps()} />
                    //     </div>
                    // ),
                    // The cell can use the individual row's getToggleRowSelectedProps method
                    // to the render a checkbox
                    Cell: ({ row }) => {
                        if (movedDataRef && movedDataRef.current && movedDataRef.current.length > 0) {
                            if (rangeStart.current > -1 && rangeEnd.current > -1) {
                                if (row.index >= rangeStart.current && row.index <= rangeEnd.current) {
                                    return (
                                        <div>
                                            <Checkbox checked={true} disabled={true} />
                                        </div>
                                    );
                                } else {
                                    if (row.index < rangeStart.current) {
                                        return (
                                            <div
                                                className="insert before"
                                                onClick={() => moveDataCallback(movedDataRef.current, row.index)}
                                            >
                                                <FaArrowRight />
                                            </div>
                                        );
                                    } else {
                                        return (
                                            <div
                                                className="insert after"
                                                onClick={() =>
                                                    moveDataCallback(
                                                        movedDataRef.current,
                                                        row.index + 1 - selectedFlatRows.length
                                                    )
                                                }
                                            >
                                                <FaArrowRight />
                                            </div>
                                        );
                                    }
                                }
                            } else {
                                if (row.index === 0) {
                                    return (
                                        <>
                                            <div
                                                className="insert before"
                                                onClick={() => moveDataCallback(movedDataRef.current, 0)}
                                            >
                                                <FaArrowRight />
                                            </div>
                                            <div
                                                className="insert after"
                                                onClick={() => moveDataCallback(movedDataRef.current, 1)}
                                            >
                                                <FaArrowRight />
                                            </div>
                                        </>
                                    );
                                } else {
                                    return (
                                        <div
                                            className="insert after"
                                            onClick={() => moveDataCallback(movedDataRef.current, row.index + 1)}
                                        >
                                            <FaArrowRight />
                                        </div>
                                    );
                                }
                            }
                        } else if (rangeEnd.current < 0) {
                            return (
                                <div>
                                    <Checkbox
                                        checked={row.isSelected}
                                        onChange={() => checkboxOnChange(row)}
                                        onMouseOver={(e) => checkboxOnMouseOver(e, row)}
                                        onMouseOut={(e) => checkboxOnMouseOut(e, row)}
                                    />
                                </div>
                            );
                        } else if (row.index >= rangeStart.current && row.index <= rangeEnd.current) {
                            return (
                                <div>
                                    <Checkbox checked={row.isSelected} disabled={true} />
                                </div>
                            );
                        } else {
                            if (row.index < rangeStart.current) {
                                return (
                                    <div
                                        className="insert before"
                                        onClick={() =>
                                            moveDataCallback(
                                                selectedFlatRows.map((f) => f.original),
                                                row.index
                                            )
                                        }
                                    >
                                        <FaArrowRight />
                                    </div>
                                );
                            } else {
                                return (
                                    <div
                                        className="insert after"
                                        onClick={() =>
                                            moveDataCallback(
                                                selectedFlatRows.map((f) => f.original),
                                                row.index + 1 - selectedFlatRows.length
                                            )
                                        }
                                    >
                                        <FaArrowRight />
                                    </div>
                                );
                            }
                        }
                    },
                    width: 20,
                },
                ...columns,
            ]);
        }
    );

    // If wrapped in React.useCallback, the checkboxes won't update after clicking
    // See github issue: https://github.com/tannerlinsley/react-table/issues/2018
    const RenderRow = React.useCallback(
        ({ index, style }) => {
            const row = rows[index];
            prepareRow(row);
            return (
                <div
                    {...row.getRowProps([
                        rowProps ? rowProps(row) : {},
                        { style },
                        {
                            className: 'tr' + (index % 2 === 0 ? ' even' : ''),
                        },
                    ])}
                    key={index}
                >
                    {row.cells.map((cell, idx) => (
                        <div {...cell.getCellProps(cellProps ? cellProps(cell) : {})} className="td" key={idx}>
                            {cell.render('Cell')}
                        </div>
                    ))}
                </div>
            );
        },
        [prepareRow, rows, selectedFlatRows]
    );

    return data.length > 0 ? (
        <div {...getTableProps} className="table">
            {hasGlobalFilter && (
                <div className="table-global-filter">
                    <GlobalFilter
                        preGlobalFilteredRows={preGlobalFilteredRows}
                        globalFilter={state.globalFilter}
                        setGlobalFilter={setGlobalFilter}
                        disabled={true}
                    />
                </div>
            )}
            <div className="thead">
                {headerGroups.map((headerGroup) => (
                    <div
                        {...headerGroup.getHeaderGroupProps({
                            style: { height: 35 },
                        })}
                        className="tr"
                    >
                        {headerGroup.headers.map((column) => (
                            <div {...column.getHeaderProps(column.getSortByToggleProps())} className="th">
                                {column.render('Header')}
                                <span>
                                    {column.isSorted ? column.isSortedDesc ? <FaArrowDown /> : <FaArrowUp /> : ''}
                                </span>
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            <div {...getTableBodyProps({ className: 'tbody' })}>
                <FixedSizeList
                    height={Math.min(hasGlobalFilter ? height - 70 : height - 35, rows.length * 35)}
                    itemCount={rows.length}
                    itemSize={35}
                    width={totalColumnsWidth}
                >
                    {RenderRow}
                </FixedSizeList>
            </div>
        </div>
    ) : (
        <></>
    );
};
