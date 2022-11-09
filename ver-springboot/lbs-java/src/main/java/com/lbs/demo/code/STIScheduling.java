package com.lbs.demo.code;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.reflect.TypeToken;

import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.Writer;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.HashSet;
import java.util.Set;
import java.io.OutputStreamWriter;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;


public class STIScheduling extends Scheduling{
	
	//static String[] arguments;
	//static LocalDate today; //排班的天


	static Map<String,Order> STIScheduledOrder_Map = new HashMap<String,Order>();
	static ArrayList<Order> STIScheduledOrder_list = new ArrayList<Order>();
	static ArrayList<Order> STINewOrder_list = new ArrayList<Order>();
	static Map<String, Customer> STIservicemapCustomer = new LinkedHashMap<String, Customer>(); //service with corresponding customer info
	static Map<String, STIScheduledOrder> STIservicemapSTIScheduledOrder = new LinkedHashMap<String, STIScheduledOrder>(); //service with corresponding customer info
	

	static String noSameRegionHeading = "无同區可服務人員，找到非同區可服務人員:"+System.lineSeparator();

	//do a service
	public static void doService(Staff staff, STIService service) {
		staff.capacity--;
		staff.service_sti_list.add(service);
		staff.region = service.region;
		service.staffs.add(staff);
		staff.addProfit(service.profit, service.people);
	}

	//do a service ignoring capacity
	public static void doServiceIgnoreCapacity(Staff staff, STIService service) {
		staff.unplanned_service_sti_list.add(service);
		staff.region = service.region;
		service.unplanned_staffs.add(staff);
	}

	// create staff data json (非排班數據)
	public JsonArray createStaffJson() {
		List<StaffData> data_list = new ArrayList<StaffData>();
		try {
			for (Staff staff : staff_list) {
				StaffData data = new StaffData();
				data.ID = staff.ID;
				data.profit = (int) (staff.total_profit * 100) / 100.0;
				if (staff.ID.substring(0, 2).equals("T0") || staff.ID.substring(0, 2).equals("T1")) {
					data.reach_profit = String.valueOf(staff.total_profit >= staff.min_profit);
				} else {
					data.reach_profit = "N/A";
				}
				data.can_receive_order = staff.capacity >0;
				data.region= (staff.region.equals(""))? "N/A": staff.region;
				data.total_order = staff.service_sti_list.size();
				data_list.add(data);
			}
			
			//write json file
			Gson gson = new Gson();
			JsonElement element = gson.toJsonTree(data_list, new TypeToken<List<StaffData>>() {
			}.getType());
			JsonArray jsonArray = element.getAsJsonArray();

			return jsonArray;
			// Writer writer = new OutputStreamWriter(new FileOutputStream("arguments[8]"),"UTF-8");
			// writer.write(jsonArray.toString());
			// writer.flush();
			// writer.close();
		} catch (Exception e) {
			System.err.println("Error occurred when output staff data.");
			e.printStackTrace();
			// System.exit(1);
		}
		return null;
	}

	//全訂單總表(更新了的外勤同事進度表)
	public static void createAllSchedulingJson() {
		List<STIScheduledOrder> data_list = new ArrayList<STIScheduledOrder>();
		try {
			for (Order order : STINewOrder_list) {
				for (Service service : order.service_list) {
					
					//data_list.add(service.g);
				}
			}
			Gson gson = new Gson();
			JsonElement element = gson.toJsonTree(data_list, new TypeToken<List<STIScheduledOrder>>() {
			}.getType());
			JsonArray jsonArray = element.getAsJsonArray();
			Writer writer = new OutputStreamWriter(new FileOutputStream("arguments[10]"),"UTF-8");
			writer.write(jsonArray.toString());
			writer.flush();
			writer.close();
			data_list.clear();
		} catch (Exception e) {
			System.err.println("Error occurred when output staff data.");
			e.printStackTrace();
			System.exit(1);
		}
	}


