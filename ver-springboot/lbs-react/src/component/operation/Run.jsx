import React, { useCallback, useState } from 'react';
import { Button, DatePicker, Progress, Typography } from 'antd';
import { CheckCircleTwoTone, LoadingOutlined } from '@ant-design/icons';
import { useGlobalContext } from '../../App';
import { group_zh, staff_fields } from '../../settings/data-headers';

const { Text } = Typography;

export default () => {
    const {
        runType,
        setRunType,
        STIData,
        STIOrderData,
        fogOrderData,
        skillDatas,
        regionDatas,
        employeeDatas,
        serviceDatas,
        scheduledData,
        dailyData,
        prevOrderData,
        newOrderData,
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

    console.log(runType)

    const resOrder = newOrderData.filter((order) => { return order.orderType === '餐飲客' });
    const nonresOrder = newOrderData.filter((order) => { return order.orderType === '非餐飲客' });

    const [selectedDate, setSelectedDate] = useState('');
    const [buttonDisable, setButtonDisable] = useState(true);
    const [loading, setLoading] = useState(false);
    const [percent, setPercent] = useState(0);
    const [status, setStatus] = useState(false);
    const [progressMsg, setProgressMsg] = useState('');


    const runSchedule = useCallback(async () => {

        setStatus(false);
        setLoading(true);

        //员工数据格式处理
        const staffs = employeeDatas.map((employee) => {
            let staff = { ...employee };
            staff.ID = employee.ID;
            staff.name = employee.name;
            let skills = [];
            for (let i = 1; i < 15; i++) {
                if (employee['skill_' + i] === 'Y') {
                    skills.push(i);
                }
                staff.skills = skills.join(',');
            }
            let group = [];
            for (let j = 1; j < 7; j++) {
                if (employee['group_' + j]) {
                    group.push(group_zh[j - 1]);
                }
                staff.group = group.join(',');
            }
            if (employee['capacity']) {
                staff.capacity = parseInt(employee['capacity']);
            } else {
                staff.capacity = 4;
            }
            return staff;
        });

        // java算法请求
        let params;
        if (runType === 'normal') {
            scheduledData.forEach((element) => {
                return element.blacklist = '';
            });

            params = {
                "staff_data": staffs,// args[0]员工信息 必要property:[{ID:'',name:'',skills:'',group:'',capacity:''}]
                "skill_data": skillDatas,// args[1]技能数据 必要property:[{id:'', name:''}]
                "service_data": serviceDatas,// args[2]服务数据 必要property:[{type:'',customer_ID:'',skills:'',people:''}]
                "region_data": regionDatas,// args[3]分区数据
                "scheduled_data": scheduledData,// args[4]6月外勤同事進度表
                "daily_data": dailyData,// args[5]本月每日工作单
                "prevOrder_data": prevOrderData,// args[6]舊單重排
                "resOrder_data": resOrder,// args[7]餐飲新訂單
                "nonresOrder_data": nonresOrder,// args[8]非餐饮新訂單
                "selected_date": selectedDate,// args[9]排班日期
            };
        } else {
            // STI排班
            STIData.forEach((element) => {
                return element.blacklist = '';
            });

            params = {
                "staff_data": staffs,// args[0]员工信息 必要property:[{ID:'',name:'',skills:'',group:'',capacity:''}]
                "skill_data": skillDatas,// args[1]技能数据 必要property:[{id:'', name:''}]
                "service_data": serviceDatas,// args[2]服务数据 必要property:[{type:'',customer_ID:'',skills:'',people:''}]
                "region_data": regionDatas,// args[3]分区数据
                "STI_data": STIData,// args[4]全部工作单
                "STIOrder_data": STIOrderData,// // args[5]STI服务
                "fogOrder_data": fogOrderData,// // args[6]焗霧服務
            };
        }

        const res = await (
            await fetch('http://localhost:8080/runScheduling', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(params),
            })
        ).json();

        console.log(res)

        setProgressMsg('運行中...');

        if (res.code == 200) {
            if (runType === 'normal') {
                const staffResults = res.data['员工数据'].map((uuid) => {
                    const staff = employeeDatas.find((employee) => employee.ID === uuid.id);
                    const staffInit = Object.assign(staff, uuid);
                    staffInit.can_receive_order = staffInit.can_receive_order.toString();
                    return staffInit;
                });
                setStaffResult(staffResults);

                // 單個員工
                const perResults = res.data['个人排班'].map((per) => {
                    per.data_list.forEach((list, index) => {
                        list.key = index;
                        return list;
                    });
                    return per;
                });
                setPerStaffScheduledResult(perResults);

                // 全體員工
                const allResults = res.data['全体排班'].map((all, index) => {
                    const init = { ...scheduledData.find((sche) => sche.order_ID === all.order_ID) };
                    const all_init = Object.assign(init, all);
                    return all_init;
                });
                setAllStaffScheduledResult(allResults);

                // 舊單重排
                const prevResults = res.data['旧单重排'].map((prev, index) => {
                    const prevInit = prevOrderData.find((order) => order.order_ID === prev.order_ID);
                    const prev_init = Object.assign(prevInit, prev);
                    return prev_init;
                });
                setPrevOrderResult(prevResults);

                // 新餐飲
                const newResults = res.data['新餐饮订单'].map((res, index) => {
                    const newInit = resOrder.find((order) => order.order_ID === res.order_ID);
                    const new_init = Object.assign(newInit, res);
                    return new_init;
                });
                setNewOrderResult(newResults);

                // 新非餐飲
                const nonResults = res.data['新非餐饮订单'].map((tmp, index) => {
                    const otherInit = nonresOrder.find((other) => (other.order_ID === tmp.order_ID));
                    const other_init = Object.assign(otherInit, tmp);
                    return other_init;
                });
                setOtherOrderResult(nonResults);
            } else {

            }

            setProgressMsg('運行成功！在左側“結果”部分可以查看和保存排程結果');
            setPercent(100);
            setStatus(true);
            setLoading(false);

        } else {
            setProgressMsg(res.msg);
            return;
        }
    });

    const onChange = (date, dateString) => {
        console.log(dateString);
        setSelectedDate(dateString);
        setButtonDisable(dateString === '');
    };

    return (
        <div style={{ padding: '16px 0px' }}>
            <div>
                <label>排班日期：</label>
                <DatePicker onChange={onChange} />
            </div>
            <div style={{ marginTop: 16 }}>
                <label>运行排班：</label>
                <Button type="default" disabled={buttonDisable} loading={loading} onClick={runSchedule}>Run Schedule</Button>
            </div>

            {loading && (
                <div style={{ marginTop: 32, textAlign: 'center' }}>
                    <div className='desc' >
                        <Text><LoadingOutlined style={{ marginRight: '5px' }} />{progressMsg}</Text>
                    </div>
                    <Progress percent={percent} />
                </div>
            )}

            {status && (
                <div className='desc' style={{ marginTop: 32, textAlign: 'center' }}>
                    <Text><CheckCircleTwoTone twoToneColor="#52c41a" style={{ marginRight: '5px' }} />{progressMsg}</Text>
                </div>
            )}
        </div>
    );
};