package com.example.application.model;

import java.util.HashMap;
import java.util.Map;

public class fileInfo {
    private String bpmnModeler;
    public String name;
    public long size;
    public boolean isValid;
    public boolean isDuplicated;
    public String isEnglish;
    public Map<String, Boolean> guidelineMap;
    public String modelType;
    public Map<String, Integer> elementMap;
    public String errorLog;


    public fileInfo(String name, String bpmnModeler,long size, boolean isValid, boolean isDuplicated,String modelType, String isEnglish, String errorLog) {
        this.name = name;
        this.size = size;
        this.bpmnModeler = bpmnModeler;
        this.isValid = isValid;
        this.isDuplicated = isDuplicated;
        this.modelType = modelType;
        this.isEnglish = isEnglish;
        this.errorLog = errorLog;
    }

    public fileInfo(String name,String bpmnModeler,long size, boolean isValid, boolean isDuplicated,String modelType, String isEnglish, Map<String, Integer> elementMap, Map<String, Boolean> guidelineMap, String errorLog) {
        this.name = name;
        this.size = size;
        this.bpmnModeler = bpmnModeler;
        this.isValid = isValid;
        this.isDuplicated = isDuplicated;
        this.modelType = modelType;
        this.isEnglish = isEnglish;
        this.elementMap = elementMap;
        this.guidelineMap = guidelineMap;
        this.errorLog = errorLog;
    }


    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getbpmnModeler() {
        return bpmnModeler;
    }

    public void setbpmnModeler(String bpmnModeler) {
        this.bpmnModeler = bpmnModeler;
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

    public String geterrorLog() {
        return errorLog;
    }

    public void seterrorLog(String errorLog) {this.errorLog = errorLog;}

}
