import React from 'react';
import { Form, Popconfirm, Table, Tooltip, Typography } from 'antd';

const isEditing = (record) => record.key === editingKey;

export const getRowOperation = () => ({
    render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
            <span>
                <Typography.Link onClick={() => save(record.key)} style={{ marginRight: 8, }} >
                    Save
                </Typography.Link>
                <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
                    <a>Cancel</a>
                </Popconfirm>
            </span>
        ) : (
            <span>
                <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)} style={{ marginRight: 8, }} >
                    Edit
                </Typography.Link>
                <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.key)}>
                    <a>Delete</a>
                </Popconfirm>
            </span>

        )
    }
});