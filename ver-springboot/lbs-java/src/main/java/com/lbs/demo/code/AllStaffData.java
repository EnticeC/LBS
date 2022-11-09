package com.lbs.demo.code;

import java.io.Serializable;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode 
public class AllStaffData implements Serializable {
    String ID; //員工編號
	List<ScheduledOrder> data_list;
    List<STIScheduledOrder> sti_data_list;
}