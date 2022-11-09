import React, { useRef, useState } from 'react';
import { Button, Divider, Table, Tabs, Tooltip } from 'antd';
import { getColumnSearchProps } from '../common/TableFilter';
import FlexButton from '../common/FlexButton';
import ResTable from './ResTable';
import { useGlobalContext } from '../../App';
import ExportJsonExcel from 'js-export-excel';
import XLSX from 'xlsx';

window.XLSX = XLSX;

const { TabPane } = Tabs;

export default () => {
    // table filter
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);

    const {
        staffResult,
        setStaffResult,
        perStaffScheduledResult,
        setPerStaffScheduledResult,
        allStaffScheduledResult,
        setAllStaffScheduledResult,
        prevOrderResult,
        setPrevOrderResult,
        newOrderResult,
        setNewOrderResult,
        otherOrderResult,
        setOtherOrderResult,
    } = useGlobalContext();

    // 全部訂單
    const allColumns = [
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
            title: '加班備註', dataIndex: 'overtime_remark', key: 'overtime_remark', width: 100, ellipsis: { showTitle: false, },
            render: (text) => (
                <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
            ),
        },
        {
            title: '技術員', dataIndex: 'staff', key: 'staff', width: 100, ellipsis: { showTitle: false, },
            ...getColumnSearchProps('staff', '技術員', searchInput, setSearchText, searchText, setSearchedColumn, searchedColumn),
        },
        { title: '「加班」資料', dataIndex: 'overtime', key: 'overtime', width: 120, },
        { title: '「佣金種類」資料', dataIndex: 'money_type', key: 'money_type', width: 160, },
        { title: '「佣金%」資料', dataIndex: 'money_percent', key: 'money_percent', width: 160, },
        { title: '「服務週期」資料', dataIndex: 'period', key: 'period', width: 160, },
        { title: '「平日」資料', dataIndex: 'weekday', key: 'weekday', width: 120, },
        { title: '黑名單工作人員', dataIndex: 'blacklist', key: 'blacklist', width: 160, },
        { title: '重要事項(變更提示) ', dataIndex: 'important', key: 'important', width: 160, },
        { title: '於假期不用工作', dataIndex: 'holiday', key: 'holiday', width: 140, },
        { title: '工作單編號', dataIndex: 'order_ID', key: 'order_ID', width: 140, },
        { title: '已確認', dataIndex: 'confirmed', key: 'confirmed', width: 140, },
        { title: '備註', dataIndex: 'remark', key: 'remark', width: 140, },
    ];

    // 单个员工排班结果表
    const staffColumns = [
        {
            title: '員工編號', dataIndex: 'ID', key: 'ID', fixed: 'left', width: 120,
            ...getColumnSearchProps('ID', '員工編號', searchInput, setSearchText, searchText, setSearchedColumn, searchedColumn),
        },
        {
            title: '員工名稱', dataIndex: 'name', key: 'name', fixed: 'left', width: 120,
            ...getColumnSearchProps('name', '員工名稱', searchInput, setSearchText, searchText, setSearchedColumn, searchedColumn),
        },
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
        { title: '工作能力', dataIndex: 'ability', key: 'ability', width: 100, },
        { title: '可接受單量', dataIndex: 'capacity', key: 'capacity', width: 110, },
        {
            title: '實際服務時間', dataIndex: 'serviceTime', key: 'serviceTime', width: 120, ellipsis: { showTitle: false, },
            render: (serviceTime) => (
                <Tooltip placement="top" title={serviceTime}>
                    {serviceTime}
                </Tooltip>
            ),
        },
        { title: '不願服務的區', dataIndex: 'area', key: 'area', width: 120, },
        { title: '今日是否放假', dataIndex: 'vacation', key: 'vacation', width: 120, },
        { title: '當日薪金', dataIndex: 'profit', key: 'profit', width: 120, className: 'col_background', },
        {
            title: '達到薪金要求', dataIndex: 'reach_profit', key: 'reach_profit', width: 140, className: 'col_background',
            ...getColumnSearchProps('reach_profit', '達到薪金要求', searchInput, setSearchText, searchText, setSearchedColumn, searchedColumn),

        },
        { title: '今日已安排單量', dataIndex: 'total_order', key: 'total_order', width: 160, className: 'col_background', },
        {
            title: '今日是否還能接單', dataIndex: 'can_receive_order', key: 'can_receive_order', width: 170, className: 'col_background',
            ...getColumnSearchProps('can_receive_order', '今日是否还能接单', searchInput, setSearchText, searchText, setSearchedColumn, searchedColumn),
        },
        { title: '今日所在區 ', dataIndex: 'region', key: 'region', width: 160, className: 'col_background', },
        {
            title: '操作',
            dataIndex: 'operation',
            fixed: 'right',
            width: 160,
            render: (_, record) => (
                <Button type='link' onClick={() => { showPersonalSchedule(record) }}>Show Schedule</Button>
            )
        },
    ];
    const [subDatas, setSubDatas] = useState([]);
    const subColumns = [...allColumns];
    const [selectedStaff, setSelectedStaff] = useState('');
    const showPersonalSchedule = (record) => {
        setSelectedStaff(record.ID);
        const data = perStaffScheduledResult.find((per) => per.id === record.ID);
        const perSchedule = data.data_list || [];
        setSubDatas(perSchedule);
    }

    // 舊單
    const [orderSearchText, setOrderSearchText] = useState('');
    const [orderSearchedColumn, setOrderSearchedColumn] = useState('');
    const orderSearchInput = useRef(null);
    const orderColumns = [
        {
            title: '公司', dataIndex: 'company', key: 'company', width: 120,
            ...getColumnSearchProps('company', '公司', orderSearchInput, setOrderSearchText, orderSearchText, setOrderSearchedColumn, orderSearchedColumn),
        },
        {
            title: '工作單編號', dataIndex: 'order_ID', key: 'order_ID', width: 120, ellipsis: { showTitle: false, },
            ...getColumnSearchProps('order_ID', '工作單編號', orderSearchInput, setOrderSearchText, orderSearchText, setOrderSearchedColumn, orderSearchedColumn),
        },
        {
            title: '服務', dataIndex: 'type', key: 'type', width: 100,
            ...getColumnSearchProps('type', '服務', orderSearchInput, setOrderSearchText, orderSearchText, setOrderSearchedColumn, orderSearchedColumn),
        },
        {
            title: '工作單日期', dataIndex: 'order_Date', key: 'order_Date', width: 120, ellipsis: { showTitle: false, },
            ...getColumnSearchProps('order_Date', '工作單日期', orderSearchInput, setOrderSearchText, orderSearchText, setOrderSearchedColumn, orderSearchedColumn),
        },
        {
            title: '客戶編號', dataIndex: 'customer_ID', key: 'customer_ID', width: 120, ellipsis: { showTitle: false, },
            ...getColumnSearchProps('customer_ID', '客戶編號', orderSearchInput, setOrderSearchText, orderSearchText, setOrderSearchedColumn, orderSearchedColumn),
        },
        {
            title: '客戶名稱', dataIndex: 'name', key: 'name', width: 120, ellipsis: { showTitle: false, },
            ...getColumnSearchProps('name', '客戶名稱', orderSearchInput, setOrderSearchText, orderSearchText, setOrderSearchedColumn, orderSearchedColumn),
        },
        {
            title: '服務人員', dataIndex: 'staff', key: 'staff', width: 120, ellipsis: { showTitle: false, },
            ...getColumnSearchProps('staff', '服務人員', orderSearchInput, setOrderSearchText, orderSearchText, setOrderSearchedColumn, orderSearchedColumn),
        },
        {
            title: '現在服務人員', dataIndex: 'current_staff', key: 'current_staff', width: 120, className: 'col_background', ellipsis: { showTitle: false, },
            ...getColumnSearchProps('current_staff', '現在服務人員', orderSearchInput, setOrderSearchText, orderSearchText, setOrderSearchedColumn, orderSearchedColumn),
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
            ...getColumnSearchProps('status', '狀態', searchInput, setOrderSearchText, orderSearchText, setOrderSearchedColumn, orderSearchedColumn),
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
    ];

    return (
        <div className="page">
            <h1>排班方案</h1>
            <Tabs id='mainTabs' defaultActiveKey="1">
                <TabPane tab="員工角度" key="1">
                    <div className="table-container" style={{ marginTop: '16px' }}>
                        <Table
                            bordered
                            scroll={{
                                x: 'calc(600px + 50%)',
                                y: 500,
                            }}
                            columns={staffColumns}
                            dataSource={staffResult}
                        />

                        <Divider />

                        <div className='sub-table-container'>
                            <h1 style={{ textAlign: 'center' }}>員工{selectedStaff}個人排班詳情</h1>
                            <FlexButton text="導出個人排班結果" onClick={() => handleExport(subColumns, subDatas, selectedStaff + '個人排班結果_' + subDatas[0].service_date)} />
                            <Table
                                style={{ marginTop: 16 }}
                                bordered
                                scroll={{
                                    x: 'calc(800px + 50%)',
                                    y: 500,
                                }}
                                columns={subColumns}
                                dataSource={subDatas}
                                rowClassName={(record, index) => {
                                    return (record.order_type === 2 ? 'row_background_2' : (record.order_type === 3 ? 'row_background_3' : (record.order_type === 4 ? 'row_background_4' : '')))
                                }}
                            />
                        </div>
                    </div>
                </TabPane>
                <TabPane tab="訂單角度" key="2">
                    <Tabs id='order_subTabs' defaultActiveKey="1" centered>
                        <TabPane tab="全體排班（更新的外勤同事進度表）" key="1">
                            <FlexButton style={{ marginLeft: 16 }} text="導出全體排班結果" onClick={() => handleExport(allColumns, allStaffScheduledResult, '全體排班結果_' + allStaffScheduledResult[0].service_date)} />
                            <div className="table-container" style={{ marginTop: '16px' }}>
                                <Table
                                    bordered
                                    scroll={{
                                        x: 'calc(800px + 50%)',
                                        y: 500,
                                    }}
                                    columns={allColumns}
                                    dataSource={allStaffScheduledResult}
                                />
                            </div>
                        </TabPane>

                        <TabPane tab="舊單重排" key="2">
                            <FlexButton style={{ marginLeft: 16 }} text="導出舊單重排結果" onClick={() => handleExport(orderColumns, prevOrderResult, '舊單重排結果')} />
                            <div className="table-container" style={{ marginTop: '16px' }}>
                                <Table
                                    bordered
                                    scroll={{
                                        x: 'calc(800px + 50%)',
                                        y: 500,
                                    }}
                                    columns={orderColumns}
                                    dataSource={prevOrderResult}
                                />
                            </div>
                        </TabPane>
                        <TabPane tab="新訂單_餐飲" key="3">
                            <ResTable type={'newRes'} ButtonText={'導出新訂單（餐飲）結果'} ExportTitle={'新訂單（餐飲）結果'} dataSource={newOrderResult}></ResTable>
                        </TabPane>
                        <TabPane tab="新訂單_非餐飲" key="4">
                            <ResTable type={'newNonRes'} ButtonText={'導出新訂單（非餐飲）結果'} ExportTitle={'新訂單（非餐飲）結果'} dataSource={otherOrderResult}></ResTable>
                        </TabPane>
                    </Tabs>
                </TabPane>
            </Tabs>
        </div>
    );
};


export function handleExport(tableColumns, tableData, fileName) {
    if (tableData.length > 0) {
        let headers = tableColumns.map((col) => {
            return col.title;
        });
        let filters = tableColumns.map((col) => {
            return col.dataIndex;
        });
        let dataTable = [];
        tableData.map((td) => {
            let obj = {}
            filters.forEach((key) => {
                obj[key] = td[key];
            });
            dataTable.push(obj);
        });
        var option = {};
        option.fileName = fileName;
        option.datas = [
            {
                sheetData: dataTable,
                sheetName: 'sheet',
                sheetFilter: filters,
                sheetHeader: headers,
            }
        ];
        var toExcel = new ExportJsonExcel(option);
        toExcel.saveExcel();
    }
};
