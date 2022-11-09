package com.lbs.demo.code;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.Set;

public class Order implements Comparable<Order> {
	String customer_ID;
	ArrayList<Service> service_list = new ArrayList<Service>();
	String region="";
	Set<Staff> staffs = new HashSet<Staff>();
	Set<Staff> original_staffs = new HashSet<Staff>();
	ArrayList<Staff> unplanned_staffs = new ArrayList<Staff>();
	int priority=0;
	
	//print planned order
	public void print_plan() {

		for (Service service: service_list) {
			String separator = ""; 
			System.out.print(customer_ID+","+service.type);
			System.out.print("\t");
			
			if (service.needScheduling) {
				for (Staff staff: service.staffs) {
					System.out.print(separator+staff.ID);
					separator=",";
				}
			} else {
				for (String staff:service.staff_string.split(", ")) {
					System.out.print(separator+staff.split(" ")[0]);
					separator=",";
				}
			}
			
			System.out.print("\t");
		}
		
		System.out.println();
	}
	
	//print unplanned order
	public void print_unplanned() {
		
		boolean print=false;
		
		for (Service service: service_list) {
			if (service.needToDo()) {
				String separator = ""; 
				System.out.print(customer_ID+","+service.type);
				System.out.print("\t");
				for (Staff staff: service.unplanned_staffs) {
					System.out.print(separator+staff.ID);
					separator=",";
				}
				if (service.unplanned_staffs.size()==0) {
					separator="";
				}
				System.out.print("\t");
				print = true;
			}
		}
		
		if (print)
		System.out.println();
	}
	
	public boolean doneAllServices() {
		for (Service service: service_list) {
			if (service.people!=service.staffs.size() + service.unplanned_staffs.size() && service.needScheduling)
				return false;
		}
		return true;
	}
	
	public boolean containsService(Service service) {
		for (Service temp: service_list) {
			if (temp.customer_ID.equals(service.customer_ID)&&temp.type.equals(service.type)) return true;
		}
		return false;
	}
	
	
	@Override
	public int compareTo(Order o) {
		return this.customer_ID.compareTo(o.customer_ID);
	}
}
