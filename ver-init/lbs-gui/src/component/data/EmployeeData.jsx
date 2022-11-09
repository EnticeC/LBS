import React, { useCallback, useState } from 'react';
import { Form, Popconfirm, Table, Tooltip, Typography } from 'antd';
import '../../css/table.css';
import FlexFileInput from '../common/FlexFileInput';
import { readXlsxToJson } from '../../utils/xlsx';
import { EditableCell } from './EditableCell';
import { useGlobalContext } from '../../App';

export default () => {
    // const [employeeDatas, setEmployeeDatas] = useState([]);
    const { employeeDatas, setEmployeeDatas } = useGlobalContext();
    const columns = [
        { title: '員工編號', dataIndex: 'ID', key: 'ID', fixed: 'left', width: 100, },
        { title: '員工名稱', dataIndex: 'name', key: 'name', fixed: 'left', width: 100, },
        {
            title: '技能組合',
            children: [
                { title: '清潔常規', dataIndex: 'skill_1', key: 'skill_1', align: 'center', width: 100, },
                { title: '首次清潔', dataIndex: 'skill_2', key: 'skill_2', align: 'center', width: 100, },
                { title: '滅蟲常規', dataIndex: 'skill_3', key: 'skill_3', align: 'center', width: 100, },
                { title: '首次滅蟲', dataIndex: 'skill_4', key: 'skill_4', align: 'center', width: 100, },
                { title: '焗霧', dataIndex: 'skill_5', key: 'skill_5', align: 'center', width: 80, },
                { title: '噴灑', dataIndex: 'skill_6', key: 'skill_6', align: 'center', width: 80, },
                { title: '霧化消毒', dataIndex: 'skill_7', key: 'skill_7', align: 'center', width: 100, },
                { title: '家居', dataIndex: 'skill_8', key: 'skill_8', align: 'center', width: 80, },
                { title: '床蝨', dataIndex: 'skill_9', key: 'skill_9', align: 'center', width: 80, },
                { title: '白蟻', dataIndex: 'skill_10', key: 'skill_10', align: 'center', width: 80, },
                { title: '全效清潔', dataIndex: 'skill_11', key: 'skill_11', align: 'center', width: 100, },
                { title: '油箱', dataIndex: 'skill_12', key: 'skill_12', align: 'center', width: 80, },
                { title: '廚房', dataIndex: 'skill_13', key: 'skill_13', align: 'center', width: 80, },
                { title: '甲醛', dataIndex: 'skill_14', key: 'skill_14', align: 'center', width: 80, },
            ],
        },
        {
            title: '所屬群組',
            tips: '員工屬於多個群組，安排任務時的優先次序 A-C',
            children: [
                { title: '首次', dataIndex: 'group_1', key: 'group_1', align: 'center', width: 60, },
                { title: '常規', dataIndex: 'group_2', key: 'group_2', align: 'center', width: 60, },
                { title: '夜間', dataIndex: 'group_3', key: 'group_3', align: 'center', width: 60, },
                { title: '油箱', dataIndex: 'group_4', key: 'group_4', align: 'center', width: 60, },
                { title: '廚房', dataIndex: 'group_5', key: 'group_5', align: 'center', width: 60, },
                { title: 'STI', dataIndex: 'group_6', key: 'group_6', align: 'center', width: 60, },
            ],
        },
        { title: '是否屬於衛星辦公室（屯門）', dataIndex: 'isTunMenOffice', key: 'isTunMenOffice', align: 'center', width: 100, },
        {
            title: '僱傭類別',
            children: [
                { title: '全職', dataIndex: 'fulltime', key: 'fulltime', align: 'center', width: 60, },
                { title: '兼職', dataIndex: 'parttime', key: 'parttime', align: 'center', width: 60, },
            ],
        },
        {
            title: '工作時間類別',
            children: [
                { title: '工作日', dataIndex: 'weekday', key: 'weekday', align: 'center', width: 80, },
                { title: '中更', dataIndex: 'midday', key: 'midday', align: 'center', width: 60, },
                { title: '夜晚', dataIndex: 'evening', key: 'evening', align: 'center', width: 60, },
                { title: '假日', dataIndex: 'holiday', key: 'holiday', align: 'center', width: 60, },
            ],
        },
        { title: '工作能力', dataIndex: 'ability', key: 'ability', width: 100, },
        { title: '可接受單量', dataIndex: 'capacity', key: 'capacity', width: 120, editable: true, },
        {
            title: '實際服務時間', dataIndex: 'serviceTime', key: 'serviceTime', width: 120, ellipsis: { showTitle: false, },
            render: (serviceTime) => (
                <Tooltip placement="top" title={serviceTime}>
                    {serviceTime}
                </Tooltip>
            ),
        },
        {
            title: '薪水結算體系',
            children: [
                { title: '正班', dataIndex: 'regular', key: 'regular', align: 'center', width: 80, },
                { title: '加班', dataIndex: 'overtime', key: 'overtime', align: 'center', width: 80, },
            ],
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
                inputType: col.dataIndex === 'capacity' ? 'number' : 'text',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });
    const edit = (record) => {
        form.setFieldsValue({
            capacity: '',
            area: '',
            vacation: '',
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

    // Deal imported Data
    const selectOnChange = useCallback((e) => {
        const files = e.target.files;
        if (files) {
            const f = files[0];
            readXlsxToJson(f, (result) => {
                setEmployeeDatas(convertArrayData(result, columns));
            });
        }
    }, []);

    return (
        <div className="page">
            <h1 style={{ paddingLeft: '6px' }}>員工數據</h1>

            <FlexFileInput text="上傳員工數據" accept=".xlsx,.xls" onChange={selectOnChange} />

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
                        columns={mergedColumns}
                        dataSource={employeeDatas}
                    />
                </Form>
            </div>
        </div>
    );
};

export function convertArrayData(original, originalColumns) {
    return original.map((o, index) => {
        const n = {};
        n['key'] = index;
        originalColumns.forEach((col, i) => {
            if (!col.children) {
                n[col.dataIndex] = o[col.title];
            } else {
                col.children.forEach(child => {
                    if (col.title === '技能組合' && child.title === '油箱') {
                        n[child.dataIndex] = o['技能組合_油箱'];
                    } else if (col.title === '技能組合' && child.title === '廚房') {
                        n[child.dataIndex] = o['技能組合_廚房'];
                    } else if (col.title === '所屬群組' && child.title === '油箱') {
                        n[child.dataIndex] = o['所屬群組_油箱'];
                    } else if (col.title === '所屬群組' && child.title === '廚房') {
                        n[child.dataIndex] = o['所屬群組_廚房'];
                    } else {
                        n[child.dataIndex] = o[child.title];
                    }
                });
            }
        });
        return n;
    });
}
