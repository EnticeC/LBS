package com.lbs.demo.httpResponse;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serializable;

import com.google.gson.JsonArray;

/**
 * 输出类
 */
@Data
@EqualsAndHashCode
public class OutputJson implements Serializable {

    private String type;

    private JsonArray jsonData;
    
}
