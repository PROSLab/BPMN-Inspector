package com.example.application.model;

public class fileInfo {
    private String name;
    private long size;

    private boolean isValid;

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

    public void setSize(boolean isValid) {
        this.isValid = isValid;
    }

    public boolean getisValid() {
        return isValid;
    }

    public void setisValid(boolean isValid) {
        this.isValid = isValid;
    }
}
