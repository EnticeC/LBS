import React from 'react';
import { Form, Input, InputNumber, Select, } from 'antd';

const { Option } = Select;

export const EditableCell = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
}) => {
    const inputNode =
        inputType === 'number' ? <InputNumber /> :
            (inputType === 'select' ? (
                <Select>
                    <Option value="true">TRUE</Option>
                    <Option value="false">FALSE</Option>
                </Select>
            ) : <Input />);
    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                    name={dataIndex}
                    style={{
                        margin: 0,
                    }}
                    rules={[
                        {
                            required: true,
                            message: `Please Input ${title}!`,
                        },
                    ]}
                >
                    {inputNode}
                </Form.Item>
            ) : (
                children
            )}
        </td>
    );
};
