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
    // const [scheduledData, setScheduledData] = useState([]);
    const { scheduledData, setScheduledData } = useGlobalContext();
    const columns = [
        {
            title: '服務日期', dataIndex: 'service_date', key: 'service_date', width: 120,
            ...getColumnSearchProps('service_date', '服務日期', searchInput, setSearchText, searchText, setSearchedColumn, searchedColumn),
        },
        {
            title: '服務時間', dataIndex: 'service_time', key: 'service_time', width: 120,
            ...getColumnSearchProps('service_time', '服務時間', searchInput, setSearchText, searchText, setSearchedColumn, searchedColumn),
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
        {
            title: '地址', dataIndex: 'address', key: 'address', width: 160, ellipsis: { showTitle: false, },
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
            title: '技術員', dataIndex: 'staff', key: 'staff', width: 100, editable: true, ellipsis: { showTitle: false, },
            ...getColumnSearchProps('staff', '技術員', searchInput, setSearchText, searchText, setSearchedColumn, searchedColumn),
        },
        { title: '「加班」資料', dataIndex: 'overtime', key: 'overtime', width: 120, },
        { title: '「佣金種類」資料', dataIndex: 'money_type', key: 'money_type', width: 160, },
        { title: '「佣金%」資料', dataIndex: 'money_percent', key: 'money_percent', width: 160, },
        { title: '「服務週期」資料', dataIndex: 'period', key: 'period', width: 160, },
        { title: '「平日」資料', dataIndex: 'weekday', key: 'weekday', width: 120, },
        { title: '黑名單工作人員', dataIndex: 'blacklist', key: 'blacklist', width: 160, editable: true, },
        { title: '重要事項(變更提示) ', dataIndex: 'important', key: 'important', width: 160, editable: true, },
        { title: '於假期不用工作', dataIndex: 'holiday', key: 'holiday', width: 140, editable: true, },
        { title: '工作單編號', dataIndex: 'order_ID', key: 'order_ID', width: 140, },
        { title: '已確認', dataIndex: 'confirmed', key: 'confirmed', width: 140, editable: true, },
        { title: '備註', dataIndex: 'remark', key: 'remark', width: 140, editable: true, },
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
                inputType: (col.dataIndex === 'holiday' || col.dataIndex === 'confirmed') ? 'select' : 'text',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });
    const edit = (record) => {
        form.setFieldsValue({
            overtime_remark: '',
            staff: '',
            blacklist: '',
            important: '',
            holiday: '',
            confirmed: '',
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
            const newData = [...scheduledData];
            const index = newData.findIndex((item) => key === item.key);

            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, { ...item, ...row });
                setScheduledData(newData);
                setEditingKey('');
            } else {
                newData.push(row);
                setScheduledData(newData);
                setEditingKey('');
            }
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    };

    // table operation:delete
    const handleDelete = (key) => {
        const newData = scheduledData.filter((item) => item.key !== key);
        setScheduledData(newData);
    };

    // 手工导入外勤同事進度表
    const [loading, setLoading] = useState(false);
    const handleImport = useCallback((e) => {
        setLoading(true);
        const files = e.target.files;
        if (files) {
            const f = files[0];
            readXlsxToJson(f, (result) => {
                setLoading(false);
                setScheduledData(convertJsonData(result, columns));
            });
        }
    }, []);

    return (
        <div>
            <FlexFileInput text="導入已排班數據" accept=".xlsx,.xls" onChange={handleImport} />

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
                        dataSource={scheduledData}
                    />
                </Form>
            </div>
        </div>
    );
};
