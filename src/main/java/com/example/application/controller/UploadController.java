package com.example.application.controller;
import com.example.application.model.fileInfo;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.xml.sax.SAXException;

import javax.xml.XMLConstants;
import javax.xml.transform.Source;
import javax.xml.transform.stream.StreamSource;
import javax.xml.validation.Schema;
import javax.xml.validation.SchemaFactory;
import javax.xml.validation.Validator;
import java.io.*;
import java.util.ArrayList;
import java.util.List;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;


@RestController
public class UploadController {

    //Save the uploaded file to this folder
    private static String UPLOADED_FOLDER = "src/main/resources/bpmnModels/";
    @GetMapping("/files")
    public List<fileInfo> getFiles() throws IOException {

        List<fileInfo> fileInfos = new ArrayList<>();
        Files.list(Paths.get(UPLOADED_FOLDER)).forEach(path -> {
            File file = path.toFile();
            boolean isValid;
            try {
                 isValid = validateFile(file);
                System.out.println("entro");
            } catch (SAXException e) {
                 isValid = false;
                throw new RuntimeException(e);
            }
            fileInfos.add(new fileInfo(file.getName(), file.length(), isValid));
        });
        return fileInfos;
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
        File bpmnDir = new File("C:\\Users\\User\\Desktop\\zipinspe\\BPMN-Inspector\\src\\main\\resources\\bpmnModels");

        // Directory contenente i file XSD dello schema BPMN
        File xsdDir = new File("C:\\Users\\User\\Desktop\\zipinspe\\BPMN-Inspector\\src\\main\\resources\\static\\schema");

        // File di output per i risultati della convalida
        File outputFile = new File("C:\\Users\\User\\Desktop\\zipinspe\\BPMN-Inspector\\src\\main\\resources\\validationOutput\\validationOutput.csv");

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
        Path path = Paths.get("C:\\Users\\User\\Desktop\\zipinspe\\BPMN-Inspector\\src\\main\\resources\\validationOutput", fileName);
        Resource resource = new UrlResource(path.toUri());
        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"");
        return ResponseEntity.ok()
                .headers(headers)
                .contentLength(resource.getFile().length())
                .contentType(MediaType.parseMediaType("application/octet-stream"))
                .body(resource);
    }
}