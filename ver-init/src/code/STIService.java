package code;
import java.util.ArrayList;

public class STIService extends Service{

    
	STIOrder order;
    STIScheduledOrder stiScheduledOrder;


    STIService() {}
    STIService(STIOrder order){ 
        this.order = order; 

        this.customer_ID = order.customer_ID;
        this.type = order.type;
        
        this.region = this.customer_ID.substring(0, 3);
        this.skills = STIScheduling.getRequiredSkillsWithoutCompany(STIScheduling.servicemapSkill, this.type);
        this.name = order.name;
        this.people = STIScheduling.servicemapPeople.get(this.type);
        if (STIScheduling.STIservicemapCustomer.get(this.customer_ID + "," + this.type) != null)
						this.blacklist = STIScheduling.servicemapCustomer.get(this.customer_ID + "," + this.type).blacklist;
    }

    

    STIService(STIService service){ 
        this(service.order);
        this.staff_string = service.staff_string;
        this.staffs = service.staffs;
        this.igregion_staffs = service.igregion_staffs;
    }

    STIScheduledOrder genSTIScheduledOrder(){
        if (order instanceof STIScheduledOrder) return (STIScheduledOrder)order;
        if (stiScheduledOrder != null) return stiScheduledOrder;
        
        STIScheduledOrder data = new STIScheduledOrder();
        String staff_string = "";
        String separator = "";
        if (this.needScheduling) {
            for (Staff staff : this.staffs) {
                staff_string += separator + staff.ID + " " + staff.name;
                separator = ", ";
            }
        } else {
            staff_string = this.staff_string;
        }
        /*
        data.date = (today.format(DateTimeFormatter.ofPattern("dd/MM/yyyy")));
        data.customer_ID = this.customer_ID;
        data.name = this.name;
        data.type = this.type;
        data.staff = staff_string;
        data.order_ID = this.order_ID;
        data.confirmed = "TRUE";
        data.blacklist = this.blacklist;
        data.order_type = this.order_type;

        if (servicemapCustomer.get(this.customer_ID + "," + this.type) != null) {
            Customer customer = servicemapCustomer.get(this.customer_ID + "," + this.type);
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
        }*/
        return data;
    }
}
