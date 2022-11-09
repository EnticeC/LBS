import React, { useCallback, useRef, useState } from 'react';
import { Popconfirm, Table, Tooltip, Typography } from 'antd';
import FlexButton from '../common/FlexButton';
import { handleExport } from './ScheduleResult';
import { useGlobalContext } from '../../App';

export default () => {

    const { staffResult, setStaffResult } = useGlobalContext();

    const staffColumns = [
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
        { title: '當日薪金', dataIndex: 'profit', key: 'profit', width: 120, editable: true, },
        { title: '達到薪金要求', dataIndex: 'reach_profit', key: 'reach_profit', width: 120, editable: true, },
    ];

    return (
        <div className="page">
            <h1>员工数据</h1>
            <FlexButton style={{ marginLeft: 16 }} text="导出员工数据" onClick={() => handleExport(allColumns, allDataSource, '员工数据')} />
            <div className="table-container" style={{ marginTop: '16px' }}>
                <Table
                    bordered
                    scroll={{
                        x: 'calc(800px + 50%)',
                        y: 500,
                    }}
                    columns={staffColumns}
                    dataSource={staffResult}
                />
            </div>
        </div>
    );
};
