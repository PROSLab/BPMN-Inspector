package com.example.application.controller;

import com.example.application.model.fileInfo;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

@RestController
public class FileController {

    private static final String FILES_PATH = "src/main/resources/bpmnModels"; // Path della cartella dei file

    @GetMapping("/files")
    public List<fileInfo> getFiles() throws IOException {

        List<fileInfo> fileInfos = new ArrayList<>();
        Files.list(Paths.get(FILES_PATH)).forEach(path -> {
            File file = path.toFile();
            fileInfos.add(new fileInfo(file.getName(), file.length()));
        });
        return fileInfos;
    }
}
