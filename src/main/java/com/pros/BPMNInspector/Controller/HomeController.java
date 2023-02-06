package com.pros.BPMNInspector.Controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class HomeController {
    @RequestMapping("/")
public String index() {
        return "index";
    }

    @RequestMapping("/demo")
    @ResponseBody // This means to get the result of the method "index()" directly
    public String demo() {
        return "hello";
    }
}
