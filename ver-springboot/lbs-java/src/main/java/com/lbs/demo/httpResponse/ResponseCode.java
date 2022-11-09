package com.lbs.demo.httpResponse;

/**
 * 返回状态码
 *
 */
public enum ResponseCode {
    /**
     * 成功返回的状态码
     */
    SUCCESS(200, "success"),
    /**
     * 资源读取失败的状态码
     */
    RESOURCES_NOT_FOUND(10001, "數據讀取失敗"),
    /**
     * 所有无法识别的异常默认的返回状态码
     */
    SERVICE_ERROR(50000, "算法運行失敗");
    
    /**
     * 状态码
     */
    private int code;
    /**
     * 返回信息
     */
    private String msg;

    ResponseCode(int code, String msg) {
        this.code = code;
        this.msg = msg;
    }

    public int getCode() {
        return code;
    }

    public String getMsg() {
        return msg;
    }
}
