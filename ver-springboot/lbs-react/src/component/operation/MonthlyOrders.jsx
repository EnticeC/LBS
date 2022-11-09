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
    const { dailyData, setDailyData } = useGlobalContext();
    const columns = [
        {
            title: '工作單編號', dataIndex: 'order_ID', key: 'order_ID', width: 120,
            ...getColumnSearchProps('order_ID', '工作單編號', searchInput, setSearchText, searchText, setSearchedColumn, searchedColumn),
        },
        {
            title: '服務種類', dataIndex: 'type', key: 'type', width: 120,
            ...getColumnSearchProps('type', '服務種類', searchInput, setSearchText, searchText, setSearchedColumn, searchedColumn),
        },
        {
            title: '日期', dataIndex: 'service_date', key: 'service_date', width: 130,
            ...getColumnSearchProps('service_date', '日期', searchInput, setSearchText, searchText, setSearchedColumn, searchedColumn),
        },
        {
            title: '客戶編號', dataIndex: 'customer_ID', key: 'customer_ID', width: 120, ellipsis: { showTitle: false, },
            ...getColumnSearchProps('customer_ID', '客戶編號', searchInput, setSearchText, searchText, setSearchedColumn, searchedColumn),
        },
        {
            title: '客戶名稱', dataIndex: 'name', key: 'name', width: 120, ellipsis: { showTitle: false, },
            ...getColumnSearchProps('name', '客戶名稱', searchInput, setSearchText, searchText, setSearchedColumn, searchedColumn),
        },
        {
            title: '技術員', dataIndex: 'staff', key: 'staff', width: 120, ellipsis: { showTitle: false, },
            ...getColumnSearchProps('staff', '技術員', searchInput, setSearchText, searchText, setSearchedColumn, searchedColumn),
        },
        { title: '客戶等級', dataIndex: 'customer_Rating', key: 'customer_Rating', width: 100, },
        { title: '付款方式', dataIndex: 'payment', key: 'payment', width: 100, },
        { title: '現價/單', dataIndex: 'profit', key: 'profit', width: 100, },
        { title: '簽署要求', dataIndex: 'sign', key: 'sign', width: 120, },
        { title: '做不到', dataIndex: 'notAble', key: 'notAble', width: 100, },
        { title: '未簽署', dataIndex: 'unsigned', key: 'unsigned', width: 100, },
        { title: '完成', dataIndex: 'complete', key: 'complete', width: 100, },
        { title: '未完成', dataIndex: 'incomplete', key: 'incomplete', width: 100, },
        {
            title: '未完成原因', dataIndex: 'reason', key: 'reason', width: 140, ellipsis: { showTitle: false, },
            render: (text) => (
                <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
            ),
        },
        { title: '服務發票編號', dataIndex: 'invoice_No', key: 'invoice_No', width: 160, },
        { title: '服務發票日期', dataIndex: 'invoice_Date', key: 'invoice_Date', width: 160, },
        { title: '狀態', dataIndex: 'status', key: 'status', width: 120, },
        {
            title: '刪除原因', dataIndex: 'deleteReason', key: 'deleteReason', width: 120, editable: true, ellipsis: { showTitle: false, },
            render: (text) => (
                <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
            ),
        },
        { title: '取消人員', dataIndex: 'cancelledBy', key: 'cancelledBy', width: 120, },
        { title: '取消日期', dataIndex: 'cancelledDate', key: 'cancelledDate', width: 120, },
        { title: '付款條款', dataIndex: 'paymentTerms', key: 'paymentTerms', width: 120, },
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
                inputType: 'text',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });
    const edit = (record) => {
        form.setFieldsValue({
            deleteReason: '',
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
            const newData = [...dailyData];
            const index = newData.findIndex((item) => key === item.key);

            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, { ...item, ...row });
                setDailyData(newData);
                setEditingKey('');
            } else {
                newData.push(row);
                setDailyData(newData);
                setEditingKey('');
            }
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    };

    // table operation:delete
    const handleDelete = (key) => {
        const newData = dailyData.filter((item) => item.key !== key);
        setDailyData(newData);
    };

    // 手工导入本月每日工作單信息
    const [dailyloading, setDailyLoading] = useState(false);
    const handleImport = useCallback((e) => {
        setDailyLoading(true);
        const files = e.target.files;
        if (files) {
            const f = files[0];
            readXlsxToJson(f, (result) => {
                setDailyLoading(false);
                setDailyData(convertJsonData(result, columns));
            });
        }
    }, []);

    return (
        <div>
            <FlexFileInput text="導入本月每日工作單" accept=".xlsx,.xls" onChange={handleImport} />

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
                        loading={dailyloading}
                        columns={mergedColumns}
                        dataSource={dailyData}
                    />
                </Form>
            </div>
        </div>
    );
};
