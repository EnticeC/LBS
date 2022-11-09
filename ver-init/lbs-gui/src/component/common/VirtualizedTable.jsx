import React from 'react';
import { FaArrowDown, FaArrowUp } from 'react-icons/fa';
import { useAsyncDebounce, useBlockLayout, useGlobalFilter, useSortBy, useTable } from 'react-table';
import { FixedSizeList } from 'react-window';

// Define a default UI for filtering
export function GlobalFilter({ preGlobalFilteredRows, globalFilter, setGlobalFilter, disabled }) {
    const count = preGlobalFilteredRows.length;
    const [value, setValue] = React.useState(globalFilter);
    const onChange = useAsyncDebounce((value) => {
        setGlobalFilter(value || undefined);
    }, 200);

    return (
        <span>
            搜索:{' '}
            <input
                className="input"
                value={value || ''}
                onChange={(e) => {
                    setValue(e.target.value);
                    onChange(e.target.value);
                }}
                placeholder={`共${count}行...`}
                disabled={disabled}
            />
        </span>
    );
}

export default ({ data, columns, height, rowProps, cellProps, stateOnChange, hasGlobalFilter }) => {
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
        totalColumnsWidth,
        prepareRow,
        state,
        preGlobalFilteredRows,
        setGlobalFilter,
    } = useTable(
        {
            columns,
            data,
            defaultColumn,
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
        useBlockLayout
    );

    React.useEffect(() => {
        if (stateOnChange) stateOnChange(state);
    }, [state]);

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
                >
                    {row.cells.map((cell) => (
                        <div {...cell.getCellProps(cellProps ? cellProps(cell) : {})} className="td">
                            {cell.render('Cell')}
                        </div>
                    ))}
                </div>
            );
        },
        [prepareRow, rows]
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
