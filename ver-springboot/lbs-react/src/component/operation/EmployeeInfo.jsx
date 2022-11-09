import React, { useCallback, useRef, useState } from 'react';
import { Form, Popconfirm, Table, Tooltip, Typography } from 'antd';
import FlexFileInput from '../common/FlexFileInput';
import { readXlsxToJson } from '../../utils/xlsx';
import { convertJsonData } from '../../utils/data';
import { getColumnSearchProps } from '../common/TableFilter';
import { EditableCell } from '../data/EditableCell';
import { useGlobalContext } from '../../App';

export default () => {
    // TableColumn filter
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    // table
    const { employeeDatas,setEmployeeDatas } = useGlobalContext();
    const columns = [
        {
            title: '員工編號', dataIndex: 'ID', key: 'ID', width: 120,
            ...getColumnSearchProps('ID', '員工編號', searchInput, setSearchText, searchText, setSearchedColumn, searchedColumn),
        },
        {
            title: '員工名稱', dataIndex: 'name', key: 'name', width: 120,
            ...getColumnSearchProps('name', '員工名稱', searchInput, setSearchText, searchText, setSearchedColumn, searchedColumn),
        },
        {
            title: '僱傭類別',
            children: [
                { title: '全職', dataIndex: 'fulltime', key: 'fulltime', align: 'center', width: 80, },
                { title: '兼職', dataIndex: 'parttime', key: 'parttime', align: 'center', width: 80, },
            ],
        },
        {
            title: '工作時間類別',
            children: [
                { title: '工作日', dataIndex: 'weekday', key: 'weekday', align: 'center', width: 100, },
                { title: '中更', dataIndex: 'midday', key: 'midday', align: 'center', width: 80, },
                { title: '夜晚', dataIndex: 'evening', key: 'evening', align: 'center', width: 80, },
                { title: '假日', dataIndex: 'holiday', key: 'holiday', align: 'center', width: 80, },
            ],
        },
        { title: '工作能力', dataIndex: 'ability', key: 'ab/*  */ility', width: 100, editable: true, },
        { title: '可接受單量', dataIndex: 'capacity', key: 'capacity', width: 120, editable: true, },
        {
            title: '實際服務時間', dataIndex: 'serviceTime', key: 'serviceTime', width: 120,
            editable: true,
            ellipsis: {
                showTitle: false,
            },
            render: (serviceTime) => (
                <Tooltip placement="top" title={serviceTime}>
                    {serviceTime}
                </Tooltip>
            ),
        },
        { title: '不願服務的區', dataIndex: 'area', key: 'area', width: 120, editable: true, },
        { title: '今日是否放假', dataIndex: 'vacation', key: 'vacation', width: 120, editable: true, },
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
                inputType: col.dataIndex === 'workload' ? 'number' : (col.dataIndex === 'vacation' ? 'select' : 'text'),
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });
    const edit = (record) => {
        form.setFieldsValue({
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
            const newData = [...employeeDatas];
            const index = newData.findIndex((item) => key === item.key);

            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, { ...item, ...row });
                setEmployeeDatas(newData);
                setEditingKey('');
            } else {
                newData.push(row);
                setEmployeeDatas(newData);
                setEditingKey('');
            }
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    };

    // table operation:delete
    const handleDelete = (key) => {
        const newData = employeeDatas.filter((item) => item.key !== key);
        setEmployeeDatas(newData);
    };


    // 手工导入员工信息
    const [loading, setLoading] = useState(false);
    const handleImport = useCallback((e) => {
        setLoading(true);
        const files = e.target.files;
        if (files) {
            const f = files[0];
            readXlsxToJson(f, (result) => {
                setLoading(false);
                setEmployeeDatas(convertJsonData(result, columns));
            });
        }
    }, []);

    return (
        <div>
            {/* <FlexFileInput text="導入員工信息" accept=".xlsx,.xls" onChange={handleImport} /> */}
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
                        dataSource={employeeDatas}
                    />
                </Form>
            </div>
        </div>
    );
};
