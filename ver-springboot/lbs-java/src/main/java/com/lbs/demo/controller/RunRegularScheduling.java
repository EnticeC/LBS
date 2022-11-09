package com.lbs.demo.controller;

import java.util.Map;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;


@RestController
public class RunRegularScheduling {
    @PostMapping("/runRegularScheduling")
    public String RunRegular(@RequestBody Map map) {
        return "ok";
    }
}