import React, { useCallback, useState } from 'react';
import { Form, Popconfirm, Table, Typography } from 'antd';
import '../../css/table.css';
import FlexButton from '../common/FlexButton';
import FlexFileInput from '../common/FlexFileInput';
import { readXlsxToJson } from '../../utils/xlsx';
import { convertJsonData } from '../../utils/data';
import { EditableCell } from './EditableCell';
import { useGlobalContext } from '../../App';

export default () => {
    const { skillDatas, setSkillDatas } = useGlobalContext();

    const columns = [
        { title: '技能編號', dataIndex: 'id', key: 'id', },
        { title: '技能名稱', dataIndex: 'name', key: 'name', editable: true, },
        {
            title: '操作',
            dataIndex: 'operation',
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
            id: '',
            name: '',
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
            const newData = [...skillDatas];
            const index = newData.findIndex((item) => key === item.key);

            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, { ...item, ...row });
                setSkillDatas(newData);
                setEditingKey('');
            } else {
                newData.push(row);
                setSkillDatas(newData);
                setEditingKey('');
            }
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    };

    // row operation:delete
    const handleDelete = (key) => {
        const newData = skillDatas.filter((item) => item.key !== key);
        setSkillDatas(newData);
        setCount(count - 1);
    };

    // add a row in table
    const [count, setCount] = useState(14);
    const handleAdd = () => {
        const newData = {
            key: count,
            id: `${count}`,
            name: `新技能 ${count}`,
        };
        setSkillDatas([...skillDatas, newData]);
        setCount(count + 1);
    };

    // Deal imported Data
    const selectOnChange = useCallback((e) => {
        const files = e.target.files;
        if (files) {
            const f = files[0];
            readXlsxToJson(f, (result) => {
                setSkillDatas(convertJsonData(result, columns));
            });
        }
    }, []);

    return (
        <div className="page">
            <h1 style={{ paddingLeft: '6px' }}>技能數據</h1>

            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <FlexFileInput text="上傳技能數據" accept=".xlsx,.xls" onChange={selectOnChange} />
                <div style={{ marginLeft: 16 }}><FlexButton text="新增一條技能" onClick={handleAdd} /></div>
            </div>

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
                            y: 500,
                        }}
                        pagination={false}
                        columns={mergedColumns}
                        dataSource={skillDatas}
                    />
                </Form>
            </div>
        </div>
    );
};
