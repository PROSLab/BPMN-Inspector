package com.example.application.BEBoP.src.main.java.eu.learnpad.verification.rest.impl;

import com.example.application.BEBoP.src.main.java.eu.learnpad.verification.plugin.bpmn.guideline.factory.GuidelinesFactory;
import com.example.application.BEBoP.src.main.java.eu.learnpad.verification.plugin.bpmn.guideline.impl.abstractGuideline;
import com.example.application.BEBoP.src.main.java.eu.learnpad.verification.plugin.bpmn.reader.MyBPMN2ModelReader;
import com.example.application.BEBoP.src.main.java.eu.learnpad.verification.plugin.utils.XMLUtils;

import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.IOException;
import java.util.Collection;
import java.util.Locale;

public class main {

    public static void main(String[] args) throws IOException {
        // TODO Auto-generated method stub
        String guidelinesResult ="";
        String modelxml="<?xml version=\"1.0\" encoding=\"UTF-8\"?> <bpmn:definitions xmlns:bpmn=\"http://www.omg.org/spec/BPMN/20100524/MODEL\" xmlns:bpmndi=\"http://www.omg.org/spec/BPMN/20100524/DI\" xmlns:dc=\"http://www.omg.org/spec/DD/20100524/DC\" xmlns:di=\"http://www.omg.org/spec/DD/20100524/DI\" id=\"Definitions_0xx5znw\" targetNamespace=\"http://bpmn.io/schema/bpmn\" exporter=\"Camunda Modeler\" exporterVersion=\"3.7.2\"><bpmn:process id=\"Process_0pxxa23\" isExecutable=\"true\">\n" +
                "    <bpmn:startEvent id=\"StartEvent_1\">\n" +
                "      <bpmn:outgoing>Flow_0wn0brk</bpmn:outgoing>\n" +
                "    </bpmn:startEvent>\n" +
                "    <bpmn:task id=\"Activity_1w70wtk\" name=\"Task1\">\n" +
                "      <bpmn:incoming>Flow_0wn0brk</bpmn:incoming>\n" +
                "      <bpmn:outgoing>Flow_1h3z70q</bpmn:outgoing>\n" +
                "    </bpmn:task>\n" +
                "    <bpmn:sequenceFlow id=\"Flow_0wn0brk\" sourceRef=\"StartEvent_1\" targetRef=\"Activity_1w70wtk\" />\n" +
                "    <bpmn:endEvent id=\"Event_05lnjpa\">\n" +
                "      <bpmn:incoming>Flow_1h3z70q</bpmn:incoming>\n" +
                "    </bpmn:endEvent>\n" +
                "    <bpmn:sequenceFlow id=\"Flow_1h3z70q\" sourceRef=\"Activity_1w70wtk\" targetRef=\"Event_05lnjpa\" />\n" +
                "  </bpmn:process>\n" +
                "  <bpmndi:BPMNDiagram id=\"BPMNDiagram_1\">\n" +
                "    <bpmndi:BPMNPlane id=\"BPMNPlane_1\" bpmnElement=\"Process_0pxxa23\">\n" +
                "      <bpmndi:BPMNEdge id=\"Flow_0wn0brk_di\" bpmnElement=\"Flow_0wn0brk\">\n" +
                "        <di:waypoint x=\"215\" y=\"117\" />\n" +
                "        <di:waypoint x=\"270\" y=\"117\" />\n" +
                "      </bpmndi:BPMNEdge>\n" +
                "      <bpmndi:BPMNEdge id=\"Flow_1h3z70q_di\" bpmnElement=\"Flow_1h3z70q\">\n" +
                "        <di:waypoint x=\"370\" y=\"117\" />\n" +
                "        <di:waypoint x=\"432\" y=\"117\" />\n" +
                "      </bpmndi:BPMNEdge>\n" +
                "      <bpmndi:BPMNShape id=\"_BPMNShape_StartEvent_2\" bpmnElement=\"StartEvent_1\">\n" +
                "        <dc:Bounds x=\"179\" y=\"99\" width=\"36\" height=\"36\" />\n" +
                "      </bpmndi:BPMNShape>\n" +
                "      <bpmndi:BPMNShape id=\"Activity_1w70wtk_di\" bpmnElement=\"Activity_1w70wtk\">\n" +
                "        <dc:Bounds x=\"270\" y=\"77\" width=\"100\" height=\"80\" />\n" +
                "      </bpmndi:BPMNShape>\n" +
                "      <bpmndi:BPMNShape id=\"Event_05lnjpa_di\" bpmnElement=\"Event_05lnjpa\">\n" +
                "        <dc:Bounds x=\"432\" y=\"99\" width=\"36\" height=\"36\" />\n" +
                "      </bpmndi:BPMNShape>\n" +
                "    </bpmndi:BPMNPlane>\n" +
                "  </bpmndi:BPMNDiagram>\n" +
                "</bpmn:definitions>";

        MyBPMN2ModelReader readerBPMN = new MyBPMN2ModelReader();
        GuidelinesFactory eg = new GuidelinesFactory(readerBPMN.readStringModel(modelxml));
        eg.setVerificationType("UNDERSTANDABILITY");
        eg.StartThreadPool();

        Collection<abstractGuideline> guidelines = eg.getGuidelines();

        for (abstractGuideline s : guidelines) {
            guidelinesResult+=s.getStatus()+",";
            //System.out.print(s.getid()+",");
        }

        guidelinesResult+="\n";
        System.out.println("^^^^^^guidelinesResult: "+guidelinesResult);
        String filePath = "../guidelines.txt";

        try(FileWriter fw = new FileWriter(filePath, true);
            BufferedWriter writer = new BufferedWriter(fw);) {

            writer.write(guidelinesResult);

        } catch (IOException e) {
            throw new RuntimeException(e);
        }

    }

}