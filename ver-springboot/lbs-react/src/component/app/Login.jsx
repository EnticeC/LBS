import React from 'react';
import { useGlobalContext } from '../../App';
import loginbg from '../../assets/login-bg.jpg';
import '../../css/login.css';
import { parseDate } from '../../utils/datetime';
import FlexButton from '../common/FlexButton';
import FlexInput from '../common/FlexInput';
import FlexLabel from '../common/FlexLabel';
import FormGroup from '../common/FormGroup';

export default ({ setLoggedin }) => {
    const { username, setUsername, setUserGrade } = useGlobalContext();
    const unRef = React.useRef(null);
    const pwRef = React.useRef(null);
    const btnRef = React.useRef(null);
    const [msg, setMsg] = React.useState('');

    React.useEffect(() => {
        if (unRef.current) {
            unRef.current.focus();
            unRef.current.select();
        }
    }, []);

    const onKeyUp = React.useCallback((e) => {
        // Number 13 is the "Enter" key on the keyboard
        if (e.keyCode === 13) {
            // Cancel the default action, if needed
            e.preventDefault();
            if (btnRef.current) btnRef.current.click();
        }
    }, []);

    return (
        <div
            className="page"
            style={{ backgroundImage: `url(${loginbg})`, backgroundRepeat: 'no-repeat', backgroundSize: '100% 100%' }}
        >
            <div className="login-container">
                <div>
                    <FormGroup>
                        <FlexLabel text="工號" width={70} style={{color:'white'}} />
                        <FlexInput inputType="text" defaultValue={username} ref={unRef} onKeyUp={onKeyUp} />
                    </FormGroup>
                    <FormGroup>
                        <FlexLabel text="密碼" width={70} style={{color:'white'}}/>
                        <FlexInput inputType="password" ref={pwRef} onKeyUp={onKeyUp} />
                    </FormGroup>
                </div>
                <div>
                    {msg.length > 0 && <p style={{ color: 'red', marginBottom: 5 }}>{msg}</p>}
                    <FormGroup>
                        <FlexButton
                            text="確定"
                            width={100}
                            ref={btnRef}
                            onClick={async () => {
                                if (unRef.current && pwRef.current) {
                                    if (unRef.current.value.trim().length === 0) {
                                        setMsg('請輸入工號');
                                        return;
                                    }
                                    if (new Date() > parseDate('2022-12-01 00:00:00')) {
                                        setMsg('試用期限結束，請聯繫管理員');
                                        return;
                                    }

                                    // NM admin test
                                    if (unRef.current.value === 'NM') {
                                        if (pwRef.current.value !== '111') {
                                            setMsg('密碼錯誤');
                                            return;
                                        } else {
                                            setUserGrade(3);
                                            setUsername('NM');
                                            setLoggedin(true);
                                            return;
                                        }
                                    }

                                    const res = await (
                                        await fetch(
                                            `http://172.18.248.225:8080/TgmesAppdi/service/tgmesJzNmService/gradeQuery`,
                                            {
                                                method: 'POST',
                                                headers: {
                                                    'Content-Type': 'application/x-www-form-urlencoded',
                                                    Accept: 'application/json',
                                                },
                                                body: new URLSearchParams({
                                                    useid: unRef.current.value,
                                                    password: pwRef.current.value,
                                                }),
                                            }
                                        )
                                    ).json();
                                    if (res.message === '未找到数据') {
                                        setMsg('工號不存在');
                                        return;
                                    }
                                    console.log(res.response[0]);
                                    if (res.response[0].status === 'N' || !res.response[0].status) {
                                        setMsg('密碼錯誤');
                                        return;
                                    }
                                    setUsername(unRef.current.value);
                                    setUserGrade(parseInt(res.response[0].grade));
                                    setLoggedin(true);
                                }
                            }}
                        />
                    </FormGroup>
                </div>
            </div>
        </div>
    );
};
