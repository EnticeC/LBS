import React from 'react';
import { useTable } from 'react-table';
import '../../css/table.css';

export default ({ columns, data, cellProps, rowProps, stateOnChange }) => {
    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow, state } = useTable({ columns, data });

    React.useEffect(() => {
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
