package com.example.application.controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.io.File;
import java.io.FileOutputStream;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;


@RestController
public class UploadController {

    //Save the uploaded file to this folder
    private static String UPLOADED_FOLDER = "src/main/resources/bpmnModels/";

    @PostMapping("/upload") // //new annotation since 4.3
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
            return "You uploaded a .zip file. All the .bpmn files have been extracted.";
        }
        return "File uploaded successfully";
    }

    private String getFileExtension(String fileName) {
        int dotIndex = fileName.lastIndexOf('.');
        return (dotIndex == -1) ? "" : fileName.substring(dotIndex + 1);
    }

}