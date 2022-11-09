import React, { useEffect } from 'react';
import { FaArrowDown, FaArrowUp } from 'react-icons/fa';
import { useBlockLayout, useGlobalFilter, useRowSelect, useSortBy, useTable } from 'react-table';
import { FixedSizeList } from 'react-window';
import '../../css/table.css';
import Checkbox from './Checkbox';
import { getAllSelectedRowIds } from './RowSelectTable';
import { GlobalFilter } from './VirtualizedTable';

export default ({
    columns,
    data,
    height,
    rowProps,
    cellProps,
    selected,
    selectedRows,
    stateOnChange,
    initialAllSelected,
    initialSelectedRowIds,
    hasGlobalFilter,
}) => {
    const defaultColumn = React.useMemo(
        () => ({
            width: 150,
        }),
        []
    );
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        totalColumnsWidth,
        selectedFlatRows,
        state,
        preGlobalFilteredRows,
        setGlobalFilter,
    } = useTable(
        {
            columns,
            defaultColumn,
            data,
            initialState: {
                selectedRowIds: initialAllSelected
                    ? getAllSelectedRowIds(data.length)
                    : initialSelectedRowIds
                    ? initialSelectedRowIds
                    : {},
            },
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
                    Header: ({ getToggleAllRowsSelectedProps }) => (
                        <div>
                            <Checkbox {...getToggleAllRowsSelectedProps()} />
                        </div>
                    ),
                    // The cell can use the individual row's getToggleRowSelectedProps method
                    // to the render a checkbox
                    Cell: ({ row }) => (
                        <div>
                            <Checkbox {...row.getToggleRowSelectedProps()} />
                        </div>
                    ),
                    width: 50,
                },
                ...columns,
            ]);
        }
    );

    useEffect(() => {
        if (data.length > 0) {
            if (selected) selected.current = selectedFlatRows.map((r) => r.original);
            if (selectedRows) selectedRows.current = selectedFlatRows;
        }
    }, [selectedFlatRows]);

    useEffect(() => {
        if (stateOnChange) stateOnChange(state);
    }, [state]);

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
