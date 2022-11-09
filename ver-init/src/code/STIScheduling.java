package code;

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

@SpringBootApplication
public class STIScheduling extends Scheduling{
	
	//static String[] arguments;
	//static LocalDate today; //排班的天


	static Map<String,Order> STIScheduledOrder_Map = new HashMap<String,Order>();
	static ArrayList<Order> STIScheduledOrder_list = new ArrayList<Order>();
	static ArrayList<Order> STIOrder_list = new ArrayList<Order>();
	static Map<String, Customer> STIservicemapCustomer = new LinkedHashMap<String, Customer>(); //service with corresponding customer info
	static Map<String, STIScheduledOrder> STIservicemapSTIScheduledOrder = new LinkedHashMap<String, STIScheduledOrder>(); //service with corresponding customer info
	

	static String noSameRegionHeading = "无同區可服務人員，找到非同區可服務人員:"+System.lineSeparator();

	//return the index of an order in the order list given customer ID
	public static int getServiceIndex(ArrayList<Service> service_list, String type) {
		for (int i = 0; i < service_list.size(); i++) {
			Service service = service_list.get(i);
			if (service.type.equals(type))
				return i;
		}
		return -1;
	}

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
	public static void createStaffJson() {
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
			Writer writer = new OutputStreamWriter(new FileOutputStream(arguments[8].toString()),"UTF-8");
			writer.write(jsonArray.toString());
			writer.flush();
			writer.close();
		} catch (Exception e) {
			System.err.println("Error occurred when output staff data.");
			e.printStackTrace();
			System.exit(1);
		}
	}

	//全訂單總表(更新了的外勤同事進度表)
	public static void createAllSchedulingJson() {
		List<STIScheduledOrder> data_list = new ArrayList<STIScheduledOrder>();
		try {
			for (Order order : STIOrder_list) {
				for (Service service : order.service_list) {
					
					//data_list.add(service.g);
				}
			}
			Gson gson = new Gson();
			JsonElement element = gson.toJsonTree(data_list, new TypeToken<List<STIScheduledOrder>>() {
			}.getType());
			JsonArray jsonArray = element.getAsJsonArray();
			Writer writer = new OutputStreamWriter(new FileOutputStream(arguments[10]),"UTF-8");
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
			Writer writer = new OutputStreamWriter(new FileOutputStream(arguments[9].toString()),"UTF-8");
			writer.write(jsonArray.toString());
			writer.flush();
			writer.close();
		} catch (Exception e) {
			System.err.println("Error occurred when output staff data.");
			e.printStackTrace();
			System.exit(1);
		}
	}


	public static void handleSchedulingSTI(String[] args)
	{
		
		try {
			List<STIScheduledOrder> scheduledList = null;
			scheduledList = STIScheduledOrder.readJsonFile(args[4]);
			//System.out.println("scheduledList:" + scheduledList);
			readScheduledSTIOrder(scheduledList);
		} catch (Exception e) {
			System.err.println("Error occurred when reading scheduled data.");
			e.printStackTrace();
			System.exit(5);
		}
	
		try {
			List<STINewOrder> resList = null;
			resList = STINewOrder.readJsonFile(args[5]);
			dealNewSTIOrder(resList,3);
			System.out.println("read newSTIOrder data to resList: "+resList.size());
		} catch (Exception e) {
			System.err.println("Error occurred when reading res newOrder data.");
			e.printStackTrace();
			System.exit(8);
		}

		try {
			List<STINewOrder> resList = null;
			resList = STINewOrder.readJsonFile(args[6]);
			dealNewSTIOrder(resList,4);
			System.out.println("read newSTIOrder data to resList with total size: "+resList.size());
		} catch (Exception e) {
			System.err.println("Error occurred when reading res newOrder data.");
			e.printStackTrace();
			System.exit(8);
		}


		Scheduling();
		
		Collections.sort(staff_list);
		Collections.sort(order_list);

		// results
		System.out.println("Start outputing json");
		createStaffJson();
		createAllSchedulingJson();
		createStaffSchedulingJson();
		// createOldScheduling();
		// createNewSchedulingJson();
		System.out.println("Finished outputing json");
		

	}

	public static void readScheduledSTIOrder(List<STIScheduledOrder> scheduledList) {	
		/* Read args[3] scheduled data 已排班數據*/
		for (STIScheduledOrder schedule : scheduledList) {
			Customer customer = new Customer();
			customer.customer_ID = schedule.customer_ID;
			customer.type = schedule.type;
			customer.service_time = schedule.service_time;
			customer.company_ID = schedule.company_ID;
			customer.address = schedule.address;
			// customer.overtime_remark = schedule.overtime_remark;
			// customer.overtime = schedule.overtime;
			// customer.money_type = schedule.money_type;
			// customer.money_percent = schedule.money_percent;
			// customer.period = schedule.period;
			// customer.weekday = schedule.weekday;
			// customer.important = schedule.important;
			// customer.holiday = schedule.holiday;
			// customer.remark = schedule.remark;
			// customer.blacklist = schedule.blacklist;

			// 客戶編號，服務種類
			servicemapCustomer.put(schedule.customer_ID + "," + schedule.type, customer);

			if (schedule.service_date.equals(today.format(DateTimeFormatter.ofPattern("dd/MM/yyyy")))) {
				
				//create a new service
				STIService service = new STIService();
				service.customer_ID = schedule.customer_ID;
				service.name = schedule.name;
				service.type = schedule.type;
				//service.order_ID = schedule.order_ID;
				service.region = service.customer_ID.substring(0, 3);
				service.skills = getRequiredSkillsWithoutCompany(servicemapSkill, service.type);
				//service.blacklist = schedule.blacklist;
				service.order_type = 1;
				
				service.order = schedule;
				
				//find the corresponding customer or create a new order if the customer doesn't exist
				int order_index = getOrderIndex(STIOrder_list, service.customer_ID);
				STIOrder order;
				if (order_index != -1) {
					order = (STIOrder)STIOrder_list.get(order_index);
				} else {
					// // order = new Order();
					// // order.customer_ID = service.customer_ID;
					// order = schedule;
					// order.region = order.customer_ID.substring(0, 3);
					// STIOrder_list.add(order);
					return;
				}

				//add original staffs to the services
				for (String staff : schedule.staff.split(", ")) {
					service.people++;
					staff = staff.split(" ")[0];
					int index = getIndexByID(staff_list, staff);
					if (index != -1) {
						service.original_staffs.add(staff_list.get(index));
						order.original_staffs.add(staff_list.get(index));
					} else if (staff.charAt(0) != 'T') {
						service.needScheduling = false;
						service.staff_string = schedule.staff;
					}
				}
				order.original_service_list.add(service);
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
					int order_index = getOrderIndex(STIOrder_list, temp.customer_ID);
					STIOrder order;
					if (order_index != -1) {
						order = (STIOrder) STIOrder_list.get(order_index);
					} else {
						// order = new STIOrder();
						// order.customer_ID = temp.customer_ID;
						order = temp;
						order.region = order.customer_ID.substring(0, 3);
						STIOrder_list.add(order);
					}

					//create a new service
					STIService service = new STIService(temp);
					service.customer_ID = temp.customer_ID;
					service.type = temp.type;
					service.needScheduling = true;
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

	

	public static void Scheduling(){
		/* Deal data */
		try {
			//get the profit for each order and save it
			// for (Order order : order_list) {
			// 	for (Service service : order.service_list) {
			// 		if (servicemapProfit.get(service.customer_ID + "," + service.type) != null) {
			// 			service.profit = servicemapProfit.get(service.customer_ID + "," + service.type);
			// 		}
			// 	}
			// }
			// servicemapProfit.clear();

			ArrayList<Order> unplanned_order = new ArrayList<Order>();
			
			//put all original staffs which can do the service to do the service
			for (Order order : STIOrder_list) {
				if (order.doneAllServices())
					continue;

			 	//TODO: 要對比常規的list
				for (Staff staff : order.original_staffs) {
					if (canDoAllService(staff, order.service_list)) {
						order.staffs.add(staff);
						for (Service service : order.service_list) {
							if (service.needToDo())
								doService(staff, service);
						}
						//logNeworderStaffs(order, "canDoAllService 0 :");
					}
				}
			}

			order_list.sort((s1, s2) -> s2.priority - s1.priority);
			staff_list.sort((s1, s2) -> s2.capacity - s1.capacity);
			
			//for each order, if the service is not done, find a staff with not enough capacity to do the service
			
			for (Order order : order_list) {
				int nServices =  order.countUndoneAllServices() ;
				
				//if (!order.doneAllServices()) {
				if(nServices > 0){
					int remainDays = 28-today.getDayOfMonth();
					int daysIncrement = nServices > 1 ? remainDays / nServices : 1;
					LocalDate dates[] = new LocalDate [nServices];
					int i=0;
					dates[i++]= today.plusDays(2);
					while(i<nServices){
						dates[i++]= dates[i-1].plusDays(daysIncrement);
						System.out.println("dates[i]: "+dates[i-1]);
					}
					i=0;
					for (Staff staff : staff_list) {
						if (!order.staffs.contains(staff) &&
								canDoAllService(staff, order.service_list) /*&& staff.total_profit < staff.min_profit*/) {
							for (Service service : order.service_list) {
								if (service.needToDo()){
									STIService sService = (STIService) service;
									if(sService.order != null) sService.order.service_date_Localdate = dates[i++];
									sService.order.service_date = sService.order.service_date_Localdate.format(DateTimeFormatter.ofPattern("dd/MM/yyyy"));
									doService(staff, service);
								}
									
							}
							order.staffs.add(staff);
							//logNeworderStaffs(order, "canDoAllService 1 :");
						}
					}
				}
			}
			
			staff_list.sort((s1, s2) -> s2.capacity - s1.capacity);

			//for each order, if the service is not done, find a staff to do the service
			for (Order order : order_list) {
				if (!order.doneAllServices()) {
					for (Staff staff : staff_list) {
						if (!order.staffs.contains(staff) &&
								canDoAllService(staff, order.service_list)) {
							for (Service service : order.service_list) {
								if (service.needToDo())
									doService(staff, service);
							}
							order.staffs.add(staff);
							//logNeworderStaffs(order, "canDoAllService 2:");
						}
					}
					if (!order.doneAllServices())
						unplanned_order.add(order);
				}

				for (Service service : order.service_list) {
					Collections.sort(service.staffs);
					// Collections.sort(service.igregion_staffs);
				}
			}

			for (Order order : unplanned_order) {
				for (Staff staff : staff_list) {
					if (!order.staffs.contains(staff) &&
							canDoAllServiceIgnoreRegion(staff, order.service_list)) {
						for (Service service : order.service_list)
							service.igregion_staffs.put(staff.ID, staff);
						logNeworderStaffs(order, "canDoAllServiceIgnoreRegion:");
						//break;
					}
					// if (!order.unplanned_staffs.contains(staff) &&
					// 		canDoAllServiceIgnoreCapacity(staff, order.service_list)) {
					// 	for (Service service : order.service_list)
					// 		doServiceIgnoreCapacity(staff, service);
					// 	logNeworderStaffs(order, "canDoAllServiceIgnoreCapacity:");
					// 	//break;
					// }
				}
			}

			//未完成的訂單，在不理會capacity的情況下排班
			//TODO: 前端的資料顯示，即使這個run完後，仍可能出現未排的訂單
			for (Order order : unplanned_order) {
				for (Staff staff : staff_list) {
					if (!order.unplanned_staffs.contains(staff) &&
							canDoAllServiceIgnoreCapacity(staff, order.service_list)) {
						for (Service service : order.service_list)
							doServiceIgnoreCapacity(staff, service);
						logNeworderStaffs(order, "canDoAllServiceIgnoreCapacity:");
						break;
					}
				}
				for (Service service : order.service_list) {
					Collections.sort(service.unplanned_staffs);
				}
			}

		} catch (Exception e) {
			e.printStackTrace();
		}

	}





	public static void readScheduledSTIOrder2(List<STIScheduledOrder> scheduledList) {	
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
				
				schedule.service_date_Localdate=convertStringToLocalDateForNewOrder(schedule.date);
				
				
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
					order.customer_ID = schedule.customer_ID;
					order.region = order.customer_ID.substring(0, 3);
					STIScheduledOrder_Map.put(schedule.customer_ID,order);
				}

				STIService service = null;
				// for (Service temp: order.service_list) {
				// 	STIService os = (STIService)temp;
				// 	if (temp.customer_ID.equals(schedule.customer_ID)&&temp.type.equals(schedule.type)) service = os;
				// }
				
				//create a new service
				if(service == null){
					service = new STIService();
					service.customer_ID = schedule.customer_ID;
					service.name = schedule.customerName;
					service.type = schedule.type;
					service.order_ID = schedule.order_No;
					service.region = service.customer_ID.substring(0, 3);
					service.skills = getRequiredSkillsWithoutCompany(servicemapSkill, service.type);
					service.order_type = 1;
					service.order = schedule;
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
	}

	public static void Scheduling2(){
		//put all original staffs which can do the service to do the service
		for (Order order : STIOrder_list) {
			if (order.doneAllServices())
				continue;
			STIOrder stiNewOrder = (STINewOrder)order;
			//String id_type = stiNewOrder.customer_ID + "," + stiNewOrder.type;
			Order scheduledOrder = STIScheduledOrder_Map.get(stiNewOrder.customer_ID);
			if (scheduledOrder != null){				
				for (Service service : stiNewOrder.service_list) {
					for (Service scheduleService : scheduledOrder.service_list) {
						if(service.type == scheduleService.type){
							// for (Staff staff : scheduleService.staffs) {
							// 	if (canDoAllService(staff, order.service_list)) {
							// 		order.staffs.add(staff);
							// 		for (Service service : order.service_list) {
							// 			if (service.needToDo())
							// 				doService(staff, service);
							// 		}
							// 		//logNeworderStaffs(order, "canDoAllService 0 :");
							// 	}
							// }
							
							STIService cloneService = new STIService((STIService)scheduleService);
							cloneService.order.service_date_Localdate.plusMonths(1);
							cloneService.order.service_date= cloneService.order.service_date_Localdate.
								format(DateTimeFormatter.ofPattern("dd/MM/yyyy"));		
								stiNewOrder.service_list.add(cloneService);				
						}
					}
					stiNewOrder.service_list.remove(service);
				}

		
							for (Staff staff : order.original_staffs) {
								if (canDoAllService(staff, order.service_list)) {
									order.staffs.add(staff);
									for (Service service : order.service_list) {
										if (service.needToDo())
											doService(staff, service);
									}
									//logNeworderStaffs(order, "canDoAllService 0 :");
								}
							}
				
				// if (canDoAllService(staff, order.service_list)) {
				// 	order.staffs.add(staff);
				// 	for (Service service : order.service_list) {
				// 		if (service.needToDo())
				// 			doService(staff, service);
				// 	}
				// 	logNeworderStaffs(order, "canDoAllService 0 :");
				// }
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

		STIOrder_list.sort((s1, s2) -> s2.priority - s1.priority);
		staff_list.sort((s1, s2) -> s2.capacity - s1.capacity);
		
		//for each order, if the service is not done, find a staff with not enough capacity to do the service
		for (Order order : STIOrder_list) {
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
}
