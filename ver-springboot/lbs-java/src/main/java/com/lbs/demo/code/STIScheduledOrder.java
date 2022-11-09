package com.lbs.demo.code;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStreamReader;
import java.lang.reflect.Type;
import java.util.List;
import java.util.Date;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonIOException;
import com.google.gson.JsonSyntaxException;
import com.google.gson.reflect.TypeToken;

public class STIScheduledOrder extends STIOrder { //已排訂單數據
    

    String order_No;//工作單編號   
    //String type;// 服務種類
    String date;// 日期
    //String service_time;// 服务時間
    //String customer_ID;// 客戶編唬
    String customerName;// 客戶名稱
    //String staff;// 技術員
    String customer_Rating;// 客戶等級
    String payment;// 付款方式
    String profit;// 現價/單   
    String sign;// 簽署要求
    String notAble;// 做不到
    String unsigned;// 未簽署
    String complete;// 完成
    String incomplete;// 未完成
    String reason;// 未完成原因
    String invoice_No;// 服務發票編號
    String invoice_Date;// 服務發票日期
    String status;// 狀態
    String deleteReason;// 刪除原因
    String cancelledBy;// 取消人員
	String cancelledDate;// 取消日期
    String paymentTerms;// 付款條款

    Date service_dateTodate;

    STIScheduledOrder() {}
    STIScheduledOrder(STIOrder order) {
        super(order);
    }

    public static List<STIScheduledOrder> readJsonFile(String jsonFname)
            throws JsonIOException, JsonSyntaxException, FileNotFoundException, IOException {
        Gson gson = new GsonBuilder().setDateFormat("yyyy-MM-dd HH:mm:ss").create();
        Type listType = new TypeToken<List<STIScheduledOrder>>() {
        }.getType();
        List<STIScheduledOrder> scheduledList = gson
                .fromJson(new InputStreamReader(new FileInputStream(jsonFname), "UTF8"), listType);
        return scheduledList;
    }

}
