package com.lbs.demo.httpResponse;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * 统一的公共响应体
 */
@Data
@AllArgsConstructor
public class ResponseResult implements Serializable {
    /**
     * 返回状态码
     */
    private Integer code;
    /**
     * 返回信息
     */
    private String msg;
    /**
     * 数据
     */
    private Object data;
}
