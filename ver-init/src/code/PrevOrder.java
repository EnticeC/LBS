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

public class PrevOrder { //舊單重排
    String company;// 公司
    String type;// 服務
    String order_ID;// 工作單編號
    String customer_ID;// 客戶編號
    String name;//客戶名稱
    String staff;// 服務人員

    public static List<PrevOrder> readJsonFile(String jsonFname)
            throws JsonIOException, JsonSyntaxException, FileNotFoundException, IOException {
        Gson gson = new GsonBuilder().setDateFormat("yyyy-MM-dd HH:mm:ss").create();
        Type listType = new TypeToken<List<PrevOrder>>() {
        }.getType();
        List<PrevOrder> dailyList = gson.fromJson(new InputStreamReader(new FileInputStream(jsonFname), "UTF8"),
                listType);
        return dailyList;
    }
}
