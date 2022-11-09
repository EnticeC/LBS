package code;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;
import java.lang.reflect.Type;
import java.util.LinkedHashMap;
import java.util.Map;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonIOException;
import com.google.gson.JsonSyntaxException;
import com.google.gson.reflect.TypeToken;

public class Service {
	String customer_ID;
	String region;
	String type;
	String skills;
	String blacklist = "";
	String name;
	int people = 0;
	String range;
	double profit = 0;
	ArrayList<Staff> original_staffs = new ArrayList<Staff>();
	ArrayList<Staff> staffs = new ArrayList<Staff>();
	//ArrayList<Staff> igregion_staffs = new ArrayList<Staff>();
	Map<String,Staff> igregion_staffs = new LinkedHashMap<String,Staff>();
	ArrayList<Staff> unplanned_staffs = new ArrayList<Staff>();
	String order_ID;
	boolean needScheduling = true;
	String staff_string;
	int order_type; //訂單類型


	public static List<Service> readJsonFile(String jsonFname)
			throws JsonIOException, JsonSyntaxException, FileNotFoundException, IOException {
		Gson gson = new GsonBuilder().setDateFormat("yyyy-MM-dd HH:mm:ss").create();
		Type listType = new TypeToken<List<Service>>() {
		}.getType();
		List<Service> services = gson.fromJson(new InputStreamReader(new FileInputStream(jsonFname), "UTF8"), listType);
		return services;
	}

	public void print() {
		System.out.print(customer_ID + "," + type + "," + skills + "," + people + "," + profit + "\t");
		for (Staff staff : staffs) {
			System.out.print(staff.ID + ",");
		}
	}

	public void println() {
		System.out.print(customer_ID + "," + type + "," + skills + "," + people + "," + profit + "\t" + "Original:");

		for (Staff staff : original_staffs) {
			System.out.print(staff.ID + ",");
		}
		System.out.print("\t");
		for (Staff staff : staffs) {
			System.out.print(staff.ID + ",");
		}
		System.out.println();
	}

	@Override
	public String toString() {
		String str = type + "," + skills + "," + people + "," + profit;
		for (Staff staff : staffs) {
			str += staff.ID + ",";
		}
		return str;
	}

	public boolean needToDo() {
		return (people != staffs.size() && needScheduling);
	}

	public boolean needToDoIgnoreCapacity() {
		return (people != staffs.size() + unplanned_staffs.size() && needScheduling);
	}
}
