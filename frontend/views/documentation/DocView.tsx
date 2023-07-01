import React from "react";
import ReactMarkdown from "react-markdown";
import logo from "../../img/logo.png";
import previewImg from "../../img/readme-img/preview.png";
import analysis1Img from "../../img/readme-img/preview.png";
import analysis2Img from "../../img/readme-img/combinedUse.png";
import analysis3Img from "../../img/readme-img/validation.png";
import analysis4Img from "../../img/readme-img/guidelines.png";
import hillaLogo from "../../img/readme-img/hilla-logo.svg";
import springBootLogo from "../../img/readme-img/spring-boot.png";
import reactLogo from "../../img/readme-img/react.png";
import plus from "../../img/readme-img/plus.png";
const ReadmePage: React.FC = () => {
    const scrollToElement = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <div>
            <p style={{ display: "flex", justifyContent: "center", marginTop: "50px" }}>
                <img src={logo} width="300px" height="150px" alt="Logo" />
            </p>

            <br />
            <p style={{ display: "flex", justifyContent: "center", marginTop: "-15px" }}>
                <a href="https://github.com/vaadin/hilla/releases">
                    <img src="https://img.shields.io/npm/v/@hilla/frontend.svg" alt="Latest Stable Version" />
                </a>
                <a href="https://github.com/vaadin/hilla/releases">
                    <img src="https://img.shields.io/maven-metadata/v?metadataUrl=https%3A%2F%2Frepo1.maven.org%2Fmaven2%2Fdev%2Fhilla%2Fhilla%2Fmaven-metadata.xml" alt="Releases" />
                </a>
                <a href="https://github.com/vaadin/hilla/releases">
                    <img src="https://img.shields.io/badge/build-passing-brightgreen" alt="Build Status" />
                </a>
                <a href="https://github.com/vaadin/hilla/releases">
                    <img src="https://img.shields.io/badge/version-1.0-green" alt="Version" />
                </a>
            </p>

            <div style={{ padding: "15px" }}>
                <a style={{ marginTop: "45px" }}>
                    BPMN Inspector is a Java tool for the analysis of a BPMN model collection. BPMN Inspector comes in the form of a web application that provides a user interface for inspecting several features of a model's collection.
                </a>

                <h2>Table of contents</h2>
                <ul>
                    <li>
                        <a style={{color: "#005fdb", cursor: "pointer"}} onClick={() => scrollToElement("functionalities")}>Functionalities ⚙</a>
                    </li>
                    <li>
                        <a style={{color: "#005fdb", cursor: "pointer"}} onClick={() => scrollToElement("how-to-run")}>How to run 🚀</a>
                    </li>
                    <li>
                        <a style={{color: "#005fdb", cursor: "pointer"}} onClick={() => scrollToElement("technical-information")}>Technical Information 🔧</a>
                    </li>
                    <li>
                        <a style={{color: "#005fdb", cursor: "pointer"}} onClick={() => scrollToElement("references")}>References
                            📑</a>
                    </li>
                </ul>

                <h2 id="functionalities">Functionalities ⚙</h2>

                <p>
                    BPMN Inspector is made available through a RESTful web application that allows users to upload a set of BPMN models, optionally pre-filter them, and then explore their features by performing a set of quantitative and qualitative analyses.
                </p>

                <h3>Models Upload & Filtering</h3>

                <p>
                    The BPMN models file can be uploaded in formats such as *.bpmn*, *.xml*, or a *.zip*. In the case of *.zip* format, the contents are extracted, and the extensions are examined to discard any types of file that do not conform to the *.bpmn* or *.xml* formats.
                    After the uploading phase, is shown a preview page of the list of each model belonging to the collection. Each model presents a set of general information such as
                    name, model type (Process Collaboration, Choreography, or Conversation), whether the model is valid, whether it is already in the list (duplicated), whether the label's model is in the English language and the file size.
                    In this preview window, it is possible to filter the models and download them into a .zip file, or inspect the collection by optionally applying some filters. The collection can be filtered considering both or one of two aspects: model features or model type. Considering the model's features, they can be filtered by: (i) deleting duplicate models; (ii) deleting syntactically invalid models; and (iii) deleting models whose labels are in a language different than English. Regarding the model's type, they can be filtered by considering Process Collaboration, Choreography, and Conversation models differently.
                </p>

                <p style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}>
                    <img src={previewImg} width="75%" height="500px"/>
                </p>

                <h3>BPMN Collection Analysis</h3>

                <p>
                    This is the main phase of the application and consists of a set of analyses that are performed on the collection of BPMN models previously uploaded.
                    The inspection process involves four main analyses: 1.BPMN Element Usage, 2.BPMN Element Combined Usage, 3.BPMN Syntactic Validation, 4.BPMN Good Modeling Practices.
                </p>

                <h4>1.BPMN Element Usage</h4>

                <p>
                    This analysis focuses on the syntactic dimension of BPMN, investigating the usage of BPMN elements in the collection of models uploaded. Each model belonging to the collection is analyzed and all elements of the notation it contains are counted, generating a *.csv* report containing this information.
                    The analysis of the report allows for a dynamic generation of graphs. The first is generated by extracting the model size, i.e., the total number of elements used to design each model. Then, is generated the
                    practical complexity graph, which refers to the number of different types of elements used for designing a model. Finally, two additional graphs are generated: the former for the number of occurrences of each element of the notation, and the latter for the distribution of BPMN elements i.e., the total number of models containing a specific element.     </p>

                <p style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}>
                    <img src={analysis1Img} width="75%" height="500px"/>
                </p>

                <h4>2.BPMN Element Combined Usage</h4>

                <p>
                    This analysis aims to detect possible relations between BPMN elements. <b>BPMN Inspector</b> analyzes pairs and then groups of BPMN elements to find those most frequently used.
                    To gather information about possible combinations, the tool relies on a Python script that calculates the Pearson correlation coefficient <b>ρ</b> between each pair of elements. For each pair, the script evaluates a correlation index from -1 to 1, where 0 is no correlation, 1 corresponds to elements designed always together, and −1 to  alternatively used elements.
                    Then the tool targeted groups of elements. It starts with the pair of elements that are mostly used in combination and then proceeds by adding the element most frequently used with that combination, and so on. The tool then automatically generates sets of elements and calculates the percentage of occurrence in the model collection. In addition, to represent these combinations, a funnel graph is automatically generated. Finally, two reports are generated: one with the confusion matrix containing the Pearson coefficient values of each pair of elements, and the second one containing the percentage values of the most used sets of elements in the collection.
                </p>

                <p style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}>
                    <img src={analysis2Img} width="75%" height="500px"/>
                </p>

                <h4>3.BPMN Syntactic Validation</h4>

                <p>
                    This analysis focuses on handling the syntactic violations that can occur in the BPMN models. To check whether the collected models include syntactic errors, BPMN Inspector compares each model with the <a href="https://wiki.xmldation.com">standard BPMN XML schema provided by the OMG group</a>. To do such an analysis, we developed a BPMN schema validator. The validator analyzes the entire collection and detects whether a model is syntactically valid or not. It generates a *.csv* report containing the list of the models analyzed and if invalid, also an array of the errors related to the model. In the web application, is automatically generated a histogram chart displays the type of errors and their count, along with a table that includes the error code and a link to the XMLdation wiki site providing a detailed description of the error.
                </p>

                <p style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}>
                    <img src={analysis3Img} width="75%" height="500px"/>
                </p>

                <h4>4.BPMN Element Usage</h4>

                <p>
                    Finally, the last analysis, investigates if the model's collection adheres to a set of established good modeling practices defined by this <a href={"https://www.sciencedirect.com/science/article/pii/S0169023X1630341X"}>work</a>. To do that, BPMN inspector integrates a tool called [BEBoP](https://pros.unicam.it/bebop) (understandaBility vErifier for Business Process models). BEBoP is a tool that verifies the understandability of business process models, ensuring that they have been designed according to established good modeling practices. It automatically checks whether a model adheres to these practices. <b>BPMN Inspector</b> performs such an analysis for each model considering a set of forty good modeling practices and generates a *.csv* report containing boolean values to evaluate the model's adherence to each guideline.
                    In the web application, a radar graph is generated to indicate the violation of good modeling practices in terms of percentage, considering the total number of models in the collection.
                </p>
                <p style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}>
                    <img src={analysis4Img} width="75%" height="500px"/>
                </p>

                <p>
                    A video tutorial on its usage is available by clicking the following link: <a href={"https://www.youtube.com/watch?v=pLDZyC60oRY&ab_channel=PROSLab-PROcessesandServicesLab"}> Tutorial. </a>
                </p>

                <h2 id="how-to-run">How To Run 🚀</h2>

                <p>
                    Prerequisites:
                    <ul>
                        <li> <a href={"https://nodejs.org/en"}>Node</a> 16.14 or later</li>
                        <li> <a href={"https://www.oracle.com/java/technologies/javase/jdk19-archive-downloads.html"}>JDK</a> 19 or later</li> <i>Be sure that you have set the JAVA_HOME environment variable pointing to version 19 of the Java JDK</i>
                        <li> <a href={"https://www.python.org/downloads/"}>Python</a> 3.9.X or later</li>
                    </ul>
                </p>

                <p>
                    There are several ways to run BPMN Inspector:
                </p>

                <ul>
                    <li>
                        1. Clone this repository and run the tool locally by executing the following command:
                        <br />
                        <code>.\mvnw</code>
                        <br />
                        Once launched, the application will be available at <a href="http://localhost:8080">http://localhost:8080</a>.
                    </li>

                    <li>
                        2. Pulling the Docker image from <a href="https://hub.docker.com/r/proslab/bpmn-inspector">DockerHub</a>
                    </li>

                    <li>
                        Generate the .jar file for building the image by executing the following command:
                        <br />
                        <code>mvn clean package -Pproduction</code>
                    </li>

                    <li>
                        Creating the Docker image from the main folder of the project by executing the following command:
                        <br />
                        <code>docker build -t bpmn-inspector-image .</code>
                    </li>
                    <li>
                        Run the Docker container from the main folder of the project by executing the following command:
                        <br />
                        <code>docker run -p 8080:8080 bpmn-inspector</code>
                        <br />
                        Once launched, the application will be available at <a href="http://localhost:8080">http://localhost:8080</a>.
                    </li>

                    <li>
                        3. Import the project into an IDE and run the class "Application.java"
                    </li>
                </ul>



            <h2 id="technical-information">Technical Information 🔧</h2>

            <p style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}>
                <img src={hillaLogo} width="300px" height="150px" alt="Hilla Logo" />
            </p>

            <p>
                BPMN Inspector was developed using <a href="https://hilla.dev/">Hilla</a>, an open source framework that integrates a <b>Spring Boot Java backend</b> with a reactive TypeScript frontend, which in this tool is <b>React</b>.
            </p>

            <p style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}>
                <img src={springBootLogo} width="300px" height="150px" alt="Spring Boot Logo" />
                <img src={reactLogo} width="300px" height="150px" alt="React Logo" />
            </p>

            <p>
                For the generation of the .jar file:
            </p>

            <code>mvn clean package -Pproduction</code>

            <h2 id="references">References 📑</h2>

            <p>
                To refer to BPMN Inspector, you can cite the following research papers on which the tool was adopted:
            </p>

            <ul>
                <li>
                    Compagnucci, I., Corradini, F., Fornari, F., & Re, B. (2023). A Study on the Usage of the BPMN Notation for Designing Process Collaboration, Choreography, and Conversation Models. In Business & Information Systems Engineering on the special issue "The Impact of the Business Process Model and Notation."
                </li>
                <li>
                    Compagnucci, I., Corradini, F., Fornari, F., & Re, B. (2021). Trends on the Usage of BPMN 2.0 from Publicly Available Repositories. In International Conference on Perspectives in Business Informatics Research, LNBIP (Vol. 430, pp. 84–99). Springer.
                </li>
            </ul>

            <h2>License</h2>

            <p>
                BPMN Inspector is under the <a href="https://github.com/PROSLab/BPMN-Inspector/blob/master/LICENSE.md">MIT</a> license.
            </p>
            </div>
        </div>
    );
};

export default ReadmePage;
