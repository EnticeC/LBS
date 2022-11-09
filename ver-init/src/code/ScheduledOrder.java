package code;

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

public class ScheduledOrder { //已排訂單數據
    String service_date;// 服务日期
    String service_time;// 服务時間
    String customer_ID;// 客戶編唬
    String name;// 客戶名稱
    String company_ID;// 集團公司編號
    String address;// 地址
    String type;// 服務種類
    String overtime_remark;// 加班備註
    String staff;// 技術員
    String overtime;// 「加班」資料
    String money_type;// 「佣金種類」資料
    String money_percent;// 「佣金%」資料
    String period;// 「服務週期」資料
    String weekday;// 「平日」資料
    String blacklist;// 黑名單工作人員
    String important;// 重要事項(變更提示)
    String holiday;// 於假期不用工作
    String order_ID;// 工作單編號
    String confirmed;// 已確認
    String remark;// 備註
	int order_type; //訂單類型

    public static List<ScheduledOrder> readJsonFile(String jsonFname)
            throws JsonIOException, JsonSyntaxException, FileNotFoundException, IOException {
        Gson gson = new GsonBuilder().setDateFormat("yyyy-MM-dd HH:mm:ss").create();
        Type listType = new TypeToken<List<ScheduledOrder>>() {
        }.getType();
        List<ScheduledOrder> scheduledList = gson
                .fromJson(new InputStreamReader(new FileInputStream(jsonFname), "UTF8"), listType);
        return scheduledList;
    }
}
