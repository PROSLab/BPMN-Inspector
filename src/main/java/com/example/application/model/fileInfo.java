package com.example.application.model;

import java.util.Map;

public class fileInfo {
    public String name;
    public long size;
    public boolean isValid;
    public boolean isDuplicated;
    public String modelType;
    public Map<String, Integer> elementMap;


    public fileInfo(String name, long size, boolean isValid, boolean isDuplicated,String modelType) {
        this.name = name;
        this.size = size;
        this.isValid = isValid;
        this.isDuplicated = isDuplicated;
        this.modelType = modelType;
    }

    public fileInfo(String name, long size, boolean isValid, boolean isDuplicated,String modelType, Map<String, Integer> elementMap) {
        this.name = name;
        this.size = size;
        this.isValid = isValid;
        this.isDuplicated = isDuplicated;
        this.modelType = modelType;
        this.elementMap = elementMap;
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

    public Map<String, Integer> getElementMap() {
        return elementMap;
    }

    public void setElementMap(Map<String, Integer> elementMap) {
        this.elementMap = elementMap;
    }

}
