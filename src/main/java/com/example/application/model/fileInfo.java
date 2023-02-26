package com.example.application.model;

import com.example.application.controller.FileController;

public class fileInfo extends FileController {
    private String name;
    private long size;

    public fileInfo(String name, long size) {
        this.name = name;
        this.size = size;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public long getSize() {
        return size;
    }

    public void setSize(long size) {
        this.size = size;
    }
}
