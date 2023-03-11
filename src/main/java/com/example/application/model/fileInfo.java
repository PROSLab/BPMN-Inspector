package com.example.application.model;

public class fileInfo {
    private String name;
    private long size;
    private boolean isValid;
    private boolean isDuplicated;
    private String modelType;

    public fileInfo(String name, long size, boolean isValid, boolean isDuplicated,String modelType) {
        this.name = name;
        this.size = size;
        this.isValid = isValid;
        this.isDuplicated = isDuplicated;
        this.modelType = modelType;
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

    public boolean getisDuplicated() {
        return isDuplicated;
    }

    public void setisDuplicated(boolean isDuplicated) {this.isDuplicated = isDuplicated;}

    public String getModelType() {
        return modelType;
    }

    public void setModelType(String modelType) {this.modelType = modelType;}
}
