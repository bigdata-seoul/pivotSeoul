package com.pivotseoul.global.response;

public record ApiResponse<T>(boolean ok, T data, String message) {

    public static <T> ApiResponse<T> of(T data) {
        return new ApiResponse<>(true, data, null);
    }
}
