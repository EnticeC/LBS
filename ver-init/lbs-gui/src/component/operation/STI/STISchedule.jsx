import React, { useState } from 'react';
import { Steps } from 'antd';
import STIScheduledOrders from './STIScheduledOrders';
import STIOrders from './STIOrders';
import FogOrders from './FogOrders';
import Run from './../Run';
import { useGlobalContext } from '../../../App';

const { Step } = Steps;
const steps = [
    { key: 1, title: '全部工单', content: <STIScheduledOrders />, },
    { key: 2, title: 'STI', content: <STIOrders />, },
    { key: 3, title: '焗霧服務', content: <FogOrders />, },
    { key: 4, title: '運行排班', content: <Run />, },
];

export default () => {
    const { runType, setRunType } = useGlobalContext();

    const [current, setCurrent] = useState(0);
    const onChange = (value) => {
        setCurrent(value);
        setRunType('STI');
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
