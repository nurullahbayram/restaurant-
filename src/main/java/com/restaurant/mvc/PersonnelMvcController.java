package com.restaurant.mvc;

import com.restaurant.authorization.ViewResolver;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class PersonnelMvcController {
    //  http://localhost:9090/user
    @GetMapping("/personnel")
    public String userPage(){

        return ViewResolver.getRequestedView("personnel");

    }
}
