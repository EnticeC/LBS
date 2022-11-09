package com.lbs.demo.code;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStreamReader;
import java.lang.reflect.Type;
import java.util.List;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonIOException;
import com.google.gson.JsonSyntaxException;
import com.google.gson.reflect.TypeToken;

public class STINewOrder extends STIOrder{ //已排訂單數據
    // String service_date;//工作單編號   
    // String service_time;// 服务時間
    // String customer_ID;// 客戶編唬
    // String name;// 客戶名稱
    // String company_ID;// 客戶名稱
    // String address;// 技術員
    // String type;// 客戶等級
    // String staff;// 付款方式

    STINewOrder() {}
    STINewOrder(STIOrder order) {
        super(order);
        //TODO Auto-generated constructor stub
    }


    String overtime;// 現價/單   
    String money_type;// 簽署要求
    String money_percent;// 做不到
    String period;// 未簽署
    String weekday;// 完成
    String blacklist;// 未完成
    String important;// 未完成原因
    String holiday;// 服務發票編號
    String order_ID;// 服務發票日期
    String confirmed;// 狀態
    String remark;// 刪除原因

    String staff_id = ""; //服務人員名稱
    String staff_name = "";//服務人員編號


    public static List<STINewOrder> readJsonFile(String jsonFname)
            throws JsonIOException, JsonSyntaxException, FileNotFoundException, IOException {
        Gson gson = new GsonBuilder().setDateFormat("yyyy-MM-dd HH:mm:ss").create();
        Type listType = new TypeToken<List<STINewOrder>>() {
        }.getType();
        List<STINewOrder> newList = gson.fromJson(new InputStreamReader(new FileInputStream(jsonFname), "UTF8"),
                listType);
        return newList;
    }
}

