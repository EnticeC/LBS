import { spawn } from 'child_process';
import { ipcRenderer } from 'electron';
import fs from 'fs';
import tmp from 'tmp';
import React, { useCallback, useState } from 'react';
import { Button, DatePicker, Progress, Typography } from 'antd';
import moment from 'moment';
import { CheckCircleTwoTone, LoadingOutlined } from '@ant-design/icons';
import { useGlobalContext } from '../../App';
import { group_zh, staff_fields } from '../../settings/data-headers'

// const { RangePicker } = DatePicker;
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

        // args[0]技能数据 必要property:[{id:'', name:''}]
        fs.writeFile('./json/skills.json', JSON.stringify(skillDatas), 'utf8', (err) => {
            if (err) {
                console.log(err);
            }
        });
        const skill_file_obj = tmp.fileSync({ postfix: '.json' });
        const skill_file = skill_file_obj.name;
        fs.writeFileSync(skill_file, JSON.stringify(skillDatas), 'utf8');

        // args[1]员工信息 必要property:[{ID:'',name:'',skills:'',group:'',capacity:''}]
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
        })
        fs.writeFile('./json/employeeDatas.json', JSON.stringify(staffs), 'utf8', (err) => {
            if (err) {
                console.log(err);
            }
        });
        const employee_file_obj = tmp.fileSync({ postfix: '.json' });
        const employee_file = employee_file_obj.name;
        fs.writeFileSync(employee_file, JSON.stringify(staffs), 'utf8');

        // args[2]服务数据 必要property:[{type:'',customer_ID:'',skills:'',people:''}]
        fs.writeFile('./json/serviceDatas.json', JSON.stringify(serviceDatas), 'utf8', (err) => {
            if (err) {
                console.log(err);
            }
        });
        const service_file_obj = tmp.fileSync({ postfix: '.json' });
        const service_file = service_file_obj.name;
        fs.writeFileSync(service_file, JSON.stringify(serviceDatas), 'utf8');

        // args[15]｜[3]分区数据
        fs.writeFile('./json/regions.json', JSON.stringify(regionDatas), 'utf8', (err) => {
            if (err) {
                console.log(err);
            }
        });
        const region_file_obj = tmp.fileSync({ postfix: '.json' });
        const region_file = region_file_obj.name;
        fs.writeFileSync(region_file, JSON.stringify(regionDatas), 'utf8');

        const jarFile = await ipcRenderer.invoke('jar-file');
        let child;

        let staffResult_file_obj;
        let staffResult_file;
        let perSchedulingResult_file_obj;
        let perSchedulingResult_file;
        let allSchedulingResult_file_obj;
        let allSchedulingResult_file;
        let prevOrderResult_file_obj;
        let prevOrderResult_file;
        let newOrderResult_file_obj;
        let newOrderResult_file;
        let newNonOrderResult_file_obj;
        let newNonOrderResult_file;

        let STIResult_file_obj;
        let STIResult_file;

        // 普通排班参数
        if (runType === 'normal') {
            // args[3]6月外勤同事進度表
            scheduledData.forEach((element) => {
                return element.blacklist = '';
            });
            fs.writeFile('./json/scheduledData.json', JSON.stringify(scheduledData), 'utf8', (err) => {
                if (err) {
                    console.log(err);
                }
            });
            const scheduled_file_obj = tmp.fileSync({ postfix: '.json' });
            const scheduled_file = scheduled_file_obj.name;
            fs.writeFileSync(scheduled_file, JSON.stringify(scheduledData), 'utf8');

            // args[4]本月每日工作单
            fs.writeFile('./json/dailyData.json', JSON.stringify(dailyData), 'utf8', (err) => {
                if (err) {
                    console.log(err);
                }
            });
            const daily_file_obj = tmp.fileSync({ postfix: '.json' });
            const daily_file = daily_file_obj.name;
            fs.writeFileSync(daily_file, JSON.stringify(dailyData), 'utf8');

            // args[5]舊單重排
            fs.writeFile('./json/prevOrderData.json', JSON.stringify(prevOrderData), 'utf8', (err) => {
                if (err) {
                    console.log(err);
                }
            });
            const prevOrder_file_obj = tmp.fileSync({ postfix: '.json' });
            const prevOrder_file = prevOrder_file_obj.name;
            fs.writeFileSync(prevOrder_file, JSON.stringify(prevOrderData), 'utf8');

            // args[6]餐飲新訂單
            fs.writeFile('./json/resOrder.json', JSON.stringify(resOrder), 'utf8', (err) => {
                if (err) {
                    console.log(err);
                }
            });
            const resOrder_file_obj = tmp.fileSync({ postfix: '.json' });
            const resOrder_file = resOrder_file_obj.name;
            fs.writeFileSync(resOrder_file, JSON.stringify(resOrder), 'utf8');

            // args[7]非餐饮新訂單
            fs.writeFile('./json/nonresOrder.json', JSON.stringify(nonresOrder), 'utf8', (err) => {
                if (err) {
                    console.log(err);
                }
            });
            const nonresOrder_file_obj = tmp.fileSync({ postfix: '.json' });
            const nonresOrder_file = nonresOrder_file_obj.name;
            fs.writeFileSync(nonresOrder_file, JSON.stringify(nonresOrder), 'utf8');

            // args[8]输出“员工数据”结果文件
            staffResult_file_obj = tmp.fileSync({ postfix: '.json' });
            staffResult_file = staffResult_file_obj.name;

            // args[9]输出“单个员工排班”结果文件
            perSchedulingResult_file_obj = tmp.fileSync({ postfix: '.json' });
            perSchedulingResult_file = perSchedulingResult_file_obj.name;

            // args[10]输出“全体员工排班”结果文件
            allSchedulingResult_file_obj = tmp.fileSync({ postfix: '.json' });
            allSchedulingResult_file = allSchedulingResult_file_obj.name;

            // args[11]输出“旧单重排”结果文件
            prevOrderResult_file_obj = tmp.fileSync({ postfix: '.json' });
            prevOrderResult_file = prevOrderResult_file_obj.name;

            // args[12]输出“新餐饮”结果文件
            newOrderResult_file_obj = tmp.fileSync({ postfix: '.json' });
            newOrderResult_file = newOrderResult_file_obj.name;

            // args[13]输出“新非餐饮”结果文件
            newNonOrderResult_file_obj = tmp.fileSync({ postfix: '.json' });
            newNonOrderResult_file = newNonOrderResult_file_obj.name;

            console.log([
                'java',
                '-jar',
                jarFile,
                skill_file,
                employee_file,
                service_file,
                scheduled_file,
                daily_file,
                prevOrder_file,
                resOrder_file,
                nonresOrder_file,
                staffResult_file,
                allSchedulingResult_file,
                perSchedulingResult_file,
                prevOrderResult_file,
                newOrderResult_file,
                newNonOrderResult_file,
                selectedDate,// args[14]排班日期
                region_file,
            ]);
            child = spawn('java', [
                '-jar',
                jarFile,
                skill_file,//args[0]技能數據
                employee_file,//args[1]員工數據
                service_file,//args[2]服務數據
                scheduled_file,//args[3]外勤同事進度表
                daily_file,//args[4]本月每日工作單
                prevOrder_file,//args[5]待排單數據範本
                resOrder_file,//args[6]	餐飲新訂單
                nonresOrder_file,//args[7]非餐饮新訂單
                staffResult_file,//args[8]“員工數據”輸出
                perSchedulingResult_file,//args[9]“單個員工排班”輸出
                allSchedulingResult_file,//args[10]“外勤同事進度表”輸出
                prevOrderResult_file,//args[11]“待排單結果”輸出
                newOrderResult_file,//args[12]“新餐飲結果”輸出
                newNonOrderResult_file,//args[13]“新非餐飲結果”輸出
                selectedDate,// args[14]排班日期
                region_file,//args[15]分區數據
            ]);
        } else {
            // args[4]全部工作单
            STIData.forEach((element) => {
                return element.blacklist = '';
            });
            fs.writeFile('./json/STIData.json', JSON.stringify(STIData), 'utf8', (err) => {
                if (err) {
                    console.log(err);
                }
            });
            const STI_file_obj = tmp.fileSync({ postfix: '.json' });
            const STI_file = STI_file_obj.name;
            fs.writeFileSync(STI_file, JSON.stringify(STIData), 'utf8');

            // args[5]STI服务
            fs.writeFile('./json/STIOrderData.json', JSON.stringify(STIOrderData), 'utf8', (err) => {
                if (err) {
                    console.log(err);
                }
            });
            const STIOrder_file_obj = tmp.fileSync({ postfix: '.json' });
            const STIOrder_file = STIOrder_file_obj.name;
            fs.writeFileSync(STIOrder_file, JSON.stringify(STIOrderData), 'utf8');

            // args[6]焗霧服務
            fs.writeFile('./json/fogOrderData.json', JSON.stringify(fogOrderData), 'utf8', (err) => {
                if (err) {
                    console.log(err);
                }
            });
            const fogOrder_file_obj = tmp.fileSync({ postfix: '.json' });
            const fogOrder_file = fogOrder_file_obj.name;
            fs.writeFileSync(fogOrder_file, JSON.stringify(fogOrderData), 'utf8');

            // args[7]输出结果文件
            STIResult_file_obj = tmp.fileSync({ postfix: '.json' });
            STIResult_file = STIResult_file_obj.name;

            console.log([
                'java',
                '-jar',
                jarFile,
                skill_file,
                employee_file,
                service_file,
                region_file,
                STI_file,
                STIOrder_file,
                fogOrder_file,
                STIResult_file,
                selectedDate,
            ]);
            child = spawn('java', [
                '-jar',
                jarFile,
                skill_file,//args[0]技能數據
                employee_file,//args[1]員工數據
                service_file,//args[2]服務數據
                region_file,//args[3]分區數據
                STI_file,//args[4]STI全部工单
                STIOrder_file,//args[5]T701
                fogOrder_file,//args[6]T702
                STIResult_file,//args[7]输出结果
                selectedDate,// args[8]排班日期
            ]);
        }

        console.log(selectedDate)

        setProgressMsg('運行中...');

        child.stdout.on('data', (data) => {
            const str = data.toString();
            console.log(str);

            if (str.includes('Started program')) {
                setPercent(10);
            }

            if (str.includes('skillmapService')) {
                setPercent(32);
            }

            if (str.includes('Start outputing json')) {
                setPercent(64);
            }
        });

        child.stderr.on('data', (data) => {
            console.log(data.toString());
        });

        child.on('exit', (code) => {
            console.log(code);

            let message;
            switch (code) {
                case 0:
                    message = '運行成功！在左側“結果”部分可以查看和保存排程結果';
                    break;
                case 1:
                    message = '運行失敗：算法運行失敗';
                    break;
                case 2:
                    message = '運行失敗：技能數據讀取失敗';
                    break;
                case 3:
                    message = '運行失敗：員工數據讀取失敗';
                    break;
                case 4:
                    message = '運行失敗：服務數據讀取失敗';
                    break;
                case 5:
                    message = '運行失敗：已排班數據讀取失敗';
                    break;
                case 6:
                    message = '運行失敗：每日工作單數據讀取失敗';
                    break;
                case 7:
                    message = '運行失敗：舊單重排數據讀取失敗';
                    break;
                case 8:
                    message = '運行失敗：新餐飲訂單數據讀取失敗';
                    break;
                case 9:
                    message = '運行失敗：新非餐飲訂單數據讀取失敗';
                    break;
                case 10:
                    message = '運行失敗：分區數據讀取失敗';
                    break;
                case 3221225477:
                    message = '運行失敗：算法運行失敗';
                    break;
                default:
                    message = '';
            }

            setProgressMsg(message);

            if (code !== 0) return;

            if (runType === 'normal') {
                /* Save history: operations schedule result */
                fs.readFile(staffResult_file, 'utf8', (err, data) => {
                    if (err) {
                        staffResult_file_obj.removeCallback();
                        throw err;
                    }
                    console.log('staffResult_file start reading')
                    console.log(JSON.parse(data))
                    const results = JSON.parse(data).map((uuid) => {
                        const staff = employeeDatas.find((employee) => employee.ID === uuid.ID);
                        const staffInit = Object.assign(staff, uuid);
                        staffInit.can_receive_order = staffInit.can_receive_order.toString();
                        return staffInit;
                    });
                    setStaffResult(results);
                    fs.writeFile('./json/staffResults.json', JSON.stringify(results, null, 4), 'utf8', (err) => {
                        if (err) {
                            console.log(err);
                        }
                    });
                    staffResult_file_obj.removeCallback();
                    console.log('staffResult_file end reading')
                });

                // 單個員工
                fs.readFile(perSchedulingResult_file, 'utf8', (err, data) => {
                    if (err) {
                        perSchedulingResult_file_obj.removeCallback();
                        throw err;
                    }
                    console.log('perSchedulingResult_file start reading')
                    console.log(JSON.parse(data))
                    const perResults = JSON.parse(data).map((per) => {
                        per.data_list.forEach((list, index) => {
                            list.key = index;
                            return list;
                        });
                        return per;
                    });
                    setPerStaffScheduledResult(perResults);
                    fs.writeFile('./json/perResults.json', JSON.stringify(perResults, null, 4), 'utf8', (err) => {
                        if (err) {
                            console.log(err);
                        }
                    });
                    perSchedulingResult_file_obj.removeCallback();
                    console.log('perSchedulingResult_file end reading')
                });

                // 全體員工
                fs.readFile(allSchedulingResult_file, 'utf8', (err, data) => {
                    if (err) {
                        allSchedulingResult_file_obj.removeCallback();
                        throw err;
                    }
                    console.log('allSchedulingResult_file start reading')
                    console.log(JSON.parse(data))
                    const allResults = JSON.parse(data).map((all, index) => {
                        const init = { ...scheduledData.find((sche) => sche.order_ID === all.order_ID) };
                        const all_init = Object.assign(init, all);
                        return all_init;
                    });
                    setAllStaffScheduledResult(allResults);
                    fs.writeFile('./json/allSchedulingResults.json', JSON.stringify(allResults, null, 4), 'utf8', (err) => {
                        if (err) {
                            console.log(err);
                        }
                    });
                    allSchedulingResult_file_obj.removeCallback();
                    console.log('allSchedulingResult_file end reading')
                });

                // 舊單重排
                fs.readFile(prevOrderResult_file, 'utf8', (err, data) => {
                    if (err) {
                        prevOrderResult_file_obj.removeCallback();
                        throw err;
                    }
                    console.log('prevOrderResult_file start reading')
                    const prevResults = JSON.parse(data).map((prev, index) => {
                        const prevInit = prevOrderData.find((order) => order.order_ID === prev.order_ID);
                        const prev_init = Object.assign(prevInit, prev);
                        return prev_init;
                    });
                    setPrevOrderResult(prevResults);
                    fs.writeFile('./json/prevOrderResults.json', JSON.stringify(prevResults, null, 4), 'utf8', (err) => {
                        if (err) {
                            console.log(err);
                        }
                    });
                    prevOrderResult_file_obj.removeCallback();
                    console.log('prevOrderResult_file end reading')
                });

                // 新餐飲
                fs.readFile(newOrderResult_file, 'utf8', (err, data) => {
                    if (err) {
                        newOrderResult_file_obj.removeCallback();
                        throw err;
                    }
                    console.log('newOrderResult_file start reading')
                    const newResults = JSON.parse(data).map((res, index) => {
                        const newInit = resOrder.find((order) => order.order_ID === res.order_ID);
                        const new_init = Object.assign(newInit, res);
                        return new_init;
                    });
                    setNewOrderResult(newResults);
                    fs.writeFile('./json/newOrderResults.json', JSON.stringify(newResults, null, 4), 'utf8', (err) => {
                        if (err) {
                            console.log(err);
                        }
                    });
                    newOrderResult_file_obj.removeCallback();
                    console.log('newOrderResult_file end reading')
                });

                // 新非餐飲
                fs.readFile(newNonOrderResult_file, 'utf8', (err, data) => {
                    if (err) {
                        newNonOrderResult_file_obj.removeCallback();
                        throw err;
                    }
                    console.log('newNonOrderResult_file start reading')
                    const nonResults = JSON.parse(data).map((tmp, index) => {
                        const otherInit = nonresOrder.find((other) => (other.order_ID === tmp.order_ID));
                        const other_init = Object.assign(otherInit, tmp);
                        return other_init;
                    });
                    setOtherOrderResult(nonResults);
                    fs.writeFile('./json/nonOrderResults.json', JSON.stringify(nonResults, null, 4), 'utf8', (err) => {
                        if (err) {
                            console.log(err);
                        }
                    });
                    newNonOrderResult_file_obj.removeCallback();
                    console.log('newNonOrderResult_file end reading')
                });
            } else {
                // STI排班结果返回
                console.log("STI done!")
            }

            setStatus(true);
            setLoading(false);
            setPercent(100);
        });

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