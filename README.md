# BPMN Inspector

<p align="center">
<img src="frontend/img/logo.png" width="300px" height="150px"/>
</p>

<p align="center">
  <img src="https://img.shields.io/npm/v/@hilla/frontend.svg" alt="Latest Stable Version">
  <a href="https://github.com/vaadin/hilla/releases"><img src="https://img.shields.io/maven-metadata/v?metadataUrl=https%3A%2F%2Frepo1.maven.org%2Fmaven2%2Fdev%2Fhilla%2Fhilla%2Fmaven-metadata.xml" alt="Releases"></a>  
  <img src="https://img.shields.io/badge/build-passing-brightgreen" alt="Build Status">
  <img src="https://img.shields.io/badge/version-1.0-green" alt="Version">
</p>

BPMN Inspector is a Java tool for statistical and qualitative analysis of a BPMN model collection. BPMN Inspector comes in the form of a web application that provides a user interface for inspecting several features of a model's collection.

# Table of contents
<!--ts-->
   * [Functionalities](#functionalities)
   * [How to run](#how-to-run)
   * [Technical Information](#technical-information)
   * [References](#references)
<!--te-->

# Functionalities

BPMN Inspector is made available through a RESTful web application that allows users to upload a set of BPMN models, optionally pre-filter them, and then explore their features by performing a set of quantitative and qualitative analyses. 

## Models Upload & Filtering

The BPMN models file can be uploaded in formats such as *.bpmn*, *.xml*, or a *.zip*. In the case of *.zip* format, the contents are extracted, and the extensions are examined to discard any types of file that do not conform to the *.bpmn* or *.xml* formats. After the uploading phase, is shown a preview page of the list of each model belonging to the collection. Each model presents a set of general information such as name, model type (Process Collaboration, Choreography, or Conversation), whether the model is valid, whether it is already in the list (duplicated), whether the label's model is in the English language and the file size. In this preview window, it is possible to filter the models and download them into a .zip file, or inspect the collection by optionally applying some filters. The collection can be filtered considering both or one of two aspects: model features or model type. Considering the model's features, they can be filtered by: (i) deleting duplicate models; (ii) deleting syntactically invalid models; and (iii) deleting models whose labels are in a language different than English. Regarding the model's type, they can be filtered by considering Process Collaboration, Choreography, and Conversation models differently.

<p align="center">
<img src="frontend/img/readme-img/preview.png" width="1000px" height="480px"/>
</p>

## Model Collection Analysis

This is the main phase of the application and consists of a set of analyses that are performed on the collection of BPMN models previously uploaded.
The inspection process involves four main analyses: 
- [BPMN Element Usage](#bpmn-element-usage);
- [BPMN Element Combined Usage](#bpmn-element-combined-usage);
- [BPMN Syntactic Validation](#bpmn-syntactic-validation);
- [BPMN Good Modeling Practices](#bpmn-good-modeling-practices).

### BPMN Element Usage

This analysis focuses on the syntactic dimension of BPMN, investigating the usage of BPMN elements in the collection of models uploaded. Each model belonging to the collection is analyzed and all elements of the notation it contains are counted, generating a *.csv* report containing this information.
The analysis of the report allows for a dynamic generation of graphs. The first is generated by extracting the model size, i.e., the total number of elements used to design each model. Then, is generated the 
practical complexity graph, which refers to the number of different types of elements used for designing a model. Finally, two additional graphs are generated: the former for the number of occurrences of each element of the notation, and the latter for the distribution of BPMN elements i.e., the total number of models containing a specific element.

<p align="center">
<img src="frontend/img/readme-img/analysis.png" width="1000px" height="480px"/>
</p>

### BPMN Element Combined Usage

This analysis aims to detect possible relations between BPMN elements. <b>BPMN Inspector</b> analyzes pairs and then groups of BPMN elements to find those most frequently used.
To gather information about possible combinations, the tool relies on a Python script that calculates the Pearson correlation coefficient <b>ρ</b> between each pair of elements. For each pair, the script evaluates a correlation index from -1 to 1, where 0 is no correlation, 1 corresponds to elements designed always together, and −1 to  alternatively used elements.
Then the tool targeted groups of elements. It starts with the pair of elements that are mostly used in combination and then proceeds by adding the element most frequently used with that combination, and so on. The tool then automatically generates sets of elements and calculates the percentage of occurrence in the model collection. In addition, to represent these combinations, a funnel graph is automatically generated. Finally, two reports are generated: one with the confusion matrix containing the Pearson coefficient values of each pair of elements, and the second one containing the percentage values of the most used sets of elements in the collection.

<p align="center">
<img src="frontend/img/readme-img/combinedUse.png" width="1000px" height="480px"/>
</p>

### BPMN Syntactic Validation 

This analysis focuses on handling the syntactic violations that can occur in the BPMN models. To check whether the collected models include syntactic errors, BPMN Inspector compares each model with the [standard BPMN XML schema provided by the OMG group]({https://wiki.xmldation.com). To do such an analysis, we developed a BPMN schema validator. The validator analyzes the entire collection and detects whether a model is syntactically valid or not. It generates a *.csv* report containing the list of the models analyzed and if invalid, also an array of the errors related to the model. In the web application, is automatically generated a histogram chart displays the type of errors and their count, along with a table that includes the error code and a link to the XMLdation wiki site providing a detailed description of the error.

<p align="center">
<img src="frontend/img/readme-img/validation.png" width="1000px" height="480px"/>
</p>

### BPMN Good Modeling Practices 

Finally, the last analysis, investigates if the model's collection adheres to a set of established good modeling practices defined by this [work](https://www.sciencedirect.com/science/article/pii/S0169023X1630341X). To do that, BPMN inspector integrates a tool called [BEBoP](https://pros.unicam.it/bebop) (understandaBility vErifier for Business Process models). BEBoP is a tool that verifies the understandability of business process models, ensuring that they have been designed according to established good modeling practices. It automatically checks whether a model adheres to these practices. <b>BPMN Inspector</b> performs such an analysis for each model considering a set of forty good modeling practices and generates a *.csv* report containing boolean values to evaluate the model's adherence to each guideline.
In the web application, a radar graph is generated to indicate the violation of good modeling practices in terms of percentage, considering the total number of models in the collection.

<p align="center">
<img src="frontend/img/readme-img/guidelines.png" width="1000px" height="480px"/>
</p>

A video tutorial on its usage is available by clicking the following link:
**[*Tutorial*](https://youtube.com)**.

# How To Run

There are several ways to use BPMN Inspector:

- Using the web application available at the following link: **[*Try me!*](https://pros.unicam.it/bpmn-inspector/)**;
- Pulling the Docker image from [DockerHub](https://hub.docker.com/r/proslab/bpmn-inspector);
- Clone this repository and run the tool in local by executing the following comand:

```bash
\.mvnw
```
Once launched, the application will be available at [http://localhost:8080](http://localhost:8080).

- Creating the Docker image from the main folder of the project by executing the following comand:

```bash
docker build -t bpmn-inspector-image .
```
- Run the Docker container from the main folder of the project by executing the following comand:

```bash
docker run -p 8080:8080 bpmn-inspector
```
Once launched, the application will be available at [http://localhost:8080](http://localhost:8080).


# Technical Information

<p align="center">
<img src="frontend/img/readme-img/hilla-logo.svg" width="300px" height="150px"/>
</p>

BPMN Inspector was developed using [Hilla](https://hilla.dev/), an open source framework that integrates a <b>Spring Boot Java backend</b> with a reactive TypeScript frontend, which in this tool is <b>React</b>.

<p align="center">
  <img src="frontend/img/readme-img/spring-boot.png" width="300px" height="150px" />
  <img src="frontend/img/readme-img/plus.png" width="70px" height="75px" style="margin-bottom: 20px;" />
  <img src="frontend/img/readme-img/react.png" width="300px" height="150px" />
</p>

## Prerequisites

- [Node](https://nodejs.org/en) 16.14 or later;
- [JDK](https://www.oracle.com/be/java/technologies/downloads/#java17) 17 or later;
- [Python](https://www.python.org/downloads/) 3.9.X or higher.


# References

To refers to BPMN Inspector you can cite the following research paper on which the tool was adopted:

- Compagnucci, I., Corradini, F., Fornari, F., & Re, B. (2023). A Study on the Usage of the BPMN Notation for Designing Process Collaboration, Choreography, and Conversation Models. In Business & Information Systems Engineering on the special issue "The Impact of the Business Process Model and Notation."

- Compagnucci, I., Corradini, F., Fornari, F., & Re, B. (2021). Trends on the Usage of BPMN 2.0 from Publicly Available Repositories. In International Conference on Perspectives in Business Informatics Research, LNBIP (Vol. 430, pp. 84–99). Springer.

# License

BPMN Inspector is under the [MIT](https://github.com/BPMN-Inspector/blob/master/LICENSE) license.