	public static void createStaffSchedulingJson() {
		try {
			List<AllStaffData> all_staff = new ArrayList<AllStaffData>();
			for (Staff staff : staff_list) {
				List<STIScheduledOrder> staff_data_list = new ArrayList<STIScheduledOrder>();
				for (STIService service : staff.service_sti_list) {
					//STIScheduledOrder data = new STIScheduledOrder();
					
					staff_data_list.add(service.genSTIScheduledOrder());
				}

				AllStaffData all = new AllStaffData();
				all.ID = staff.ID;
				all.sti_data_list = staff_data_list;
				all_staff.add(all);
			}

			Gson gson = new Gson();
			JsonElement element = gson.toJsonTree(all_staff, new TypeToken<List<AllStaffData>>() {
			}.getType());
			JsonArray jsonArray = element.getAsJsonArray();
			Writer writer = new OutputStreamWriter(new FileOutputStream("arguments[9]"),"UTF-8");
			writer.write(jsonArray.toString());
			writer.flush();
			writer.close();
		} catch (Exception e) {
			System.err.println("Error occurred when output staff data.");
			e.printStackTrace();
			System.exit(1);
		}
	}


	public static void handleSchedulingSTI(Map args)
	{
		try {
			List<STIScheduledOrder> scheduledList = null;
			// scheduledList = STIScheduledOrder.readJsonFile(args[4]);
			scheduledList = (List<STIScheduledOrder>) args.get("STI_data");
			//System.out.println("scheduledList:" + scheduledList);

			for (STIScheduledOrder schedule : scheduledList) {
				// System.out.println("read STIScheduledOrder: "+schedule);
				// Customer customer = new Customer();
				// customer.customer_ID = schedule.customer_ID;
				// customer.type = schedule.type;
				// customer.service_time = schedule.service_time;
				// customer.money_type = schedule.money_type;
				// customer.money_percent = schedule.money_percent;
				// customer.period = schedule.period;
				// customer.weekday = schedule.weekday;
				// customer.important = schedule.important;
				// customer.holiday = schedule.holiday;
				// customer.remark = schedule.remark;
				// customer.blacklist = schedule.blacklist;

				// // 客戶編號，服務種類
				// servicemapCustomer.put(schedule.customer_ID + "," + schedule.type, customer);

				//if (schedule.date.equals(today.format(DateTimeFormatter.ofPattern("dd/MM/yyyy")))) {
					
					//create a new service
					STIService service = new STIService();
					service.customer_ID = schedule.customer_ID;
					service.name = schedule.customerName;
					service.type = schedule.type;
					service.order_ID = schedule.order_No;
					service.region = service.customer_ID.substring(0, 3);
					service.skills = getRequiredSkillsWithoutCompany(servicemapSkill, service.type);
					service.order_type = 1;
					service.order = schedule;
					
					
					//find the corresponding customer or create a new order if the customer doesn't exist
					// int order_index = getOrderIndex(STIScheduledOrder_list, service.customer_ID);
					// Order order;
					// if (order_index != -1) {
					// 	order = (STIScheduledOrder)STIScheduledOrder_list.get(order_index);
					// } else {
					// 	order = new STIScheduledOrder();
					// 	order.customer_ID = service.customer_ID;
					// 	order.region = order.customer_ID.substring(0, 3);
					// 	STIScheduledOrder_list.add(order);
					// }

					// /String id_type = schedule.customer_ID + "," + schedule.type;
					Order order = STIScheduledOrder_Map.get(schedule.customer_ID);
					if (order == null){
						order = new STIScheduledOrder();
						order.customer_ID = service.customer_ID;
						order.region = order.customer_ID.substring(0, 3);
						STIScheduledOrder_Map.put(schedule.customer_ID,order);
					}

					service.needScheduling = false;
					service.order = schedule;
					//add original staffs to the services
					for (String staff : schedule.staff.split(", ")) {
						service.people++;
						staff = staff.split(" ")[0];
						int index = getIndexByID(staff_list, staff);
						if (index != -1) {
							//System.out.println("get staff:" + staff_list.get(index));
							service.original_staffs.add(staff_list.get(index));
							order.original_staffs.add(staff_list.get(index));
						} else if (staff.charAt(0) != 'T') {
							service.staff_string = schedule.staff;
						}
					}
					order.service_list.add(service);
				//}
			}
		} catch (Exception e) {
			System.err.println("Error occurred when reading scheduled data.");
			e.printStackTrace();
			System.exit(5);
		}


		try {
			List<STINewOrder> resList = null;
			// resList = STINewOrder.readJsonFile(args[5]);
			resList = (List<STINewOrder>) args.get("STIOrder_data");
			dealNewSTIOrder(resList,3);
			System.out.println("read newSTIOrder data to resList: "+resList.size());
		} catch (Exception e) {
			System.err.println("Error occurred when reading res newOrder data.");
			e.printStackTrace();
			System.exit(8);
		}

		try {
			List<STINewOrder> resList = null;
			// resList = STINewOrder.readJsonFile(args[6]);
			resList = (List<STINewOrder>) args.get("fogOrder_data");
			dealNewSTIOrder(resList,4);
			System.out.println("read newSTIOrder data to resList with total size: "+resList.size());
		} catch (Exception e) {
			System.err.println("Error occurred when reading res newOrder data.");
			e.printStackTrace();
			System.exit(8);
		}


		//put all original staffs which can do the service to do the service
		for (Order order : STINewOrder_list) {
			if (order.doneAllServices())
				continue;
			STIOrder stiNewOrder = (STINewOrder)order;
			//String id_type = stiNewOrder.customer_ID + "," + stiNewOrder.type;
			Order scheduledOrder = STIScheduledOrder_Map.get(stiNewOrder.customer_ID);
			if (scheduledOrder != null){
				for (Service service : scheduledOrder.service_list) {
					// if (canDoAllService(staff, order.service_list)) {
					// 	order.staffs.add(staff);
					// 	for (Service service : order.service_list) {
					// 		if (service.needToDo())
					// 			doService(staff, service);
					// 	}
					// 	logNeworderStaffs(order, "canDoAllService 0 :");
					// }
				}
			}	
				
			 //TODO: 要對比常規的list
			for (Staff staff : order.original_staffs) {
				if (canDoAllService(staff, order.service_list)) {
					order.staffs.add(staff);
					for (Service service : order.service_list) {
						if (service.needToDo())
							doService(staff, service);
					}
					logNeworderStaffs(order, "canDoAllService 0 :");
				}
			}
		}

		STINewOrder_list.sort((s1, s2) -> s2.priority - s1.priority);
		staff_list.sort((s1, s2) -> s2.capacity - s1.capacity);
		
		//for each order, if the service is not done, find a staff with not enough capacity to do the service
		for (Order order : STINewOrder_list) {
			if (!order.doneAllServices()) {
				for (Staff staff : staff_list) {
					if (!order.staffs.contains(staff) &&
							canDoAllService(staff, order.service_list) && staff.total_profit < staff.min_profit) {
						for (Service service : order.service_list) {
							if (service.needToDo())
								doService(staff, service);
						}
						order.staffs.add(staff);
						logNeworderStaffs(order, "canDoAllService 1 :");
					}
				}
			}
		}

	}

	
	public static void dealNewSTIOrder(List<STINewOrder> newOrders, int order_type) {
		for (STINewOrder temp : newOrders) {
			//if (temp.service_date != "" && temp.service_date != null) {
				//if (getNextWorkingDate(convertStringToLocalDateForNewOrder(temp.service_date)).equals(today)) {
					//System.out.println("temp: "+temp.customer_ID+" - "+convertStringToLocalDateForNewOrder(temp.service_date));
					System.out.println("read NewSTIOrder: "+temp);
					//find the customer ID of each service
					int order_index = getOrderIndex(STINewOrder_list, temp.customer_ID);
					STINewOrder order;
					if (order_index != -1) {
						order = (STINewOrder) STINewOrder_list.get(order_index);
					} else {
						// order = new STINewOrder();
						// order.customer_ID = temp.customer_ID;
						// order.region = order.customer_ID.substring(0, 3);
						order = temp;
						STINewOrder_list.add(order);
					}

					//create a new service
					STIService service = new STIService();
					service.customer_ID = temp.customer_ID;
					service.type = temp.type;
					service.order = temp;

					if (order.containsService(service))
						continue;
					
					service.order_type=order_type;

					service.region = service.customer_ID.substring(0, 3);
					service.skills = getRequiredSkillsWithoutCompany(servicemapSkill, service.type);
					service.name = temp.name;
					service.people = servicemapPeople.get(service.type);

					if (STIservicemapCustomer.get(service.customer_ID + "," + service.type) != null)
						service.blacklist = servicemapCustomer.get(service.customer_ID + "," + service.type).blacklist;

					order.service_list.add(service);
				//}
			//}
		}
	}

	
}
