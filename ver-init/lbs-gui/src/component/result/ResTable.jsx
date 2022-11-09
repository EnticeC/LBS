import React, { useRef, useState } from 'react';
import { Popconfirm, Table, Tabs, Tooltip } from 'antd';
import { getColumnSearchProps } from '../common/TableFilter';
import FlexButton from '../common/FlexButton';
import { resScheduled, nonResScheduled } from './data/orderData';
import { handleExport } from './ScheduleResult';

export default React.forwardRef((props, ref) => {
    // 标记订单类型
    const { type, ButtonText, ExportTitle, dataSource } = props;

    // 表格数据
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);

    // 新訂單
    const columns = [
        {
            title: '合同日期', dataIndex: 'contract_date', key: 'contract_date', width: 120,
            ...getColumnSearchProps('contract_date', '合同日期', searchInput, setSearchText, searchText, setSearchedColumn, searchedColumn),
        },
        {
            title: '實際接收日期', dataIndex: 'receive_date', key: 'receive_date', width: 140,
            ...getColumnSearchProps('receive_date', '實際接收日期', searchInput, setSearchText, searchText, setSearchedColumn, searchedColumn),
        },
        {
            title: '生效日期', dataIndex: 'effective_date', key: 'effective_date', width: 120,
            ...getColumnSearchProps('effective_date', '生效日期', searchInput, setSearchText, searchText, setSearchedColumn, searchedColumn),
        },
        {
            title: '客戶編號', dataIndex: 'customer_ID', key: 'customer_ID', width: 120, ellipsis: { showTitle: false, },
            ...getColumnSearchProps('customer_ID', '客戶編號', searchInput, setSearchText, searchText, setSearchedColumn, searchedColumn),
        },
        {
            title: '客戶名稱', dataIndex: 'name', key: 'name', width: 120, ellipsis: { showTitle: false, },
            ...getColumnSearchProps('name', '客戶名稱', searchInput, setSearchText, searchText, setSearchedColumn, searchedColumn),
        },
        { title: '集團公司編號', dataIndex: 'company_ID', key: 'company_ID', width: 120, },
        { title: '付款方式', dataIndex: 'payment', key: 'payment', width: 100, },
        {
            title: '客戶類別', dataIndex: 'customerCategory', key: 'customerCategory', width: 100, ellipsis: { showTitle: false, },
            render: (text) => (
                <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
            ),
        },
        { title: '服務種類', dataIndex: 'type', key: 'type', width: 100, },
        {
            title: '加班備註', dataIndex: 'overtime_remark', key: 'overtime_remark', width: 100, editable: true, ellipsis: { showTitle: false, },
            render: (text) => (
                <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
            ),
        },
        {
            title: '服務項目', dataIndex: 'service', key: 'service', width: 100, editable: true, ellipsis: { showTitle: false, },
            render: (text) => (
                <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
            ),
        },
        { title: '服務更改', dataIndex: 'serviceChange', key: 'serviceChange', width: 100, editable: true, },
        { title: '潔具總計', dataIndex: 'total', key: 'total', width: 120, editable: true, },
        { title: '洗手間總數目', dataIndex: 'toilets', key: 'toilets', width: 120, editable: true, },
        { title: '銷售人員', dataIndex: 'sales', key: 'sales', width: 120, editable: true, },
        { title: '銷售人員-佣金%', dataIndex: 's_commission', key: 's_commission', width: 140, editable: true, },
        { title: '其他銷售人員', dataIndex: 'otherSales', key: 'otherSales', width: 120, editable: true, },
        { title: '其他銷售人員-佣金%', dataIndex: 'other_commission', key: 'other_commission', width: 160, editable: true, },
        { title: '電話銷售/致電', dataIndex: 'tel_sale', key: 'tel_sale', width: 140, editable: true, },
        { title: '服務週期', dataIndex: 'period', key: 'period', width: 120, editable: true, },
        {
            title: '歷史版本', dataIndex: 'historicalVer', key: 'historicalVer', width: 120, editable: true, ellipsis: { showTitle: false, },
            render: (text) => (
                <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
            ),
        },
        {
            title: '服務人員編號', dataIndex: 'staff_id', key: 'staff_id', width: 220, className: 'col_background',
            ...getColumnSearchProps('staff_id', '服務人員編號', searchInput, setSearchText, searchText, setSearchedColumn, searchedColumn),
        },
        {
            title: '服務人員名稱', dataIndex: 'staff_name', key: 'staff_name', width: 220, className: 'col_background',
            ...getColumnSearchProps('staff_name', '服務人員名稱', searchInput, setSearchText, searchText, setSearchedColumn, searchedColumn),
        },
    ];

    return (
        <div>
            <FlexButton style={{ marginLeft: 16 }} text={ButtonText} onClick={() => handleExport(columns, dataSource, ExportTitle)} />
            <div className="table-container" style={{ marginTop: '16px' }}>
                <Table
                    bordered
                    scroll={{
                        x: 'calc(800px + 50%)',
                        y: 500,
                    }}
                    columns={columns}
                    dataSource={dataSource}
                />
            </div>
        </div>
    );
});

