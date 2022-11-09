package code;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.lang.reflect.Type;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonIOException;
import com.google.gson.JsonSyntaxException;
import com.google.gson.reflect.TypeToken;

public class Staff implements Comparable<Staff> {
	String ID = ""; //員工編號
	String skills = ""; //技能
	String group = ""; //群組
	ArrayList<Service> service_list = new ArrayList<Service>();
	double total_profit = 0;
	int capacity = 0; //可接受單量
	double min_profit = 4000;
	String region = ""; //地區
	int total_order = 0;
	ArrayList<Service> unplanned_service_list = new ArrayList<Service>();
	String name; //名稱
	
	String isTunMenOffice = "N";

	ArrayList<STIService> service_sti_list = new ArrayList<STIService>();
	ArrayList<STIService> unplanned_service_sti_list = new ArrayList<STIService>();

	public static ArrayList<Staff> readJsonFile(String jsonFname)
			throws JsonIOException, JsonSyntaxException, FileNotFoundException, IOException {
		Gson gson = new GsonBuilder().setDateFormat("yyyy-MM-dd HH:mm:ss").create();
		Type listType = new TypeToken<ArrayList<Staff>>() {
		}.getType();
		ArrayList<Staff> inputs = gson.fromJson(new InputStreamReader(new FileInputStream(jsonFname), "UTF8"),
				listType);
		return inputs;
	}

	public void addProfit(double profit, int people) {
		total_profit += profit / people;
	}

	public void print(boolean... bool) {
		boolean new_line = bool.length > 0 ? bool[0] : false;
		System.out.print(ID + "\t" + group + "\t" + capacity + "\t" + region + "\t");
		for (Service service : service_list) {
			System.out.print(service.customer_ID + "," + service.type + "\t");
		}
		System.out.print(Math.round(total_profit * 100) / 100.0 + "\t" + (total_profit >= min_profit));
		if (new_line)
			System.out.println();
	}

	public void println() {
		print(true);
	}

	public void printUnplanned() {
		for (Service service : unplanned_service_list) {
			System.out.print(service.customer_ID + "\t");
		}
	}

	@Override
	public int compareTo(Staff o) {
		return ID.compareTo(o.ID);
	}
}
