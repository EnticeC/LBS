package code;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.Set;
import java.time.LocalDate;


public class STIOrder extends Order {

	String service_date;//工作單編號   
    String service_time;// 服务時間
    //String customer_ID;// 客戶編唬
    String name;// 客戶名稱
    String company_ID;// 集團公司編號
    String address;// 技術員
    String type;// 客戶等級
    String staff;// 付款方式

	LocalDate service_date_Localdate;
	ArrayList<STIService> original_service_list = new ArrayList<STIService>();
	//ArrayList<STIService> scheduling_service_list = new ArrayList<STIService>();

	

	STIOrder() {}
	STIOrder(STIOrder order){
		this.customer_ID = order.customer_ID;
		this.region = order.region;
		//this.service_date = order.service_date;
		//this.service_time = order.service_time;
		this.name = order.name;
		this.region = order.region;
		this.address = order.address;
		this.type = order.type;
		this.staff = order.staff;
	}
	// ArrayList<Service> sti_service_list = new ArrayList<Service>();
	
	
	// public boolean doneAllServices() {
	// 	for (Service service: sti_service_list) {
	// 		if (service.people!=service.staffs.size() + service.unplanned_staffs.size() && service.needScheduling)
	// 			return false;
	// 	}
	// 	return true;
	// }
	
	// public boolean containsService(Service service) {
	// 	for (Service temp: sti_service_list) {
	// 		if (temp.customer_ID.equals(service.customer_ID)&&temp.type.equals(service.type)) return true;
	// 	}
	// 	return false;
	// }
	
	@Override
    public String toString() {
        return this.customer_ID + "," + this.type + "," + this.service_date;
    }
}
