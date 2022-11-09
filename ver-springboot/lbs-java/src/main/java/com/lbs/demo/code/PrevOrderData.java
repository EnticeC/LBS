package com.lbs.demo.code;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode 
public class PrevOrderData implements Serializable { //舊單重排
	String company;// 公司
    String type;// 服務
    String order_ID;// 工作單編號
    String customer_ID;// 客戶編號
    String name;//客戶名稱
    String staff;// 服務人員
    String current_staff; //現在服務人員
}
