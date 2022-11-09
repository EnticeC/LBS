import React, { useMemo, useState } from 'react';
import usePersistedState from './utils/usePersistedState';
import { FaAngleDoubleRight, FaCube, FaInfoCircle, FaTable } from 'react-icons/fa';
import './css/colors.css';
import './css/global.css';
import Login from './component/app/Login';
import SideNav from './component/app/SideNav';
import Content from './component/app/Content';
import Configuration from './component/introduction/Configuration';
import DataInputs from './component/introduction/DataInputs';
import OperationFlow from './component/introduction/OperationFlow';
import ResultOutputs from './component/introduction/ResultOutputs';
import EmployeeData from './component/data/EmployeeData';
import SkillData from './component/data/SkillData';
import RegionData from './component/data/RegionData';
import ServiceCategoryData from './component/data/ServiceCategoryData';
import RunSchedule from './component/operation/RunSchedule';
import STISchedule from './component/operation/STI/STISchedule';
import ScheduleResult from './component/result/ScheduleResult';

const GlobalContext = React.createContext(undefined);

export default function App() {
  // userinfo
  const [loggedin, setLoggedin] = useState(false);
  const [username, setUsername] = usePersistedState('username', '');
  const [userGrade, setUserGrade] = useState(0);

  // Default Path
  const [path, setPath] = useState('/data/employees');
  // Side nav Icon
  const infoIcon = useMemo(() => <FaInfoCircle />, []);
  const dataIcon = useMemo(() => <FaTable />, []);
  const operationIcon = useMemo(() => <FaAngleDoubleRight />, []);
  const resultIcon = useMemo(() => <FaCube />, []);
  // Side nav
  const navMenuItems = useMemo(
    () => [
      {
        icon: infoIcon,
        title: '說明',
        items: [
          {
            path: '/info/configuration',
            title: '配置要求',
            key: 0,
          },
          {
            path: '/info/inputs',
            title: '數據與輸入',
          },
          {
            path: '/info/operationflow',
            title: '操作流程',
          },
          {
            path: '/info/outputs',
            title: '結果與輸出',
          },
        ],
      },
      {
        icon: dataIcon,
        title: '數據',
        isOpen: true,
        items: [
          {
            path: '/data/employees',
            title: '員工數據',
          },
          {
            path: '/data/skills',
            title: '技能數據',
          },
          {
            path: '/data/serviceCategories',
            title: '服務數據',
          },
          {
            path: '/data/regions',
            title: '分區數據',
          },
        ]
      },
      {
        icon: operationIcon,
        title: '操作',
        isOpen: true,
        items: [
          {
            path: '/operation/runschedule',
            title: '員工排班',
          },
          // {
          //   path: '/operation/stischedule',
          //   title: 'STI排班',
          // },
        ],
      },
      {
        icon: resultIcon,
        title: '結果',
        items: [
          {
            path: '/result/scheduleresult',
            title: '排班方案',
          },
        ],
      },
    ],
    [username]
  );
  // Pages
  const pages = useMemo(() => {
    const p = [
      {
        path: '/info/configuration',
        component: () => <Configuration />,
      },
      {
        path: '/info/inputs',
        component: () => <DataInputs />,
      },
      {
        path: '/info/operationflow',
        component: () => <OperationFlow />,
      },
      {
        path: '/info/outputs',
        component: () => <ResultOutputs />,
      },
      {
        path: '/data/employees',
        component: () => <EmployeeData />,
      },
      {
        path: '/data/skills',
        component: () => <SkillData />,
      },
      {
        path: '/data/serviceCategories',
        component: () => <ServiceCategoryData />,
      },
      {
        path: '/data/regions',
        component: () => <RegionData />,
      },
      {
        path: '/operation/runschedule',
        component: () => <RunSchedule />,
      },
      {
        path: '/operation/stischedule',
        component: () => <STISchedule />,
      },
      {
        path: '/result/scheduleresult',
        component: () => <ScheduleResult />,
      },
    ];
    return p;
  }, [username]);

  // 员工数据
  const [employeeDatas, setEmployeeDatas] = usePersistedState('employee', []);
  // 技能数据
  const [skillDatas, setSkillDatas] = usePersistedState('skill', []);
  // 分區数据
  const [regionDatas, setRegionDatas] = usePersistedState('region', []);
  // 服务数据
  const [serviceDatas, setServiceDatas] = usePersistedState('service', []);
  // 已排班数据
  const [scheduledData, setScheduledData] = usePersistedState('scheduled', []);
  // 本月每日工作单
  const [dailyData, setDailyData] = usePersistedState('daily', []);
  // 旧单重排
  const [prevOrderData, setPrevOrderData] = usePersistedState('prevOrder', []);
  // 新订单
  const [newOrderData, setNewOrderData] = usePersistedState('newOrder', []);
  // 员工信息
  const [staffDataSource, setStaffDataSource] = usePersistedState('staff', []);
  // STI全部工单
  const [STIData, setSTIData] = usePersistedState('sti', []);
  // T701_STI
  const [STIOrderData, setSTIOrderData] = usePersistedState('stiOrder', []);
  // T702_焗霧
  const [fogOrderData, setFogOrderData] = usePersistedState('fogOrder', []);

  // 排班类型
  const [runType, setRunType] = useState('normal');

  // result data
  const [staffResult, setStaffResult] = useState([]);
  const [perStaffScheduledResult, setPerStaffScheduledResult] = useState([]);
  const [allStaffScheduledResult, setAllStaffScheduledResult] = useState([]);
  const [prevOrderResult, setPrevOrderResult] = useState([]);
  const [newOrderResult, setNewOrderResult] = useState([]);
  const [otherOrderResult, setOtherOrderResult] = useState([]);

  return (
    <GlobalContext.Provider
      value={{
        path,
        setPath,
        username,
        userGrade,
        setUsername,
        setUserGrade,
        employeeDatas,
        setEmployeeDatas,
        skillDatas,
        setSkillDatas,
        regionDatas,
        setRegionDatas,
        serviceDatas,
        setServiceDatas,
        scheduledData,
        setScheduledData,
        dailyData,
        setDailyData,
        prevOrderData,
        setPrevOrderData,
        newOrderData,
        setNewOrderData,
        staffDataSource,
        setStaffDataSource,
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
        STIData,
        setSTIData,
        STIOrderData,
        setSTIOrderData,
        fogOrderData,
        setFogOrderData,
        runType,
        setRunType,
      }}
    >
      <div
        className="app"
        style={{ height: '100%', width: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
      >
        {/* <TitleBar /> */}
        {!loggedin ?
          (<Login setLoggedin={setLoggedin} />) :
          (
            <div
              className="main"
              style={{
                height: 'calc(100% - 30px)',
                display: 'flex',
              }}
            >
              <SideNav menuItems={navMenuItems} path={path} setPath={setPath} />
              <Content pages={pages} path={path} />
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  padding: 5,
                }}
              >
                工號: {username}&nbsp;&nbsp;&nbsp;權限級別: {userGrade}
              </div>
            </div>
          )}
      </div>
    </GlobalContext.Provider>
  );
}

export function useGlobalContext() {
  const context = React.useContext(GlobalContext);
  if (context === undefined) throw new Error('useGlobalContext must be used within a GlobalContext.Provider');
  return context;
}
