package com.example.application.controller;
import com.example.application.model.fileInfo;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.DocumentBuilder;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import java.util.*;
import javax.xml.XMLConstants;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.transform.Source;
import javax.xml.transform.stream.StreamSource;
import javax.xml.validation.Schema;
import javax.xml.validation.SchemaFactory;
import javax.xml.validation.Validator;
import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;
import java.util.zip.ZipOutputStream;

@RestController
public class UploadController {

    //Save the uploaded file to this folder
    private static String UPLOADED_FOLDER = "src/main/resources/bpmnModels/";
    private List<String> validModelFiles = new ArrayList<>();
    @GetMapping("/files")
    public List<fileInfo> getFiles() throws IOException {

        List<fileInfo> fileInfos = new ArrayList<>();

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
    @PostMapping("/upload")
    public String multipleFileUpload(@RequestParam("file") List<MultipartFile> files) {

        if (files.isEmpty()) {
            return "Please upload a file!";
        }

        for (MultipartFile file : files) {

            String fileExtension = getFileExtension(file.getOriginalFilename());

            if (!fileExtension.equals("xml") && !fileExtension.equals("bpmn") && !fileExtension.equals("zip")) {
                return "Please upload a valid file (.bpmn, .xml or .zip)";
            }

            try {
                // Check if the file is a zip file
                if (file.getOriginalFilename().endsWith(".zip")) {
                    // Extract the contents of the zip file
                    ZipInputStream zis = new ZipInputStream(file.getInputStream());
                    ZipEntry entry = zis.getNextEntry();
                    while (entry != null) {
                        String fileName = entry.getName();
                        File newFile = new File(UPLOADED_FOLDER + fileName);
                        if (!entry.isDirectory() && (fileName.endsWith(".bpmn") || fileName.endsWith(".xml"))) {
                            // Create directories for subdirectories in zip
                            new File(newFile.getParent()).mkdirs();
                            FileOutputStream fos = new FileOutputStream(newFile);
                            byte[] buffer = new byte[1024];
                            int len;
                            while ((len = zis.read(buffer)) > 0) {
                                fos.write(buffer, 0, len);
                            }
                            fos.close();
                        }
                        zis.closeEntry();
                        entry = zis.getNextEntry();
                    }
                    zis.close();

                     } else {

                    // Get the file and save it somewhere
                    byte[] bytes = file.getBytes();
                    Path path = Paths.get(UPLOADED_FOLDER + file.getOriginalFilename());
                    Files.write(path, bytes);
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        return "File uploaded successfully";
    }

    private String getFileExtension(String fileName) {
        int dotIndex = fileName.lastIndexOf('.');
        return (dotIndex == -1) ? "" : fileName.substring(dotIndex + 1);
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
                        NodeList bpmnConversationNodes = bpmnDoc.getElementsByTagName("conversation");
                        if (bpmnConversationNodes.getLength() > 0) {
                            modelType = "Conversation";
                        }
                    }
                }
            }
        return modelType;
    }

    @DeleteMapping("/deleteAllFiles")
    public String deleteAllFiles() throws IOException {
        File folder = new File(UPLOADED_FOLDER);
        File[] listOfFiles = folder.listFiles();

        for (File file : listOfFiles) {
            if (file.isFile()) {
                file.delete();
            }
        }
        return "All files deleted successfully";
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

    @GetMapping("/download-validation-report")
    public ResponseEntity<Resource> downloadValidationReport() throws IOException {
        String fileName = "validationOutput.csv";
        Path path = Paths.get("./src/main/resources/validationOutput", fileName);
        Resource resource = new UrlResource(path.toUri());
        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"");
        return ResponseEntity.ok()
                .headers(headers)
                .contentLength(resource.getFile().length())
                .contentType(MediaType.parseMediaType("application/octet-stream"))
                .body(resource);
    }

    @PostMapping("/download-filtered-models")
    public ResponseEntity<Resource> downloadFilteredModels(@RequestBody String[] filteringArray) throws IOException {
        if (filteringArray == null || filteringArray.length == 0) {

            Path sourceDir = Paths.get("./src/main/resources/bpmnModels");
            Path zipFilePath = sourceDir.getParent().resolve("bpmnModels.zip");
            String fileName = "bpmnModels.zip";
            // Crea lo stream di output per il file zip
            FileOutputStream fos = new FileOutputStream(zipFilePath.toFile());
            ZipOutputStream zipOut = new ZipOutputStream(fos);

            // Recupera la lista dei file nella cartella sorgente
            Files.walk(sourceDir)
                    .filter(path -> !Files.isDirectory(path))
                    .forEach(path -> {
                        try {
                            // Crea l'entry del file nel file zip
                            ZipEntry zipEntry = new ZipEntry(sourceDir.relativize(path).toString());
                            zipOut.putNextEntry(zipEntry);

                            // Scrive il contenuto del file nello stream di output del file zip
                            Files.copy(path, zipOut);

                            // Chiude l'entry del file
                            zipOut.closeEntry();
                        } catch (IOException e) {
                            e.printStackTrace();
                        }
                    });

            // Chiude lo stream di output del file zip e il file zip stesso
            zipOut.close();
            fos.close();

            Resource resource = new UrlResource(zipFilePath.toUri());
            HttpHeaders headers = new HttpHeaders();
            headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"");

            return ResponseEntity.ok()
                    .headers(headers)
                    .contentLength(resource.getFile().length())
                    .contentType(MediaType.parseMediaType("application/zip"))
                    .body(resource);

        } else if (filteringArray.length == 1) {
            if (filteringArray[0].equals("invalid")) {
                Path sourceDir = Paths.get("./src/main/resources/bpmnModels");
                Path zipFilePath = sourceDir.getParent().resolve("bpmnNoInvalids.zip");
                String fileName = "bpmnNoInvalids.zip";
                FileOutputStream fos = new FileOutputStream(zipFilePath.toFile());
                ZipOutputStream zipOut = new ZipOutputStream(fos);

                Files.walk(sourceDir)
                        .filter(path -> !Files.isDirectory(path))
                        .forEach(path -> {

                                if(validModelFiles.contains(path.getFileName().toString())) {
                                    try {
                                        // Crea l'entry del file nel file zip
                                        ZipEntry zipEntry = new ZipEntry(sourceDir.relativize(path).toString());
                                        zipOut.putNextEntry(zipEntry);

                                        // Scrive il contenuto del file nello stream di output del file zip
                                        Files.copy(path, zipOut);

                                        // Chiude l'entry del file
                                        zipOut.closeEntry();

                                    } catch (IOException e) {
                                        e.printStackTrace();
                                    }
                                }
                        });
                zipOut.close();
                fos.close();

                Resource resource = new UrlResource(zipFilePath.toUri());
                HttpHeaders headers = new HttpHeaders();
                headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"");

                return ResponseEntity.ok()
                        .headers(headers)
                        .contentLength(resource.getFile().length())
                        .contentType(MediaType.parseMediaType("application/zip"))
                        .body(resource);

            } else if (filteringArray[0].equals("duplicated")) {
                Path sourceDir = Paths.get("./src/main/resources/bpmnModels");
                Path zipFilePath = sourceDir.getParent().resolve("bpmnNoDuplicates.zip");
                String fileName = "bpmnNoDuplicates.zip";
                // Crea lo stream di output per il file zip
                FileOutputStream fos = new FileOutputStream(zipFilePath.toFile());
                ZipOutputStream zipOut = new ZipOutputStream(fos);

                // Mappa per tenere traccia dei nomi dei file già trovati
                Map<Long, Path> fileSizes = new HashMap<>();
                Files.walk(sourceDir)
                        .filter(path -> !Files.isDirectory(path))
                        .forEach(path -> {
                            try {
                                // Confronta i byte del file con quelli dei file già processati
                                byte[] fileContent = Files.readAllBytes(path);
                                Long fileSize = Files.size(path);
                                if (!fileSizes.containsKey(fileSize) || !Arrays.equals(fileContent, Files.readAllBytes(fileSizes.get(fileSize)))) {
                                    // Crea l'entry del file nel file zip se il contenuto è diverso dai file già processati
                                    ZipEntry zipEntry = new ZipEntry(sourceDir.relativize(path).toString());
                                    zipOut.putNextEntry(zipEntry);

                                    // Scrive il contenuto del file nello stream di output del file zip
                                    Files.copy(path, zipOut);

                                    // Aggiorna la mappa dei file già processati con il nuovo file
                                    fileSizes.put(fileSize, path);
                                }
                            } catch (IOException e) {
                                e.printStackTrace();
                            }
                        });

                // Chiude lo stream di output del file zip e il file zip stesso
                zipOut.close();
                fos.close();

                // Crea un resource dal file zip e restituisce un ResponseEntity per il download
                Resource resource = new UrlResource(zipFilePath.toUri());
                HttpHeaders headers = new HttpHeaders();
                headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"");

                return ResponseEntity.ok()
                        .headers(headers)
                        .contentLength(resource.getFile().length())
                        .contentType(MediaType.parseMediaType("application/zip"))
                        .body(resource);
            }
        } else if (filteringArray.length == 2) {
            if (Arrays.asList(filteringArray).contains("invalid") && Arrays.asList(filteringArray).contains("duplicated")) {
                Path sourceDir = Paths.get("./src/main/resources/bpmnModels");
                Path zipFilePath = sourceDir.getParent().resolve("bpmnNoInvalidsNoDuplicates.zip");
                String fileName = "bpmnNoDuplicatesNoInvalids.zip";
                // Crea lo stream di output per il file zip
                FileOutputStream fos = new FileOutputStream(zipFilePath.toFile());
                ZipOutputStream zipOut = new ZipOutputStream(fos);

                // Mappa per tenere traccia dei nomi dei file già trovati
                Map<Long, Path> fileSizes = new HashMap<>();
                Files.walk(sourceDir)
                        .filter(path -> !Files.isDirectory(path))
                        .forEach(path -> {
                            try {
                                if (validModelFiles.contains(path.getFileName().toString())) {
                                    // Confronta i byte del file con quelli dei file già processati
                                    byte[] fileContent = Files.readAllBytes(path);
                                    Long fileSize = Files.size(path);
                                    if (!fileSizes.containsKey(fileSize) || !Arrays.equals(fileContent, Files.readAllBytes(fileSizes.get(fileSize)))) {
                                        // Crea l'entry del file nel file zip se il contenuto è diverso dai file già processati
                                        ZipEntry zipEntry = new ZipEntry(sourceDir.relativize(path).toString());
                                        zipOut.putNextEntry(zipEntry);

                                        // Scrive il contenuto del file nello stream di output del file zip
                                        Files.copy(path, zipOut);

                                        // Aggiorna la mappa dei file già processati con il nuovo file
                                        fileSizes.put(fileSize, path);
                                    }
                                }
                            } catch (IOException e) {
                                e.printStackTrace();
                            }
                        });

                // Chiude lo stream di output del file zip e il file zip stesso
                zipOut.close();
                fos.close();

                // Crea un resource dal file zip e restituisce un ResponseEntity per il download
                Resource resource = new UrlResource(zipFilePath.toUri());
                HttpHeaders headers = new HttpHeaders();
                headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"bpmnNoDuplicatesNoInvalids.zip\"");

                return ResponseEntity.ok()
                        .headers(headers)
                        .contentLength(resource.getFile().length())
                        .contentType(MediaType.parseMediaType("application/zip"))
                        .body(resource);
            }
        }
        return null;
    }

    @PostMapping(value="/postProcessingView")
    public String processFilteredModels(@RequestBody String[] filteringArray, Model model) throws IOException {
        model.addAttribute("data", Arrays.asList(filteringArray));

        //Inspect models without invalid and duplicated
        if(filteringArray.length == 2){

        } else if (filteringArray.length == 1) {
            //Inspect models without invalids only
            if(filteringArray[0] == "invalid"){

            }
            //Inspect models without duplicates only
            else{

            }

        }
        //Inspect all models
        else{

        }
        return "postProcessingView";
    }

}