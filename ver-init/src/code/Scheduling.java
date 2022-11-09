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
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.HashSet;
import java.util.Set;
import java.io.OutputStreamWriter;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class Scheduling {
	static ArrayList<Staff> staff_list = new ArrayList<Staff>();
	static ArrayList<Order> order_list = new ArrayList<Order>();
	static Map<String, String> servicemapSkill = new LinkedHashMap<String, String>(); //service with corresponding skillset required
	static Map<String, String> skillmapIndex = new LinkedHashMap<String, String>(); //service with corresponding index in 技能數據
	static Map<String, String> regionmapIndex = new LinkedHashMap<String, String>(); //service with corresponding index in 分區數據
	static Map<String, Double> servicemapProfit = new LinkedHashMap<String, Double>(); //service with corresponding profit
	static Map<String, Customer> servicemapCustomer = new LinkedHashMap<String, Customer>(); //service with corresponding customer info
	static Map<String, Integer> servicemapPeople = new LinkedHashMap<String, Integer>(); //service corresponding to the number of people required
	//static Map<String, Staff> ordermapStaff = new LinkedHashMap<String, Staff>(); //service with corresponding customer info
	
	
	static String[] arguments;
	static LocalDate today; //排班的天

	static String noSameRegionHeading = "无同區可服務人員，找到非同區可服務人員:"+System.lineSeparator();
	static String noCapacityHeading = "无可接受單量服務人員，找到具備技能服務人員:"+System.lineSeparator();
	static String[] tuenMunOfficeStaffIDS = {"T009AI","T037AH","T195AB","T180AB","T098AJ","T183AA","T157AA"
		,"T161AD","T165AD","T145AM","T080AJ","T055AY","T025AH","T046AY","T051AR"}; 
	static Set<String> tuenMunOfficeStaffIDSet = new HashSet<String> (Arrays.asList(tuenMunOfficeStaffIDS)); 

	public static void main(String[] args) throws FileNotFoundException {

		arguments = args;

		SpringApplication.run(Scheduling.class, args);

		System.out.println("Started program");

		boolean isSTI = (args.length == 9);

		today = isSTI? LocalDate.parse(args[8]):LocalDate.parse(args[14]);
		System.out.println(today);

		/* Read args[0] skill data */
		try {
			List<Skill> skills = null;
			skills = Skill.readSkillJsonFile(args[0]);
			for (Skill s : skills) {
				skillmapIndex.put(s.name, s.id);
			}
			System.out.println("skillmapIndex:" + skillmapIndex);
		} catch (Exception e) {
			System.err.println("Error occurred when reading skill data.");
			e.printStackTrace();
			System.exit(2);
		}

		String regionFilename  = isSTI? args[3]:args[15];
		System.out.println(regionFilename);
		/* Read args[15] region data */
		try {
			List<Region> regions = null;
			regions = Region.readRegionJsonFile(regionFilename);
			for (Region s : regions) {
				String region = s.name.substring(0, 3);
				regionmapIndex.put(region, s.id);
			}
			System.out.println("regionmapIndex:" + regionmapIndex);
		} catch (Exception e) {
			System.err.println("Error occurred when reading region data.");
			e.printStackTrace();
			System.exit(2);
		}

		/* Read args[1] staff data */
		try {
			staff_list = Staff.readJsonFile(args[1]);
			// for (Staff s : staff_list) {
			// 	s.println();
			// }
		} catch (Exception e) {
			System.err.println("Error occurred when reading staff data.");
			e.printStackTrace();
			System.exit(3);
		}
		//System.out.println("staff_list: "+staff_list);
		/* Read args[2] service data */
		try {
			List<Service> services = null;
			services = Service.readJsonFile(args[2]);
			for (Service se : services) {
				servicemapSkill.put(se.customer_ID + "," + se.type, se.skills);
				if (!servicemapPeople.containsKey(se.type)) {
					servicemapPeople.put(se.type, Integer.valueOf(se.range.split("-")[0]));
				}
			}
			System.out.println("servicemapSkill:" + servicemapSkill);
		} catch (Exception e) {
			System.err.println("Error occurred when reading service data.");
			e.printStackTrace();
			System.exit(4);
		}

		/* handling STI */
		if(isSTI){
			STIScheduling stischeduling = new STIScheduling();
			// schedulingSTI.servicemapSkill = servicemapSkill;
			//schedulingSTI.skillmapIndex = skillmapIndex;
			//schedulingSTI.regionmapIndex = regionmapIndex;
			// schedulingSTI.servicemapProfit = servicemapProfit;
			// schedulingSTI.servicemapCustomer = servicemapCustomer;
			// schedulingSTI.servicemapPeople = servicemapPeople;
			stischeduling.handleSchedulingSTI(args);
			return;
		}
		
		/* Read args[3] scheduled data 已排班數據*/
		try {
			List<ScheduledOrder> scheduledList = null;
			scheduledList = ScheduledOrder.readJsonFile(args[3]);
			
			for (ScheduledOrder schedule : scheduledList) {
				Customer customer = new Customer();
				customer.customer_ID = schedule.customer_ID;
				customer.type = schedule.type;
				customer.service_time = schedule.service_time;
				customer.company_ID = schedule.company_ID;
				customer.address = schedule.address;
				customer.overtime_remark = schedule.overtime_remark;
				customer.overtime = schedule.overtime;
				customer.money_type = schedule.money_type;
				customer.money_percent = schedule.money_percent;
				customer.period = schedule.period;
				customer.weekday = schedule.weekday;
				customer.important = schedule.important;
				customer.holiday = schedule.holiday;
				customer.remark = schedule.remark;
				customer.blacklist = schedule.blacklist;

				// 客戶編號，服務種類
				servicemapCustomer.put(schedule.customer_ID + "," + schedule.type, customer);

				if (schedule.service_date.equals(today.format(DateTimeFormatter.ofPattern("dd/MM/yyyy")))) {
					
					//create a new service
					Service service = new Service();
					service.customer_ID = schedule.customer_ID;
					service.name = schedule.name;
					service.type = schedule.type;
					service.order_ID = schedule.order_ID;
					service.region = service.customer_ID.substring(0, 3);
					service.skills = getRequiredSkillsWithoutCompany(servicemapSkill, service.type);
					service.blacklist = schedule.blacklist;
					service.order_type = 1;
					
					//find the corresponding customer or create a new order if the customer doesn't exist
					int order_index = getOrderIndex(order_list, service.customer_ID);
					Order order;
					if (order_index != -1) {
						order = order_list.get(order_index);
					} else {
						order = new Order();
						order.customer_ID = service.customer_ID;
						order.region = order.customer_ID.substring(0, 3);
						order_list.add(order);
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
					order.service_list.add(service);
				}
			}
		} catch (Exception e) {
			System.err.println("Error occurred when reading scheduled data.");
			e.printStackTrace();
			System.exit(5);
		}

		/* Read args[4] daily data 每日工作單*/ 
		try {
			List<DailyOrder> dailyOrders = null;
			dailyOrders = DailyOrder.readJsonFile(args[4]);
			for (DailyOrder daily : dailyOrders) {
				Service service = new Service();
				service.customer_ID = daily.customer_ID;
				service.type = daily.type;
				service.profit = Double.parseDouble(daily.profit.replace(",", ""));
				
				//服務對應的客單價
				servicemapProfit.put(service.customer_ID + "," + service.type, service.profit);
			}
		} catch (Exception e) {
			System.err.println("Error occurred when reading daily data.");
			e.printStackTrace();
			System.exit(6);
		}

		/* Read args[5] prevOrder data 舊單重排*/
		try {
			List<PrevOrder> prevList = null;
			prevList = PrevOrder.readJsonFile(args[5]);
			for (PrevOrder prev : prevList) {
				String ID = prev.customer_ID.replace("\"", "");
				int order_index = getOrderIndex(order_list, ID);
				Order order;
				if (order_index != -1) {
					order = order_list.get(order_index);
				} else {
					order = new Order();
					order.customer_ID = ID;
					order.region = order.customer_ID.substring(0, 3);
					//System.out.println("PrevOrder region:" + order.region + " customer_ID:" + order.customer_ID );
				}
				order.priority = 1;
				
				//create new service
				Service service = new Service();

				service.customer_ID = order.customer_ID;
				service.type = prev.type;

				if (order.containsService(service))
					continue;
			
				service.order_type = 2;

				if (servicemapCustomer.get(service.customer_ID + "," + service.type) != null)
					service.blacklist = servicemapCustomer.get(service.customer_ID + "," + service.type).blacklist;

				// 原本的服務人員
				for (String staff : prev.staff.split(",")) {
					service.people++;
					int index = getIndexByID(staff_list, staff);
					if (index != -1) {
						service.original_staffs.add(staff_list.get(index));
						order.original_staffs.add(staff_list.get(index));
					} else if (staff.charAt(0) != 'T' || staff.substring(0, 4).equals("T010") ||
							staff.substring(0, 4).equals("T700") || staff.substring(0, 4).equals("T701")
							|| staff.substring(0, 4).equals("T702") || staff.substring(0, 4).equals("T703")
							|| staff.substring(0, 4).equals("T704") || staff.substring(0, 4).equals("T705")
							|| staff.substring(0, 4).equals("T706") || staff.substring(0, 4).equals("T707")
							|| staff.substring(0, 4).equals("T888") || staff.substring(0, 4).equals("T999")
							|| staff.substring(0, 4).equals("T000")) { //T010, T700-T707, T888, T999 , T000, O1-O30都不是外勤同事所屬戶口

						Staff temp = new Staff();
						temp.ID = staff;
						service.needScheduling = false;
						service.staff_string = prev.staff;// 服務人員
					}
				}
				service.region = order.region;
				service.name = prev.name;

				// 公司company 服務type
				service.skills = getRequiredSkills(servicemapSkill, prev.company, prev.type);

				if (servicemapCustomer.get(service.customer_ID + "," + service.type) != null)
					service.blacklist = servicemapCustomer.get(service.customer_ID + "," + service.type).blacklist;

				order.service_list.add(service);
				if (order_index == -1) {
					order_list.add(order);
				}
			}
		} catch (Exception e) {
			System.err.println("Error occurred when reading prevOrder data.");
			e.printStackTrace();
			System.exit(7);
		}

		/* Read args[6] newOrder 餐饮 data */
		try {
			List<NewOrder> resList = null;
			resList = NewOrder.readJsonFile(args[6]);
			dealNewOrder(resList,3);
		} catch (Exception e) {
			System.err.println("Error occurred when reading res newOrder data.");
			e.printStackTrace();
			System.exit(8);
		}

		/* Read args[7] newOrder 非餐饮 data */
		try {
			List<NewOrder> nonResList = null;
			nonResList = NewOrder.readJsonFile(args[7]);
			dealNewOrder(nonResList,4);
		} catch (Exception e) {
			System.err.println("Error occurred when reading newOrder data.");
			e.printStackTrace();
			System.exit(9);
		}

		/* Deal data */
		try {
			//get the profit for each order and save it
			for (Order order : order_list) {
				for (Service service : order.service_list) {
					if (servicemapProfit.get(service.customer_ID + "," + service.type) != null) {
						service.profit = servicemapProfit.get(service.customer_ID + "," + service.type);
					}
				}
			}
			servicemapProfit.clear();

			ArrayList<Order> unplanned_order = new ArrayList<Order>();
			
			//put all original staffs which can do the service to do the service
			for (Order order : order_list) {
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
				if (!order.doneAllServices()) {
					for (Staff staff : staff_list) {
						if (!order.staffs.contains(staff) &&
								canDoAllService(staff, order.service_list) && staff.total_profit < staff.min_profit) {
							for (Service service : order.service_list) {
								if (service.needToDo())
									doService(staff, service);
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

			Collections.sort(staff_list);
			Collections.sort(order_list);

			// results
			System.out.println("Start outputing json");
			createStaffJson();
			createAllSchedulingJson();
			createStaffSchedulingJson();
			createOldScheduling();
			createNewSchedulingJson();
			System.out.println("Finished outputing json");

		} catch (Exception e) {
			e.printStackTrace();
		}
	}



	public static void logNeworderStaffs(Order order, String prefix){
		// if(order.customer_ID.equalsIgnoreCase("239KFC10001") 
		// 	|| order.customer_ID.equalsIgnoreCase("243KFC3A") 
		// 	|| order.customer_ID.equalsIgnoreCase("252KFC01") 
		// 	|| order.customer_ID.equalsIgnoreCase("252KFC10001") 
		// 	|| order.customer_ID.equalsIgnoreCase("247PAT10001") 
		// 	|| order.customer_ID.equalsIgnoreCase("238CHI10012") 
		// 	|| order.customer_ID.equalsIgnoreCase("251OMI10001") 
		// 	|| order.customer_ID.equalsIgnoreCase("119MIL10001A") 
		// 	|| order.customer_ID.equalsIgnoreCase("013CAS10005") 
		// 	|| order.customer_ID.equalsIgnoreCase("006MSK10002") 
		// 	|| order.customer_ID.equalsIgnoreCase("013HON10020") 
		// 	|| order.customer_ID.equalsIgnoreCase("013HON10020") 		
		// 	|| order.customer_ID.equalsIgnoreCase("242MCD01") 
		// 	|| order.customer_ID.equalsIgnoreCase("120THE10009") 
		// 	|| order.customer_ID.equalsIgnoreCase("118FEA01")
		// 	|| order.customer_ID.equalsIgnoreCase("129KFC10002") 
		// 	|| order.customer_ID.equalsIgnoreCase("239KFC10001") 
		// 	|| order.customer_ID.equalsIgnoreCase("243KFC3A")
		// 	|| order.customer_ID.equalsIgnoreCase("252KFC01") 
		// 	|| order.customer_ID.equalsIgnoreCase("013HON10020") 
		// 	|| order.customer_ID.equalsIgnoreCase("252KFC10001")
		// 	)
		{
			//  System.out.println("<<<<<<<<"+prefix+"<<<<<<<<"+order.customer_ID 
			//  		+"---" + order.staffs);		
		}

	}
	
	

	//全訂單總表(更新了的外勤同事進度表)
	public static void createAllSchedulingJson() {
		List<ScheduledOrder> data_list = new ArrayList<ScheduledOrder>();
		try {
			for (Order order : order_list) {
				for (Service service : order.service_list) {
					ScheduledOrder data = new ScheduledOrder();
					String staff_string = "";
					String separator = "";
					if (service.needScheduling) {
						for (Staff staff : service.staffs) {
							staff_string += separator + staff.ID + " " + staff.name;
							separator = ", ";
						}
					} else {
						staff_string = service.staff_string;
					}

					data.service_date = (today.format(DateTimeFormatter.ofPattern("dd/MM/yyyy")));
					data.customer_ID = service.customer_ID;
					data.name = service.name;
					data.type = service.type;
					data.staff = staff_string;
					data.order_ID = service.order_ID;
					data.confirmed = "TRUE";
					data.blacklist = service.blacklist;
					data.order_type = service.order_type;

					if (servicemapCustomer.get(service.customer_ID + "," + service.type) != null) {
						Customer customer = servicemapCustomer.get(service.customer_ID + "," + service.type);
						data.service_time = customer.service_time;
						data.company_ID = customer.company_ID;
						data.address = customer.address;
						data.overtime_remark = customer.overtime_remark;
						data.overtime = customer.overtime;
						data.money_type = customer.money_type;
						data.money_percent = customer.money_percent;
						data.period = customer.period;
						data.weekday = customer.weekday;
						data.important = customer.important;
						data.holiday = customer.holiday;
						data.remark = customer.remark;
					}
					data_list.add(data);
				}
			}
			Gson gson = new Gson();
			JsonElement element = gson.toJsonTree(data_list, new TypeToken<List<ScheduledOrder>>() {
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
	
	//每位員工的訂單
	public static void createStaffSchedulingJson() {
		try {
			List<AllStaffData> all_staff = new ArrayList<AllStaffData>();
			for (Staff staff : staff_list) {
				List<ScheduledOrder> staff_data_list = new ArrayList<ScheduledOrder>();
				for (Service service : staff.service_list) {
					ScheduledOrder data = new ScheduledOrder();
					String staff_string = "";
					String separator = "";
					if (service.needScheduling) {
						for (Staff s : service.staffs) {
							staff_string += separator + s.ID + " " + s.name;
							separator = ", ";
						}
					} else {
						staff_string = service.staff_string;
					}

					data.service_date = (today.format(DateTimeFormatter.ofPattern("dd/MM/yyyy")));
					data.customer_ID = service.customer_ID;
					data.name = service.name;
					data.type = service.type;
					data.staff = staff_string;
					data.order_ID = service.order_ID;
					data.confirmed = "TRUE";
					data.blacklist = service.blacklist;
					data.order_type = service.order_type;

					if (servicemapCustomer.get(service.customer_ID + "," + service.type) != null) {
						Customer customer = servicemapCustomer.get(service.customer_ID + "," + service.type);
						data.service_time = customer.service_time;
						data.company_ID = customer.company_ID;
						data.address = customer.address;
						data.overtime_remark = customer.overtime_remark;
						data.overtime = customer.overtime;
						data.money_type = customer.money_type;
						data.money_percent = customer.money_percent;
						data.period = customer.period;
						data.weekday = customer.weekday;
						data.important = customer.important;
						data.holiday = customer.holiday;
						data.remark = customer.remark;
					}
					staff_data_list.add(data);
				}

				AllStaffData all = new AllStaffData();
				all.ID = staff.ID;
				all.data_list = staff_data_list;
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

	//待排單
	public static void createOldScheduling() {
		List<PrevOrder> prevList = null;
		List<PrevOrderData> data_list = new ArrayList<PrevOrderData>();
		try {
			prevList = PrevOrder.readJsonFile(arguments[5]);
			for (PrevOrder prev : prevList) {
				prev.customer_ID = prev.customer_ID.replace("\"", "");
				Order order = order_list.get(getOrderIndex(order_list, prev.customer_ID));
				for (Service service : order.service_list) {
					if (prev.type.equals(service.type)) {
						PrevOrderData data = new PrevOrderData();
						String staff_string = "", separator = "";
						if (service.needScheduling) {
							for (Staff staff : service.staffs) {
								staff_string += separator + staff.ID;
								separator = ",";
							}
						} else {
							staff_string = service.staff_string;
						}
						data.company = prev.company;
						data.customer_ID = "\"" + prev.customer_ID + "\"";
						data.name = prev.name;
						data.current_staff = staff_string;
						data.order_ID = prev.order_ID;
						data.staff = prev.staff;
						data.name = prev.name;
						data_list.add(data);
					}
				}
			}
			Gson gson = new Gson();
			JsonElement element = gson.toJsonTree(data_list, new TypeToken<List<PrevOrderData>>() {
			}.getType());
			JsonArray jsonArray = element.getAsJsonArray();
			Writer writer = new OutputStreamWriter(new FileOutputStream(arguments[11].toString()),"UTF-8");
			writer.write(jsonArray.toString());
			writer.flush();
			writer.close();
		} catch (Exception e) {
			System.err.println("Error occurred when output prevOrder data.");
			e.printStackTrace();
			System.exit(1);
		}
	}

	//新訂單
	public static void createNewSchedulingJson() {
		List<NewOrder> resList = null;
		List<NewOrder> nonResList = null;
		
		//read restaurant data
		try {
			resList = NewOrder.readJsonFile(arguments[6]);
		} catch (Exception e) {
			System.err.println("Error occurred when reading res newOrder data.");
			e.printStackTrace();
			System.exit(8);
		}

		//read non-restaurant data
		try {
			nonResList = NewOrder.readJsonFile(arguments[7]);
		} catch (Exception e) {
			System.err.println("Error occurred when reading newOrder data.");
			e.printStackTrace();
			System.exit(9);
		}

		List<NewOrderData> res_data_list = new ArrayList<NewOrderData>();
		List<NewOrderData> non_res_data_list = new ArrayList<NewOrderData>();
		try {
			for (NewOrder neworder : resList) {
				if (neworder.effective_date != null && !neworder.effective_date.equals("")
						&& convertStringToLocalDateForNewOrder(neworder.effective_date)
								.plusDays(1).equals(today)) {
					
					//find the corresponding order
					Order order = order_list.get(getOrderIndex(order_list, neworder.customer_ID));
					NewOrderData data = new NewOrderData();
					
					//create the staff string
					String staff_id_string = "", staff_name_string = "", separator = "";
					for (Service service : order.service_list) {
						if (neworder.type.equals(service.type)) {
							if(service.staffs.size() > 0){
								for (Staff staff : service.staffs) {
									staff_id_string += separator + staff.ID;
									staff_name_string += separator + staff.name;
									separator = ",";
								}
							}else if(service.igregion_staffs.size() > 0){
								staff_id_string += noSameRegionHeading;
								staff_name_string += noSameRegionHeading;
								for (Staff staff : service.igregion_staffs.values()) {
									staff_id_string += separator + staff.ID;
									staff_name_string += separator + staff.name;
									if(staff.region != null){
										staff_id_string +=  "("+ staff.region +")";
										staff_name_string +=  "("+ staff.region +")";
									}
									separator = ",";
								}
							}							
							//System.out.println("--staffs:" + service.customer_ID + "," + service.staffs.size() + "," + staff_name_string);
							break;							
						}
					}
					
					data.receive_date = neworder.receive_date;
					data.customer_ID = neworder.customer_ID;
					data.effective_date = neworder.effective_date;
					data.name = neworder.name;
					data.type = neworder.type;
					data.staff_id = staff_id_string;
					data.staff_name = staff_name_string;
					data.order_ID=neworder.order_ID;
					res_data_list.add(data);
				}
				
				//write the json file
				Gson gson = new Gson();
				JsonElement element = gson.toJsonTree(res_data_list, new TypeToken<List<NewOrder>>() {
				}.getType());
				JsonArray jsonArray = element.getAsJsonArray();
				Writer writer = new OutputStreamWriter(new FileOutputStream(arguments[12].toString()),"UTF-8");
				writer.write(jsonArray.toString());
				writer.flush();
				writer.close();
			}
			res_data_list.clear();
			
			for (NewOrder neworder : nonResList) {
				if (neworder.effective_date != null && !neworder.effective_date.equals("")
						&& convertStringToLocalDateForNewOrder(neworder.effective_date)
								.plusDays(1).equals(today)) {
					
					//find the corresponding order
					Order order = order_list.get(getOrderIndex(order_list, neworder.customer_ID));
					NewOrderData data = new NewOrderData();
					
					//create the staff string
					String staff_id_string = "", staff_name_string = "", separator = "";
					for (Service service : order.service_list) {
						if (neworder.type.equals(service.type)) {
							if(service.staffs.size() > 0){
								for (Staff staff : service.staffs) {
									staff_id_string += separator + staff.ID;
									staff_name_string += separator + staff.name;
									separator = ",";
								}
							}else if(service.igregion_staffs.size() > 0){
								staff_id_string += noSameRegionHeading;
								staff_name_string += noSameRegionHeading;
								for (Staff staff : service.igregion_staffs.values()) {
									staff_id_string += separator + staff.ID;
									staff_name_string += separator + staff.name;
									if(staff.region != null){
										staff_id_string +=  "("+ staff.region +")";
										staff_name_string +=  "("+ staff.region +")";
									}
									separator = ",";
								}
							}else if(service.unplanned_staffs.size() > 0){
								staff_id_string += noSameRegionHeading;
								staff_name_string += noSameRegionHeading;
								for (Staff staff : service.unplanned_staffs) {
									staff_id_string += separator + staff.ID;
									staff_name_string += separator + staff.name;
									if(staff.region != null){
										staff_id_string +=  "("+ staff.region +")";
										staff_name_string +=  "("+ staff.region +")";
									}
									separator = ",";
								}
							}
							break;
						}
					}
					
					data.receive_date = neworder.receive_date;
					data.customer_ID = neworder.customer_ID;
					data.effective_date = neworder.effective_date;
					data.name = neworder.name;
					data.type = neworder.type;
					data.staff_id = staff_id_string;
					data.staff_name = staff_name_string;
					data.order_ID=neworder.order_ID;
					non_res_data_list.add(data);
				}
				
				//write the json file
				Gson gson = new Gson();
				JsonElement element = gson.toJsonTree(non_res_data_list, new TypeToken<List<NewOrder>>() {
				}.getType());
				JsonArray jsonArray = element.getAsJsonArray();
				Writer writer = new OutputStreamWriter(new FileOutputStream(arguments[13].toString()),"UTF-8");
				writer.write(jsonArray.toString());
				writer.flush();
				writer.close();
			}
		} catch (Exception e) {
			System.err.println("Error occurred when output neworder data.");
			e.printStackTrace();
			System.exit(1);
		}
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
				data.total_order = staff.service_list.size();
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

	// Check whether a staff satisfy the skill requirement
	public static boolean checkSkill(String required_skills, String skillset) {
		if (required_skills.equals("NA"))
			return true;

		for (String skill : required_skills.split(",")) {
			if (Arrays.asList(skillset.split(",")).contains(skill))
				return true;
		}

		return false;
	}
	
	//check whether a staff can do all service in the service list
	public static boolean canDoAllService(Staff staff, ArrayList<Service> service_list) {
		int i = 0;
		for (Service service : service_list) {
			if (service.needToDo()) {
				if (!canDoService(staff, service))
					return false;
				i++;
			}
		}
		if (staff.capacity < i)
			return false;
		return true;
	}

	//check whether a staff can do all service in the service list ignoring region
	public static boolean canDoAllServiceIgnoreRegion(Staff staff, ArrayList<Service> service_list) {
		int i = 0;
		for (Service service : service_list) {
			if (service.needToDo()) {
				if (!canDoServiceIgnoreRegion(staff, service))
					return false;
				i++;
			}
		}
		if (staff.capacity < i)
			return false;
		return true;
	}

	//check whether a staff can do all service in the service list ignoring capacity
	public static boolean canDoAllServiceIgnoreCapacity(Staff staff, ArrayList<Service> service_list) {
		for (Service service : service_list) {
			if (service.needToDoIgnoreCapacity()) {
				if (!canDoServiceIgnoreCapacity(staff, service))
					return false;
			}
		}
		return true;
	}

	//check region satification
	public static boolean isRegionMatched(String service_region, String staff_region, Staff staff) {
		if(staff_region.equals("")) return true;
		if (staff_region.equals(service_region)) {
			//System.out.println("equals:" + staff_region + "," + service_region);
			return true;
		}
		
		if(staff.isTunMenOffice.equalsIgnoreCase("Y")){
			int service_region_number = Integer.parseInt(service_region.substring(0, 3));
			//System.out.println("<><><>isTunMenOffice:" + staff_region + "," + staff.ID + ","+ service_region_number);
			if(service_region_number >=100 && service_region_number<200) {
				//System.out.println("<><>return false isTunMenOffice:"+ staff_region + "," + staff.ID + ","+ service_region_number);
				return false;
			}
		}
		
		String staff_region_id = regionmapIndex.get(staff_region);	
		String service_region_id = regionmapIndex.get(service_region);
		//System.out.println("staff_region_id:" + staff_region + "," + staff_region_id);
		//System.out.println("service_region_id:" + service_region + "," + service_region_id);
		if (staff_region_id == null || service_region_id == null) return false;
		if(staff_region_id.equals(service_region_id)) {
			//System.out.println("Match:" + staff_region + "," + service_region + "," + service_region_id);
			return true;
		}
		return false;
	}

	//check whether a staff can do a service
	public static boolean canDoService(Staff staff, Service service) {
		if (staff.capacity > 0) {
			//System.out.println("---canDoService: staff.capacity > 0");	
			if (!service.blacklist.contains(staff.ID)) {
				//兼職的員工(ID開頭不是T0或T1)沒有同區的限制
				if (!staff.ID.substring(0, 2).equals("T0") && !staff.ID.substring(0, 2).equals("T1")) {
					return checkSkill(service.skills, staff.skills);
				}
							
				// 比較員工與服務的地區
				//if (staff.region.equals(service.region) || staff.region.equals("")) 
				// if (isRegionMatched(service.region, staff.region, staff))
				// {
				// 	boolean ret = checkSkill(service.skills, staff.skills);
				// 	//System.out.println("---canDoService: checkSkill(service.skill  "+service.skills+" staff.skill  "+staff.skills+ ret);	
				// 	if(ret){
				// 		System.out.println("Skill Match:" + service.skills + "---" + staff.skills);
				// 	}
				// 	return ret;
				// }

				if (checkSkill(service.skills, staff.skills)){
					boolean ret = isRegionMatched(service.region, staff.region, staff);
					// if(service.customer_ID.equalsIgnoreCase("252KFC01")) 
					// {
					// 	System.out.println("---canDoService:"+service.customer_ID +"---"+ret+"---" + service.skills+"---" + service.region+"---" + staff.skills+"---" + staff.region);										
					// }
					// if(ret){
					// 	if(service.customer_ID.equalsIgnoreCase("252KFC01")) 
					// 		System.out.println("<<<<<<<<Skill Match:" + service.skills + "---" + staff.skills+"---" + staff.region+"---" + staff.ID);
					// }else{
					// 	//service.igregion_staffs.put(staff.ID, staff);
					// }
					return ret;
				}
			}
		}
		return false;
	}

	
	//check whether a staff can do a service
	public static boolean canDoServiceIgnoreRegion(Staff staff, Service service) {
		if (staff.capacity > 0) {
			//System.out.println("---canDoService: staff.capacity > 0");	
			if (!service.blacklist.contains(staff.ID)) {
				boolean ret = checkSkill(service.skills, staff.skills);
				// if(service.customer_ID.equalsIgnoreCase("252KFC01")) 
				// {
				// 	System.out.println("---canDoServiceIgnoreRegion:"+service.customer_ID +"---"+ret+"---" + service.skills+"---" + service.region+"---" + staff.skills+"---" + staff.region);					
				// }
				// if(ret){
				// 	if(service.customer_ID.equalsIgnoreCase("252KFC01")) 
				// 			System.out.println("<<<<<<<<Skill Match:" + service.skills + "---" + staff.skills+"---" + staff.region+"---" + staff.ID);
				// }
				return ret;
			}
		}
		return false;
	}

	//check whether a staff can do a service ignoring capacity
	public static boolean canDoServiceIgnoreCapacity(Staff staff, Service service) {
		if (!service.blacklist.contains(staff.ID)) {
			//if (isRegionMatched(service.region, staff.region, staff)){
				boolean ret = checkSkill(service.skills, staff.skills);
				// if(service.customer_ID.equalsIgnoreCase("252KFC01")) 
				// {
				// 	System.out.println("---canDoServiceIgnoreCapacity:"+service.customer_ID +"---"+ret+"---" + service.skills+"---" + service.region+"---" + staff.skills+"---" + staff.region);					
				// }
				// if(ret){
				// 	if(service.customer_ID.equalsIgnoreCase("252KFC01")) 
				// 			System.out.println("<<<<<<<<Skill Match:" + service.skills + "---" + staff.skills+"---" + staff.region+"---" + staff.ID);
				// }
				return ret;
			//}
		}
		return false;
	}

	//convert string to date for new order
	public static LocalDate convertStringToLocalDateForNewOrder(String string) {
		if (string.contains(".")) {
			return LocalDate.parse(string, DateTimeFormatter.ofPattern("y.M.d"));
		} else if (string.contains("/")) {
			return LocalDate.parse(string, DateTimeFormatter.ofPattern("d/M/y"));
		} else {
			return LocalDate.parse(string, DateTimeFormatter.ofPattern("d-M-y"));
		}
	}

	//do a service
	public static void doService(Staff staff, Service service) {
		staff.capacity--;
		staff.service_list.add(service);
		staff.region = service.region;
		service.staffs.add(staff);
		staff.addProfit(service.profit, service.people);
	}

	//do a service ignoring capacity
	public static void doServiceIgnoreCapacity(Staff staff, Service service) {
		staff.unplanned_service_list.add(service);
		staff.region = service.region;
		service.unplanned_staffs.add(staff);
	}

	// return the index of a staff in the staff list given customer ID
	public static int getIndexByID(ArrayList<Staff> list, String ID) {
		for (int i = 0; i < list.size(); i++) {
			if (list.get(i).ID.equals(ID))
				return i;
		}
		return -1;
	}

	//return the index of an order in the order list given customer ID
	public static int getOrderIndex(ArrayList<Order> order_list, String ID) {
		for (int i = 0; i < order_list.size(); i++) {
			Order order = order_list.get(i);
			if (order.customer_ID.equals(ID))
				return i;
		}
		return -1;
	}

	//get the required skillset for a service
	public static String getRequiredSkills(Map<String, String> map, String company, String type) {
		for (Map.Entry<String, String> entry : map.entrySet()) {
			String[] pair = entry.getKey().toLowerCase().split(",");
			if (company.toLowerCase().contains(pair[0]) && type.toLowerCase().equals(pair[1])) {
				return entry.getValue();
			}
		}
		return "";
	}

	//get the required skillset for a service without company information
	public static String getRequiredSkillsWithoutCompany(Map<String, String> map, String type) {
		for (Map.Entry<String, String> entry : map.entrySet()) {
			String[] pair = entry.getKey().toLowerCase().split(",");
			if (type.toLowerCase().equals(pair[1])) {
				return entry.getValue();
			}
		}
		return "";
	}

	// 展示已full capacity的員工列表
	public static void printFull(String type, ArrayList<Order> order_list) {
		for (Staff staff : staff_list) {
			if (staff.capacity <= 0 && staff.group.contains(type))
				staff.println();
		}
		for (Order order : order_list) {
			for (Staff staff : staff_list) {
				for (Service service : order.service_list) {
					//if (checkSkill(service.skills, staff.skills) && order.region.equals(staff.region)) {
					if (checkSkill(service.skills, staff.skills) && isRegionMatched(order.region, staff.region,staff)){
						staff.unplanned_service_list.add(service);
					}
				}
			}
		}
	}

	// 已安排的訂單
	public static void printOrder(ArrayList<Order> order_list) {
		for (Order order : order_list) {
			order.print_plan();
		}
	}

	// print details of staff
	public static void printStaff() {
		for (Staff staff : staff_list) {
			staff.println();
		}
	}

	//print 未完成的訂單，在不考慮capacity的情況下編排給他
	public static void printUnplannedOrder(ArrayList<Order> order_list) {
		for (Order order : order_list) {
			order.print_unplanned();
		}
	}
	
	//返回下個工作天
	//TODO: 下一天為非星期日的假期(e.g.新年聖誕)的處理
	public static LocalDate getNextWorkingDate(LocalDate date) {
		if (date.plusDays(1).getDayOfWeek().equals(DayOfWeek.SUNDAY)) {
			return date.plusDays(2);
		} else {
			return date.plusDays(1);
		}
	}

	//reading of new order excel
	public static void dealNewOrder(List<NewOrder> newOrders, int order_type) {
		for (NewOrder temp : newOrders) {
			if (temp.effective_date != "" && temp.effective_date != null) {
				if (getNextWorkingDate(convertStringToLocalDateForNewOrder(temp.effective_date)).equals(today)) {
					
					//find the customer ID of each service
					int order_index = getOrderIndex(order_list, temp.customer_ID);
					Order order;
					if (order_index != -1) {
						order = order_list.get(order_index);
					} else {
						order = new Order();
						order.customer_ID = temp.customer_ID;
						order.region = order.customer_ID.substring(0, 3);
						order_list.add(order);
					}

					//create a new service
					Service service = new Service();
					service.customer_ID = temp.customer_ID;
					service.type = temp.type;
					

					if (order.containsService(service))
						continue;
					
					service.order_type=order_type;

					service.region = service.customer_ID.substring(0, 3);
					service.skills = getRequiredSkillsWithoutCompany(servicemapSkill, service.type);
					service.name = temp.name;
					service.people = servicemapPeople.get(service.type);

					if (servicemapCustomer.get(service.customer_ID + "," + service.type) != null)
						service.blacklist = servicemapCustomer.get(service.customer_ID + "," + service.type).blacklist;

					order.service_list.add(service);
				}
			}
		}
	}

}
