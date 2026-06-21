package com.pivotseoul.global.util;

public final class Strings {

    private Strings() {
    }

    public static boolean isBlank(String s) {
        return s == null || s.isBlank();
    }
}
