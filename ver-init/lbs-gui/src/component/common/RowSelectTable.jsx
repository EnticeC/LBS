import React, { useEffect } from 'react';
import { useRowSelect, useTable } from 'react-table';
import '../../css/table.css';
import Checkbox from './Checkbox';

export const getAllSelectedRowIds = (dlength) => {
    const res = {};
    for (var i = 0; i < dlength; i++) {
        Object.assign(res, { ['' + i]: true });
    }
    return res;
};

export default ({ columns, data, cellProps, rowProps, selected, selectedRows, stateOnChange, initialAllSelected }) => {
    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow, selectedFlatRows, state } = useTable(
        {
            columns,
            data,
            initialState: {
                selectedRowIds: initialAllSelected ? getAllSelectedRowIds(data.length) : {},
            },
        },
        useRowSelect,
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

    return data.length > 0 ? (
        <table {...getTableProps()}>
            <thead>
                {headerGroups.map((headerGroup) => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map((column) => (
                            <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                        ))}
                    </tr>
                ))}
            </thead>
            <tbody {...getTableBodyProps()}>
                {rows.map((row, i) => {
                    prepareRow(row);
                    return (
                        <tr {...row.getRowProps(rowProps ? rowProps(row) : {})} key={i}>
                            {row.cells.map((cell) => {
                                return (
                                    <td {...cell.getCellProps(cellProps ? cellProps(cell) : {})}>
                                        {cell.render('Cell')}
                                    </td>
                                );
                            })}
                        </tr>
                    );
                })}
            </tbody>
        </table>
    ) : (
        <></>
    );
};
