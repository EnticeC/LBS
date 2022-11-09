package com.lbs.demo.code;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode 
public class StaffData implements Serializable {
	String ID; //員工編號
	double profit; //當日薪金
	String reach_profit; //達到薪金要求
	boolean can_receive_order; //今日是否還能接單 true/false 
	String region;//今日所在區
	int total_order;//今日已安排單量 
}
