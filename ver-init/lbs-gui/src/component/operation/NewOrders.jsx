import React, { useCallback, useRef, useState } from 'react';
import { Form, Popconfirm, Table, Tooltip, Typography } from 'antd';
import FlexFileInput from '../common/FlexFileInput';
import { readXlsxToJson } from '../../utils/xlsx';
import { convertJsonData } from '../../utils/data';
import { getColumnSearchProps } from '../common/TableFilter';
import { EditableCell } from '../data/EditableCell';
import { useGlobalContext } from '../../App';

export default () => {
    // table filter
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    // table
    const { newOrderData, setNewOrderData } = useGlobalContext();
    const columns = [
        {
            title: '訂單類型', dataIndex: 'orderType', key: 'orderType', width: 120,
            filters: [
                { text: '餐飲客', value: '餐飲客', },
                { text: '非餐飲客', value: '非餐飲客', },
            ],
            onFilter: (value, record) => record.orderType.indexOf(value) === 0,
        },
        { title: '訂單編號', dataIndex: 'order_ID', key: 'order_ID', width: 120, },
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
            title: '操作',
            dataIndex: 'operation',
            fixed: 'right',
            width: 120,
            render: (_, record) => {
                const editable = isEditing(record);
                return editable ? (
                    <span>
                        <Typography.Link onClick={() => save(record.key)} style={{ marginRight: 8, }} >
                            保存
                        </Typography.Link>
                        <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
                            <a>取消</a>
                        </Popconfirm>
                    </span>
                ) : (
                    <span>
                        <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)} style={{ marginRight: 8, }} >
                            編輯
                        </Typography.Link>
                        <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.key)}>
                            <a>刪除</a>
                        </Popconfirm>
                    </span>

                )
            }
        },
    ];

    // row operation:Edit
    const [form] = Form.useForm();
    const [editingKey, setEditingKey] = useState('');
    const isEditing = (record) => record.key === editingKey;
    const mergedColumns = columns.map((col) => {
        if (!col.editable) {
            return col;
        }

        return {
            ...col,
            onCell: (record) => ({
                record,
                inputType: (col.dataIndex === 'total' || col.dataIndex === 'toilets') ? 'number' : 'text',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });
    const edit = (record) => {
        form.setFieldsValue({
            overtime_remark: '',
            service: '',
            serviceChange: '',
            total: '',
            toilets: '',
            sales: '',
            s_commission: '',
            otherSales: '',
            other_commission: '',
            tel_sale: '',
            period: '',
            historicalVer: '',
            ...record,
        });
        setEditingKey(record.key);
    };
    const cancel = () => {
        setEditingKey('');
    };
    const save = async (key) => {
        try {
            const row = await form.validateFields();
            const newData = [...newOrderData];
            const index = newData.findIndex((item) => key === item.key);

            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, { ...item, ...row });
                setNewOrderData(newData);
                setEditingKey('');
            } else {
                newData.push(row);
                setNewOrderData(newData);
                setEditingKey('');
            }
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    };

    // table operation:delete
    const handleDelete = (key) => {
        const newData = newOrderData.filter((item) => item.key !== key);
        setNewOrderData(newData);
    };

    // 手工导入新订单信息
    const [loading, setLoading] = useState(false);
    const handleImport = useCallback((e) => {
        setLoading(true);
        const files = e.target.files;
        if (files) {
            const f = files[0];
            readXlsxToJson(f, (result) => {
                setLoading(false);
                setNewOrderData(convertJsonData(result, columns));
            });
        }
    }, []);

    return (
        <div>
            <FlexFileInput text="導入新訂單" accept=".xlsx,.xls" onChange={handleImport} />
            <div className="table-container" style={{ marginTop: '16px' }}>
                <Form form={form} component={false}>
                    <Table
                        components={{
                            body: {
                                cell: EditableCell,
                            },
                        }}
                        rowClassName="editable-row"
                        bordered
                        scroll={{
                            x: 'calc(800px + 50%)',
                            y: 500,
                        }}
                        loading={loading}
                        columns={mergedColumns}
                        dataSource={newOrderData}
                    />
                </Form>
            </div>
        </div>
    );
};
