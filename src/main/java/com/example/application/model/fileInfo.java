package com.example.application.model;

import java.util.HashMap;
import java.util.Map;

public class fileInfo {
    public String name;
    public long size;
    public boolean isValid;
    public boolean isDuplicated;
    public String isEnglish;
    public String modelType;
    public Map<String, Integer> elementMap;

    public Map<String, Boolean> guidelineMap;


    public fileInfo(String name, long size, boolean isValid, boolean isDuplicated,String modelType, String isEnglish) {
        this.name = name;
        this.size = size;
        this.isValid = isValid;
        this.isDuplicated = isDuplicated;
        this.modelType = modelType;
        this.isEnglish = isEnglish;
    }

    public fileInfo(String name, long size, boolean isValid, boolean isDuplicated,String modelType, String isEnglish, Map<String, Integer> elementMap, Map<String, Boolean> guidelineMap) {
        this.name = name;
        this.size = size;
        this.isValid = isValid;
        this.isDuplicated = isDuplicated;
        this.modelType = modelType;
        this.isEnglish = isEnglish;
        this.elementMap = elementMap;
        this.guidelineMap = guidelineMap;
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

    public String getisEnglish() {
        return isEnglish;
    }

    public void setisEnglish(String isEnglish) {this.isEnglish = isEnglish;}

    public Map<String, Integer> getElementMap() {
        return elementMap;
    }

    public void setElementMap(Map<String, Integer> elementMap) {
        this.elementMap = elementMap;
    }

    public Map<String, Boolean> getGuidelineMap() {
        return guidelineMap;
    }

    public void setGuidelineMap(HashMap<String, Boolean> guidelineMap) {
        this.guidelineMap = guidelineMap;
    }

}
