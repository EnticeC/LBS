import React, { useCallback, useState } from 'react';
import { Popconfirm, Table } from 'antd';
import '../../css/table.css';
import FlexFileInput from '../common/FlexFileInput';
import { readXlsxToJson } from '../../utils/xlsx';
import { convertJsonData } from '../../utils/data';
import { useGlobalContext } from '../../App';

export default () => {
    // const [serviceDatas, setServiceDatas] = useState([]);
    const { serviceDatas, setServiceDatas } = useGlobalContext();
    const columns = [
        { title: '服務編號', dataIndex: 'id', key: 'id', align: 'center', width: 100, },
        { title: '服務內容', dataIndex: 'content', key: 'content', align: 'center', width: 100, },
        { title: '服務種類', dataIndex: 'type', key: 'type', align: 'center', width: 100, },
        { title: '所屬公司', dataIndex: 'customer_ID', key: 'customer_ID', align: 'center', width: 100, },
        { title: '所屬大類', dataIndex: 'category', key: 'category', align: 'center', width: 100, },
        { title: '所需技能組合', dataIndex: 'skills', key: 'skills', align: 'center', width: 120, },
        { title: '所需員工數目', dataIndex: 'range', key: 'range', align: 'center', width: 120, },
        {
            title: '所需基礎服務時間（單位：分鐘）', children: [
                { title: '首次', dataIndex: 'firstTime', key: 'firstTime', align: 'center', width: 80, },
                { title: '常規', dataIndex: 'normalTime', key: 'normalTime', align: 'center', width: 80, },
            ],
        },
        { title: '所需設備種類', dataIndex: 'machine', key: 'machine', align: 'center', width: 120, },
        { title: '所需物資種類', dataIndex: 'material', key: 'material', align: 'center', width: 120, },
        { title: '與哪種服務有“衝突”', dataIndex: 'conflict', key: 'conflict', align: 'center', width: 160, },
        { title: '是否STI', dataIndex: 'STI', key: 'STI', align: 'center', width: 100, },
        { title: '是否需要車輛資源', dataIndex: 'bus', key: 'bus', align: 'center', width: 160, },
        { title: '可否24/7', dataIndex: 'check', key: 'check', align: 'center', width: 100, },
        { title: '其他', dataIndex: 'remark', key: 'remark', align: 'center', width: 80, },
        {
            title: '操作',
            dataIndex: 'operation',
            fixed: 'right',
            width: 120,
            render: (_, record) =>
                serviceDatas.length >= 1 ? (
                    <div>
                        <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.key)}>
                            <a>刪除</a>
                        </Popconfirm>
                    </div>
                ) : null,
        },
    ];

    // table operation:delete
    const handleDelete = (key) => {
        const newData = serviceDatas.filter((item) => item.key !== key);
        setServiceDatas(newData);
    };

    // Deal imported Data
    const selectOnChange = useCallback((e) => {
        const files = e.target.files;
        if (files) {
            const f = files[0];
            readXlsxToJson(f, (result) => {
                setServiceDatas(convertJsonData(result, columns));
            });
        }
    }, []);

    return (
        <div className="page">
            <h1 style={{ paddingLeft: '6px' }}>服務數據</h1>

            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <FlexFileInput text="上傳服務數據" accept=".xlsx,.xls" onChange={selectOnChange} />
            </div>

            <div className="table-container" style={{ marginTop: '16px' }}>
                <Table
                    bordered
                    scroll={{
                        x: 'calc(800px + 50%)',
                        y: 500,
                    }}
                    columns={columns}
                    dataSource={serviceDatas}
                />
            </div>
        </div>
    );
};
