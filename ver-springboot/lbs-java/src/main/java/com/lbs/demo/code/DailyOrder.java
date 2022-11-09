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

public class DailyOrder {
    String type;// 服務種類
    String date;// 日期
    String customer_ID;// 客戶編號
    String profit;// 現價/單

    public static List<DailyOrder> readJsonFile(String jsonFname)
            throws JsonIOException, JsonSyntaxException, FileNotFoundException, IOException {
        Gson gson = new GsonBuilder().setDateFormat("yyyy-MM-dd HH:mm:ss").create();
        Type listType = new TypeToken<List<DailyOrder>>() {
        }.getType();
        List<DailyOrder> dailyList = gson.fromJson(new InputStreamReader(new FileInputStream(jsonFname), "UTF8"),
                listType);
        return dailyList;
    }

    public static List<DailyOrder> readJson(Object jsonStr)
            throws JsonIOException, JsonSyntaxException {
        Gson gson = new GsonBuilder().setDateFormat("yyyy-MM-dd HH:mm:ss").create();
        Type listType = new TypeToken<List<DailyOrder>>() {
        }.getType();
        List<DailyOrder> dailyList = gson.fromJson(new Gson().toJson(jsonStr), listType);
        return dailyList;
    }
}
