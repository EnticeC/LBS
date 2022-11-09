import React from 'react';
import { Divider, Typography } from 'antd';

const { Title, Paragraph, Text } = Typography;

export default () => (
    <div className="page">
        <Typography>
            <Title level={2}>操作流程</Title>

            <Divider orientation="left" orientationMargin="0">一、輸入基礎數據</Divider>
            <Paragraph>
                點擊左側”數據“進入輸入基礎數據的頁面。
                基礎數據分為“員工數據”、“技能數據”、“服務數據”、“分區數據”四類。
                如果是第一次運行本程序，需要根據xlsx模板文件手動上傳各類基礎數據文件來輸入數據，之後再運行，系統會默認展示上一次的輸入結果，無需再上傳，若需要更改則重新選擇數據文件或單獨修改對應數據行即可。
            </Paragraph>

            <Divider orientation="left" orientationMargin="0">二、排班操作流程</Divider>
            <Paragraph>
                以正常排班為例，大致操作流程如下：<br />
                1、點擊左側“操作——員工排班”後進入正常排班操作頁面；<br />
                2、首先需要輸入訂單數據，訂單數據分為以下幾類：“已排班數據”、“本月每日工作單”、“舊單重排”、“新訂單”、“員工信息”<br />
                <ul>
                    <li><Text strong>已排班數據：</Text>當前已手工排班的訂單數據。影響當前員工已接受單量及工作地點區域。可部分數據支持手動選擇文件上傳。</li>
                    <li><Text strong>本月每日工作單：</Text>主要用於收集客戶信息及客價單。</li>
                    <li><Text strong>舊單重排：</Text>當前還未安排員工的歷史訂單數據。</li>
                    <li><Text strong>新訂單：</Text>當前還未安排員工的訂單數據。</li>
                    <li><Text strong>員工信息：</Text>與基礎數據部分的員工數據保持一致，用於確認員工的剩餘工作量等信息。</li>
                </ul>
                3、相應數據輸入完畢後，點擊”下一步“，進入”運行排班“頁面，選擇要運行排班的日期，點擊”運行“。<br />
                4、程序執行完成即可在左側“結果——排班方案”中看到排班結果信息。
            </Paragraph>
        </Typography>
    </div>
);
