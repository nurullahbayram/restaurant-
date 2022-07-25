package com.restaurant.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value= HttpStatus.NOT_ACCEPTABLE)
public class NotAcceptableValue extends RuntimeException{

    public NotAcceptableValue() {
    }

    public NotAcceptableValue(String message) {
        super(message);
    }

    public NotAcceptableValue(Throwable cause) {
        super(cause);
    }
}
