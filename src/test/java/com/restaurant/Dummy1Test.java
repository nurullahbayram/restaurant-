package com.restaurant;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

public class Dummy1Test {

    @Test
    public void dummyTestForBoolean(){

        boolean b = true;
        assertTrue( b);

    }

    @Test
    public void dummyTestForInteger(){

        Integer i = 9;
        assertEquals( 9, i);

    }

    @Test
    public void dummyTestForString(){

        String s = "Hello";
        assertEquals( "Hello",s);

    }

    @Test
    public void dummyTestForFloat(){

        float f = 0.5F;
        assertEquals( 0.5f,f);

    }

    @Test
    public void dummyTestForSum(){

        int i1 = 2;
        int i2 = 4;

        assertEquals( 6,i1 + i2);

    }

}
