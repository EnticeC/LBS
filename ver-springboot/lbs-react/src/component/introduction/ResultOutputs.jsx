import React from 'react';
import { Divider, Typography } from 'antd';

const { Title, Paragraph, Text } = Typography;

export default () => (
    <div className="page">
        <Typography>
            <Title level={2}>結果與輸出</Title>
            <Paragraph>
                點擊左側“結果——排班方案”可展示排班結果。結果支持多維度查看。<br />
                <Divider orientation="left" orientationMargin="0"><Text strong>員工角度</Text></Divider>
                <Text>表格當前所有員工的基本信息，支持搜索篩選，找到對應員工可在“操作”列選擇查看其對應的排班信息。下方的詳情表會根據選擇的員工展示對應的排班結果。</Text>

                <Divider orientation="left" orientationMargin="0"><Text strong>訂單角度</Text>（支持四類結果查看）</Divider>
                <Text>
                    1、全體員工排班結果<br />
                    2、舊單重排結果<br />
                    3、新餐飲訂單排班結果<br />
                    4、新非餐飲訂單排班結果<br />
                </Text>
            </Paragraph>
        </Typography>
    </div>
);
