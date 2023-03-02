package com.example.application.validator;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import javax.xml.XMLConstants;
import javax.xml.transform.Source;
import javax.xml.transform.stream.StreamSource;
import javax.xml.validation.Schema;
import javax.xml.validation.SchemaFactory;
import javax.xml.validation.Validator;

import org.xml.sax.SAXException;

public class bpmnValidator {
    public static void main(String[] args) {
        // Directory contenente i file BPMN da convalidare
        File bpmnDir = new File("../resources/bpmnModels");

        // Directory contenente i file XSD dello schema BPMN
        File xsdDir = new File("../resources/static/schema");

        // File di output per i risultati della convalida
        File outputFile = new File("../resources/validationOutput/validationOutput.csv");

        // Elenco dei file XSD dello schema BPMN
        File[] xsdFiles = xsdDir.listFiles();

        // Creazione del factory per la convalida dello schema
        SchemaFactory factory = SchemaFactory.newInstance(XMLConstants.W3C_XML_SCHEMA_NS_URI);

        // Creazione del set di schemi da utilizzare per la convalida
        ArrayList<Source> sources = new ArrayList<>();
        for (File xsdFile : xsdFiles) {
            sources.add(new StreamSource(xsdFile));
        }

        // Creazione dello schema da utilizzare per la convalida
        Schema schema;
        try {
            schema = factory.newSchema(sources.toArray(new Source[0]));
        } catch (SAXException e) {
            // Errore nella creazione dello schema
            System.err.println("Errore nella creazione dello schema: " + e.getMessage());
            return;
        }

        // Creazione del validator per la convalida dei file BPMN
        Validator validator = schema.newValidator();

        // Creazione del writer per l'output dei risultati della convalida
        try (BufferedWriter writer = new BufferedWriter(new FileWriter(outputFile))) {
            writer.write("ModelName,Validation,Exception\n");

            // Convalida dei file BPMN nella directory specificata
            for (File bpmnFile : bpmnDir.listFiles()) {
                if (!bpmnFile.getName().endsWith(".bpmn")) {
                    // Il file non ha estensione .bpmn, lo ignoriamo
                    continue;
                }

                // Convalida del file BPMN
                try {
                    validator.validate(new StreamSource(bpmnFile));
                    writer.write(bpmnFile.getName() + ",valid,\n");
                } catch (SAXException e) {
                    // Errore nella convalida del file BPMN
                    writer.write(bpmnFile.getName() + ",invalid," + e.getMessage() + "\n");
                }
            }
        } catch (IOException e) {
            // Errore nell'apertura del file di output
            System.err.println("Errore nell'apertura del file di output: " + e.getMessage());
            return;
        }
    }
}