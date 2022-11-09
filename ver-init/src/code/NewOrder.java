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

public class NewOrder {
    String receive_date;// 實際接收日期
    String effective_date;// 生效日期
    String customer_ID;// 客戶編號
    String name;// 客戶名稱
    String type;// 服務種類
    String order_ID; //訂單編號

    public static List<NewOrder> readJsonFile(String jsonFname)
            throws JsonIOException, JsonSyntaxException, FileNotFoundException, IOException {
        Gson gson = new GsonBuilder().setDateFormat("yyyy-MM-dd HH:mm:ss").create();
        Type listType = new TypeToken<List<NewOrder>>() {
        }.getType();
        List<NewOrder> newList = gson.fromJson(new InputStreamReader(new FileInputStream(jsonFname), "UTF8"),
                listType);
        return newList;
    }
}
