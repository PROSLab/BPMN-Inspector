package com.example.application.bpmncounter;
import java.io.*;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;
import javax.xml.XMLConstants;
import javax.xml.namespace.NamespaceContext;
import javax.xml.parsers.*;
import javax.xml.transform.Source;
import javax.xml.transform.stream.StreamSource;
import javax.xml.validation.Schema;
import javax.xml.validation.SchemaFactory;
import javax.xml.validation.Validator;
import javax.xml.xpath.*;

import com.example.application.model.fileInfo;
import org.bridj.util.Pair;
import org.javatuples.Triplet;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NamedNodeMap;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.InputSource;
import javax.swing.JFileChooser;
import org.springframework.stereotype.Controller;
import org.xml.sax.SAXException;

@Controller
public class bpmnCounter {

    @PostMapping("/inspection")
    public String bpmnInspection(@RequestParam("file") List<MultipartFile> files) {

        // Path per la cartella dei file BPMN
        Path sourceDir = Paths.get("./src/main/resources/bpmnModels");
        // Array per tenere traccia dei nomi dei file duplicati
        List<String> duplicateFileNames = new ArrayList<>();

        return

    }

    @GetMapping("/files")
    public List<fileInfo> getFiles() throws IOException {

        String UPLOADED_FOLDER = "src/main/resources/bpmnModels/";
        List<fileInfo> fileInfos = new ArrayList<>();
        List<String> validModelFiles = new ArrayList<>();

        Files.list(Paths.get(UPLOADED_FOLDER)).forEach(path -> {
            File file = path.toFile();
            boolean isValid;
            boolean isDuplicated;

            try {
                byte[] fileContent = Files.readAllBytes(file.toPath());
                isValid = validateFile(file);
                List<String> duplicates = getDuplicateFiles();

                if (duplicates.contains(file.getName())) {
                    isDuplicated = true;
                } else {
                    isDuplicated = false;// verifica se il file è duplicato
                }
                if (isValid) {
                    validModelFiles.add(file.getName());
                }
            } catch (SAXException | IOException e) {
                isValid = false;
                isDuplicated = false;
                throw new RuntimeException(e);
            }

            String modelType;

            try {
                modelType = extractModelType(file);
            } catch (SAXException e) {
                throw new RuntimeException(e);
            } catch (IOException | ParserConfigurationException e) {
                throw new RuntimeException(e);
            }

            fileInfos.add(new fileInfo(file.getName(), file.length(), isValid, isDuplicated, modelType));
            System.out.println(modelType);

        });

        return fileInfos;
    }

    private List<String> getDuplicateFiles() throws IOException {
        Path sourceDir = Paths.get("./src/main/resources/bpmnModels");
        // Array per tenere traccia dei nomi dei file duplicati
        List<String> duplicateFileNames = new ArrayList<>();

        // Mappa per tenere traccia dei nomi dei file già trovati
        Map<Long, Path> fileSizes = new HashMap<>();

        Files.walk(sourceDir)
                .filter(path -> !Files.isDirectory(path))
                .forEach(path -> {
                    try {
                        // Confronta i byte del file con quelli dei file già processati
                        byte[] fileContent = Files.readAllBytes(path);
                        Long fileSize = Files.size(path);

                        // Controlla se il file ha la stessa dimensione e lo stesso contenuto dei file già processati
                        if (!fileSizes.containsKey(fileSize) || !Arrays.equals(fileContent, Files.readAllBytes(fileSizes.get(fileSize)))) {
                            fileSizes.put(fileSize, path);
                        } else {
                            duplicateFileNames.add(path.getFileName().toString());
                            // Aggiungi la coppia chiave-valore alla mappa se il file non è duplicato
                        }

                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                });

        return duplicateFileNames;
    }

    private String extractModelType(File file) throws SAXException, IOException, ParserConfigurationException {
        // replace with the path to your .bpmn or .xml file
        String modelType = "Undefined";

        // check if the typeLanguage is BPMN
        File bpmnFile = new File(file.toURI());
        DocumentBuilderFactory dbFactory = DocumentBuilderFactory.newInstance();
        Document bpmnDoc = dbFactory.newDocumentBuilder().parse(bpmnFile);

        NodeList bpmnProcessNodes = bpmnDoc.getElementsByTagName("process");
        if (bpmnProcessNodes.getLength() > 0) {
            modelType = "Process";
        } else {
            NodeList bpmnCollaborationNodes = bpmnDoc.getElementsByTagName("collaboration");
            if (bpmnCollaborationNodes.getLength() > 0) {
                modelType = "Collaboration";
            } else {
                NodeList bpmnChoreographyNodes = bpmnDoc.getElementsByTagName("bpmn2:choreography");
                if (bpmnChoreographyNodes.getLength() > 0) {
                    modelType = "Choreography";
                } else {
                    NodeList bpmnConversationNodes = bpmnDoc.getElementsByTagName("bpmn2:conversation");
                    if (bpmnConversationNodes.getLength() > 0) {
                        modelType = "Conversation";
                    }
                }
            }
        }
        return modelType;
    }

    private boolean validateFile(File file) throws SAXException {

        // Directory contenente i file BPMN da convalidare
        File bpmnDir = new File("./src/main/resources/bpmnModels/");

        // Directory contenente i file XSD dello schema BPMN
        File xsdDir = new File("./src/main/resources/static/schema/");

        // File di output per i risultati della convalida
        File outputFile = new File("./src/main/resources/validationOutput/validationOutput.csv");

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
        schema = factory.newSchema(sources.toArray(new Source[0]));


        // Creazione del validator per la convalida dei file BPMN
        Validator validator = schema.newValidator();

        // Creazione del writer per l'output dei risultati della convalida

        boolean isValid = false;

        // Convalida del file BPMN

        try (BufferedWriter writer = new BufferedWriter(new FileWriter(outputFile))) {
            writer.write("ModelName,Validation,Exception\n");

            // Convalida dei file BPMN nella directory specificata
            for (File bpmnFile : bpmnDir.listFiles()) {
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
        }

        try {
            validator.validate(new StreamSource(file));
            isValid = true;
        } catch (SAXException e) {
            // Errore nella convalida del file BPMN
            isValid = false;
        } catch (IOException ex) {
            throw new RuntimeException(ex);
        }
        return isValid;
    }
}

