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
    // const [prevOrderData, setPrevOrderData] = useState([]);
    const { prevOrderData, setPrevOrderData } = useGlobalContext();
    const columns = [
        {
            title: '公司', dataIndex: 'company', key: 'company', width: 120,
            ...getColumnSearchProps('company', '公司', searchInput, setSearchText, searchText, setSearchedColumn, searchedColumn),
        },
        {
            title: '工作單編號', dataIndex: 'order_ID', key: 'order_ID', width: 120, ellipsis: { showTitle: false, },
            ...getColumnSearchProps('order_ID', '工作單編號', searchInput, setSearchText, searchText, setSearchedColumn, searchedColumn),
        },
        {
            title: '服務', dataIndex: 'type', key: 'type', width: 100,
            ...getColumnSearchProps('type', '服務', searchInput, setSearchText, searchText, setSearchedColumn, searchedColumn),
        },
        {
            title: '工作單日期', dataIndex: 'order_Date', key: 'order_Date', width: 120, ellipsis: { showTitle: false, },
            ...getColumnSearchProps('order_Date', '工作單日期', searchInput, setSearchText, searchText, setSearchedColumn, searchedColumn),
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
            title: '服務人員', dataIndex: 'staff', key: 'staff', width: 120, ellipsis: { showTitle: false, },
            ...getColumnSearchProps('staff', '服務人員', searchInput, setSearchText, searchText, setSearchedColumn, searchedColumn),
        },
        { title: '車輛編號', dataIndex: 'vehicleNo', key: 'vehicleNo', width: 100, },
        {
            title: '服務項目', dataIndex: 'service', key: 'service', width: 100, ellipsis: { showTitle: false, },
            render: (text) => (
                <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
            ),
        },
        { title: '貨品編號', dataIndex: 'itemNo', key: 'itemNo', width: 100, },
        { title: '貨品描述', dataIndex: 'itemDescription', key: 'itemDescription', width: 100, },
        { title: '貨品數量', dataIndex: 'itemNums', key: 'itemNums', width: 100, },
        { title: '實際數量', dataIndex: 'actualNums', key: 'actualNums', width: 100, },
        { title: '單位', dataIndex: 'unit', key: 'unit', width: 100, },
        { title: '客戶等級', dataIndex: 'rate', key: 'rate', width: 100, },
        { title: '付款方式', dataIndex: 'payment', key: 'payment', width: 100, },
        {
            title: '狀態', dataIndex: 'status', key: 'status', width: 100, editable: true,
            ...getColumnSearchProps('status', '狀態', searchInput, setSearchText, searchText, setSearchedColumn, searchedColumn),
        },
        { title: '工作單完成時間', dataIndex: 'finishTime', key: 'finishTime', width: 160, },
        { title: '拒絕時間', dataIndex: 'rejectTime', key: 'rejectTime', width: 120, },
        {
            title: '拒絕原因', dataIndex: 'rejectReason', key: 'rejectReason', width: 120, editable: true, ellipsis: { showTitle: false, },
            render: (text) => (
                <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
            ),
        },
        {
            title: '拒絕原因 – 其他', dataIndex: 'otherRejectReason', key: 'otherRejectReason', width: 160, editable: true, ellipsis: { showTitle: false, },
            render: (text) => (
                <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
            ),
        },
        { title: '服務前照片', dataIndex: 'prevPhoto', key: 'prevPhoto', width: 110, },
        { title: '服務後照片', dataIndex: 'afterPhoto', key: 'afterPhoto', width: 110, },
        { title: '備註', dataIndex: 'remark', key: 'remark', width: 110, editable: true, },
        { title: 'Created date and time', dataIndex: 'createTime', key: 'createTime', width: 180, },
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
            status: '',
            rejectReason: '',
            otherRejectReason: '',
            remark: '',
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
            const newData = [...prevOrderData];
            const index = newData.findIndex((item) => key === item.key);

            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, { ...item, ...row });
                setPrevOrderData(newData);
                setEditingKey('');
            } else {
                newData.push(row);
                setPrevOrderData(newData);
                setEditingKey('');
            }
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    };

    // table operation:delete
    const handleDelete = (key) => {
        const newData = prevOrderData.filter((item) => item.key !== key);
        setPrevOrderData(newData);
    };

    // 手工导入待排單數據範本
    const [loading, setLoading] = useState(false);
    const handleImport = useCallback((e) => {
        setLoading(true);
        const files = e.target.files;
        if (files) {
            const f = files[0];
            readXlsxToJson(f, (result) => {
                setLoading(false);
                setPrevOrderData(convertJsonData(result, columns));
            });
        }
    }, []);

    return (
        <div>
            <FlexFileInput text="導入舊單重排信息" accept=".xlsx,.xls" onChange={handleImport} />

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
                        dataSource={prevOrderData}
                    />
                </Form>
            </div>
        </div>
    );
};
