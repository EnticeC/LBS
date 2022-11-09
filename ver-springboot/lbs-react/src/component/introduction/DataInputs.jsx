import React from 'react';
import { Divider, Typography } from 'antd';

const { Title, Paragraph, Text } = Typography;

export default () => (
    <div className="page">
        <Typography>
            <Title level={2}>數據與輸入</Title>

            <Title level={4}>系統支持以下四類基本數據：</Title>

            <Divider orientation="left" orientationMargin="0"><Text strong>員工數據</Text></Divider>
            <Paragraph>
                <ul>
                    <li>員工數據應包含員工編號、員工名稱、技能組合、所屬群組、僱傭類別、工作時間類別、工作能力、可接受單量、實際服務時間、薪水結算體系、不願服務的區、今日是否放假。</li>
                    <li>運行排班會結合員工技能、可接受單量、不願服務的區以及今日是否放假等信息統籌安排。</li>
                    <li>系統支持手動上傳員工數據（<Text strong>僅支持xlsx格式的文件，</Text>具體格式可參考模板文檔）。</li>
                </ul>
            </Paragraph>

            <Divider orientation="left" orientationMargin="0"><Text strong>技能數據</Text></Divider>
            <Paragraph>
                <ul>
                    <li>技能數據應包含技能編號、技能名稱。</li>
                    <li>技能數據支持批量上傳及手動新增條目。</li>
                </ul>
            </Paragraph>

            <Divider orientation="left" orientationMargin="0"><Text strong>服務數據</Text></Divider>
            <Paragraph>
                <ul>
                    <li>服務數據應包含服務編號、服務內容、服務種類、所屬公司、所屬大類、所需技能組合、所需員工數目、所需基礎服務時間（單位：分鐘）、所需設備種類、所需物資種類、與哪種服務有“衝突”、是否STI、是否需要車輛資源、可否24/7及備註信息。</li>
                    <li>系統支持手動上傳服務數據（<Text strong>僅支持xlsx格式的文件，</Text>具體格式可參考模板文檔）。</li>
                </ul>
            </Paragraph>


            <Divider orientation="left" orientationMargin="0"><Text strong>分區數據</Text></Divider>
            <Paragraph>
                <ul>
                    <li>分區數據應包含分區編號、地區、CS、地址、餐飲組SALES。</li>
                    <li>分區數據支持批量上傳及手動新增條目。</li>
                </ul>
            </Paragraph>
        </Typography>
    </div>
);
