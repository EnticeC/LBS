import React, { useState } from 'react';
import { Steps } from 'antd';
import ScheduledOrders from './ScheduledOrders';
import MonthlyOrders from './MonthlyOrders';
import PrevOrders from './PrevOrders';
import NewOrders from './NewOrders';
import EmployeeInfo from './EmployeeInfo';
import Run from './Run';
import { useGlobalContext } from '../../App';

const { Step } = Steps;
const steps = [
    { key: 1, title: '已排班數據', content: <ScheduledOrders />, },
    { key: 2, title: '本月每日工作單', content: <MonthlyOrders />, },
    { key: 3, title: '舊單重排', content: <PrevOrders />, },
    { key: 4, title: '新訂單', content: <NewOrders />, },
    { key: 5, title: '員工信息', content: <EmployeeInfo />, },
    { key: 6, title: '運行排班', content: <Run />, },
];

export default () => {
    const { runType, setRunType } = useGlobalContext();

    const [current, setCurrent] = useState(0);
    const onChange = (value) => {
        setCurrent(value);
        setRunType('normal');
    };

    return (
        <div className="page">
            <Steps current={current} onChange={onChange}>
                {steps.map((item) => (
                    <Step key={item.key} title={item.title} />
                ))}
            </Steps>

            <div className="steps-content">{steps[current].content}</div>
        </div>
    );
};
