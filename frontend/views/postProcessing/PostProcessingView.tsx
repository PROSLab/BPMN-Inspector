import React, {ReactNode, useEffect, useRef, useState} from "react";
import axios from "axios";
import { useLocation } from 'react-router-dom';
import "./postCss.css";
import {toast} from "react-toastify";
import { Chart, registerables } from 'chart.js';
import '@vaadin/vaadin-lumo-styles/badge.js'
import {HiChevronDoubleUp, HiChevronDoubleDown, HiChevronUp, HiChevronDown} from "react-icons/hi";
import xmlLogo from "Frontend/img/xmlLogo.png"
// @ts-ignore
import ChartVenn from "Frontend/components/charts/ChartVenn";
import {BsDiagram2} from "react-icons/bs";
import {GiConfirmed} from "react-icons/gi";
import {AiFillExclamationCircle} from "react-icons/ai";
import {GrDocumentCsv, GrDocumentDownload} from "react-icons/gr";
import {Bar, Line, Radar} from "react-chartjs-2";
import { CiCircleQuestion } from "react-icons/ci";
import { FaRegImage } from "react-icons/fa";
import html2canvas from 'html2canvas';
import logo from "Frontend/img/logo.png";

interface filesInfoFiltered {
    name: string;
    size: number;
    isValid: boolean;
    isDuplicated: boolean;
    isEnglish: string;
    elementMap: Map<string, number>;
    guidelineMap: Map<string, string>;
    errorLog: string;
}

export default function PostProcessingView() {
    const [activeTab, setActiveTab] = useState('bpmn-element-usage');
    const [showTableEU, setShowTableEU] = useState(true);
    const [showTableED, setShowTableED] = useState(true);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const location = useLocation()
    const filteringArray: string[] = [];
    const {data} = location.state
    Chart.register(...registerables);

    const [filesInfo, setFilesInfo] = useState<Array<filesInfo>>([]);
    const [filesInfoFiltered, setFilesInfoFiltered] = useState<Array<filesInfoFiltered>>([]);
    const [showAllFiles, setShowAllFiles] = useState<boolean>(true);
    let displayButton = filesInfo.length > 1;
    let filesToDisplay = showAllFiles ? filesInfo : filesInfo.slice(0, 1);
    interface filesInfo {
        errorLog: string;
        modelType: string;
        name: string;
        size: number;
        isValid: boolean;
        isEnglish: string;
        isDuplicated: boolean;
        elementMap: Map<string, number>;
        guidelineMap: Map<string, string>;
    }
    const toggleTableEU = () => {
        setShowTableEU(!showTableEU);
    };

    const toggleTableED = () => {
        setShowTableED(!showTableED);
    };

    useEffect(() => {
        setIsLoading(true);
        axios({
            method: "post",
            url: "/files",
            data: data,
        }).then((response) => {
            setFilesInfo(response.data);
            setIsLoading(false);
        });
    }, [data]);


    console.log(filesInfo)

    async function deleteFiles() {
        try {
            await axios.delete('/deleteAllFiles');
            toast.success('Back to the Home Page!', {
                position: "bottom-left",
                autoClose: 1000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
            window.location.href = '/';
        } catch (error) {
            console.error(error);
        }
    }

    const {totalProcess,totalChoreography,totalConversation} = filesInfo.reduce((counts, file) => {
        if (file.modelType === "Process Collaboration") {
            counts.totalProcess++;
        }
        if (file.modelType === "Choreography") {
            counts.totalChoreography++;
        }
        if (file.modelType === "Conversation") {
            counts.totalConversation++;
        }
        return counts;
    }, { totalProcess: 0, totalChoreography: 0, totalConversation: 0});
    
    const totalDuplicated = filesInfo.reduce((counts, file) => {
        if (file.isDuplicated) {
            counts.totalDuplicated++;
        }
        return counts;
    }, { totalDuplicated: 0});

    const {valid, invalid} = filesInfo.reduce((counts, file) => {
        if (file.isValid) {
            counts.valid++;
        } else {
            counts.invalid++;
        }
        return counts;
    }, {valid: 0, invalid: 0});

        let total = filesInfo.length;

        if (data.includes("invalid") && data.includes("duplicated")) {
            total = total - (invalid + totalDuplicated.totalDuplicated);
        }
        else if (data.includes("duplicated") && !data.includes("invalid")) {
            total -= totalDuplicated.totalDuplicated;
        }
        else if (!data.includes("duplicated") && data.includes("invalid")) {
            total -= invalid;
        }

    const downloadFile = () => {
        axios({
            url: '/download-validation-report',
            method: 'GET',
            responseType: 'blob',
        }).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'validation_report.csv');
            document.body.appendChild(link);
            link.click();
        });
    };

    const downloadGMFile = () => {
        axios({
            url: '/download-goodemodeling-report',
            method: 'GET',
            responseType: 'blob',
        }).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'bpmn_guidelines.csv');
            document.body.appendChild(link);
            link.click();
        });
    };

    function calculateRho(files: filesInfo[]) {
        // @ts-ignore
        const elements = Object.values(filesInfo.elementMap);
        const rhoValues = [];
        const rhoArray = []; // array vuoto per i valori RHO
        const elementPairs = []; // array vuoto per le coppie di elementi

        // Itero su tutte le coppie di elementi
        for (let i = 0; i < elements.length - 1; i++) {
            for (let j = i + 1; j < elements.length; j++) {
                const elementA = elements[i];
                const elementB = elements[j];

                // Calcolo il coefficiente RHO tra gli elementi
                // @ts-ignore
                const intersection = elementA.incoming.filter(id => elementB.outgoing.includes(id)).length;
                // @ts-ignore
                const union = new Set([...elementA.incoming, ...elementB.outgoing]).size;
                const rho = intersection / union;

                // Aggiungo il valore di RHO all'array
                rhoValues.push(rho);
                rhoArray.push(rho); // aggiungi il valore RHO all'array rhoArray
                elementPairs.push([elementA, elementB]); // aggiungi la coppia di elementi all'array elementPairs
            }
        }

        // Ordino l'array in ordine decrescente
        rhoValues.sort((a, b) => b - a);

        const dataVennAll= {
            labels: elementPairs,
            datasets: [
                {
                    label: "# of models with this size",
                    backgroundColor: "rgb(16,173,115)",
                    borderColor: "rgb(8,59,12)",
                    data: rhoValues.slice(0, 10),
                    color: "rgb(8,59,12)",
                },
            ],
        };
        return dataVennAll;
    }

    const downloadInspectionFile = () => {
        axios({
            url: '/download-inspection-report',
            method: 'GET',
            responseType: 'blob',
        }).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'bpmn_elements.csv');
            document.body.appendChild(link);
            link.click();
        });
    };

    const downloadCombinedFile = () => {
        axios({
            url: '/download-combined-report',
            method: 'GET',
            responseType: 'blob',
        }).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'bpmn_elements.csv');
            document.body.appendChild(link);
            link.click();
        });
    };

    let displayMsgSyntactic = "";
    let displayMsgGoodModeling = "";

    if (invalid===0) {
        displayMsgSyntactic = "You filtered the models for valid, so the analysis on invalids is empty.";
    }

    if (totalProcess===0 || valid===0) {
        displayMsgGoodModeling = "The evaluation of good modeling practices is supported only on valid Process Collaboration models.";
    }

    function downloadSvg(diagramId: string) {
        const diagram = document.querySelector(`#${diagramId}`);
        if (diagram) {
            html2canvas(diagram as HTMLElement).then((canvas) => {
                const url = canvas.toDataURL('image/jpeg');
                const downloadLink = document.createElement('a');
                downloadLink.href = url;
                downloadLink.download = `${diagramId}.jpeg`;
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);
            });
        }
    }

    function countTotalLengths(files: filesInfo[]) {
        let maxLength = 0;
        const arrayLength: number[] = [];

        for (const file of files) {
            // @ts-ignore
            const totalElements = file.elementMap["TotalElements"];

            if (totalElements !== undefined && totalElements >= 0) {
                if (totalElements > maxLength) {
                    maxLength = totalElements;
                }
                while (arrayLength.length <= totalElements) {
                    arrayLength.push(0);
                }
                arrayLength[totalElements]++;
            }
        }

        const labels = [];
        for (let i = 0; i <= maxLength; i++) {
            labels.push(`${i}`);
        }

        const dataTotalElements = {
            labels: labels,
            datasets: [
                {
                    label: "# of models with this size",
                    backgroundColor: "rgb(16,173,115)",
                    borderColor: "rgb(8,59,12)",
                    data: arrayLength,
                    color: "rgb(8,59,12)",
                },
            ],
        };
        return dataTotalElements;
    }

    function countPracticalLengths(files: filesInfo[]) {
        let maxLength = 0;
        const arrayLength: number[] = [0];

        for (const file of files) {
            // @ts-ignore
            const practicalComplexity = file.elementMap["Practical Complexity"];

            if (practicalComplexity !== undefined && practicalComplexity >= 0) {
                if (practicalComplexity > maxLength) {
                    maxLength = practicalComplexity;
                }
                while (arrayLength.length <= practicalComplexity) {
                    arrayLength.push(0);
                }
                arrayLength[practicalComplexity]++;
            }
        }

        const labels = [];
        for (let i = 0; i <= maxLength; i++) {
            labels.push(`${i}`);
        }

        const dataPC = {
            labels: labels,
            datasets: [
                {
                    label: "# of models with this size",
                    backgroundColor: "rgb(16,173,115)",
                    borderColor: "rgb(8,59,12)",
                    data: arrayLength,
                    color: "rgb(8,59,12)",
                },
            ],
        };
        return dataPC;
    }

    function countElementDistr(files: filesInfo[]) {
        const elementCounts = {};

        // Loop through each file
        for (const file of files) {
            // Loop through each element in the file's elementMap
            for (const element in file.elementMap) {
                if (element === "TotalElements" || element === "Practical Complexity") {
                    continue;
                }
                if (file.elementMap.hasOwnProperty(element)) {
                    // @ts-ignore
                    const value = file.elementMap[element];
                    if (value > 0) {
                        if (!elementCounts.hasOwnProperty(element)) {
                            // @ts-ignore
                            elementCounts[element] = 0;
                        }
                        // @ts-ignore
                        elementCounts[element]++;
                    }
                }
            }
        }

        // Convert the elementCounts object to an array of [key, value] pairs and sort by value in descending order
        // @ts-ignore
        const sortedCounts = Object.entries(elementCounts).sort((a, b) => b[1] - a[1]);

        // Extract labels and data from the sortedCounts array
        const labels = sortedCounts.map((count) => count[0]);
        const data = sortedCounts.map((count) => count[1]);

        // Create the chart data object
        const dataElementDistr = {
            labels: labels,
            datasets: [
                {
                    label: "# of models with this element",
                    backgroundColor: "rgb(16,173,115)",
                    borderColor: "rgb(8,59,12)",
                    data: data,
                    color: "rgb(8,59,12)",
                },
            ],
        };

        return dataElementDistr;
    }

    function countElementUsage(files: filesInfo[]) {
        const sumMap: Record<string, number> = {};
        for (const file of files) {
            for (const key in file.elementMap) {
                if (key === "TotalElements" || key === "Practical Complexity") {
                    continue;
                }
                // @ts-ignore
                const value = file.elementMap[key];
                if (!sumMap.hasOwnProperty(key)) {
                    sumMap[key] = value;
                } else {
                    sumMap[key] += value;
                }
            }
        }

        const sortedKeys = Object.keys(sumMap)
            .filter((key) => sumMap[key] >= 1) // filtra gli elementi che hanno valore 0 o inferiore
            .sort((a, b) => sumMap[b] - sumMap[a]);

        const labels = sortedKeys.map((key) => key);

        const dataElementUsage = {
            labels: labels,
            datasets: [
                {
                    label: "# of this element in the collection",
                    backgroundColor: "rgb(16,173,115)",
                    borderColor: "rgb(8,59,12)",
                    data: sortedKeys.map((key) => sumMap[key]),
                    color: "rgb(8,59,12)",
                },
            ],
        };
        return dataElementUsage;
    }

    // @ts-ignore
    const calculatePercentage = (filesToDisplay) => {
        const columnCount = 40; // Numero di colonne da G1 a G40
        const percentageArray: number[] = [];

        // Inizializza l'array delle percentuali a 0
        for (let i = 0; i < columnCount; i++) {
            percentageArray[i] = 0;
        }

        // Calcola il numero di valori 'true' per ogni colonna
        filesToDisplay.forEach((file: { modelType: string; isValid: any; guidelineMap: { [x: string]: any; }; }) => {
            if (file.modelType === "Process Collaboration" && file.isValid) {
                for (let i = 0; i < columnCount; i++) {
                    if (file.guidelineMap[`G${i + 1}`]) {
                        percentageArray[i]++;
                    }
                }
            }
        });

        // Calcola la percentuale per ogni colonna
        const totalFiles = filesToDisplay.filter((file: { modelType: string; isValid: any; }) => file.modelType === "Process Collaboration" && file.isValid).length;
        const percentageResult = percentageArray.map(count => (count / totalFiles) * 100);

        return percentageResult;
    }

    const dataPC = countPracticalLengths(filesInfo);
    const dataTotalElements = countTotalLengths(filesInfo);
    const dataElementDistr = countElementDistr(filesInfo);
    const dataElementUsage = countElementUsage(filesInfo);
    //const dataVennAll = calculateRho(filesInfo);
    const percentageResult = calculatePercentage(filesToDisplay);

    const labels = Array.from({ length: 40 }, (_, index) => `G${index + 1}`); // Genera un array di etichette "G1", "G2", ecc.

    const radarChartData = {
        labels: labels, // Array di etichette
        datasets: [
            {
                label: "% of guideline's satisfaction",
                backgroundColor: "rgba(16,173,115,0.7)",
                borderColor: "rgba(8,59,12,0.6)",
                data: percentageResult, // Array di valori delle percentuali
            },
        ],
    };

    // @ts-ignore
    const errorCounts: { [errorType: string]: number } = {};
    filesInfo.forEach(file => {
        // Estrazione delle stringhe di errore dall'attributo errorLog
        const errorStrings = file.errorLog.split(':');
        // Iterazione delle stringhe di errore
        errorStrings.forEach((errorString: string) => {
            // Verifica se la stringa di errore inizia con "cvc"
            if (errorString.startsWith('cvc')) {
                // Aggiunta del tipo di errore all'oggetto di conteggio
                // @ts-ignore
                if (errorCounts[errorString]) {
                    // @ts-ignore
                    errorCounts[errorString] += 1;
                } else {
                    // @ts-ignore
                    errorCounts[errorString] = 1;
                }
            }
        });
    });
    // @ts-ignore
    const sortedErrorCounts = Object.entries(errorCounts).sort((a, b) => b[1] - a[1]);
    const labelsErr = sortedErrorCounts.map(([errorType]) => errorType);
    // Creazione dell'array di valori

    const dataError = {
        labels: labelsErr, // Array di etichette
        datasets: [
            {
                label: "% of guideline's satisfaction",
                backgroundColor: "rgba(16,173,115,0.7)",
                borderColor: "rgba(8,59,12)",
                color: "rgb(8,59,12)",
                data: sortedErrorCounts.map(([_, count]) => count), // Array di valori delle percentuali
            },
        ],
    };

    return (
        <div style={{background:"#fafafb"}} className="flex flex-col h-full items-left justify-left p-l text-left box-border">
            <ul style={{background:"#fafafb"}} className="nav nav-tabs nav-fill">
                <li className="nav-item" style={{padding: '5px 20px', border: 'none', borderBottom: '1px solid #10ad73', cursor: 'pointer', fontWeight: "bold", fontSize:'15px' }}>
                    <a
                        className={`nav-link ${activeTab === 'bpmn-element-usage' ? 'active' : ''}`}
                        onClick={() => setActiveTab('bpmn-element-usage')}
                        style={{ color: '#10ad73'}}
                    >
                        BPMN Element Usage
                    </a>
                </li>
                <li className="nav-item" style={{padding: '5px 20px', border: 'none', borderBottom: '1px solid #10ad73', cursor: 'pointer', fontWeight: "bold", fontSize:'15px' }}>
                    <a
                        className={`nav-link ${activeTab === 'bpmn-element-combined-use' ? 'active' : ''}`}
                        onClick={() => setActiveTab('bpmn-element-combined-use')}
                        style={{color: '#10ad73'}}
                            >
                        BPMN Element Combined use
                    </a>
                </li>
                <li className="nav-item" style={{padding: '5px 20px', border: 'none', borderBottom: '1px solid #10ad73', cursor: 'pointer', fontWeight: "bold", fontSize:'15px' }}>
                    <a
                        className={`nav-link ${activeTab === 'bpmn-syntactic-validation' ? 'active' : ''}`}
                        onClick={() => setActiveTab('bpmn-syntactic-validation')}
                        style={{color: '#10ad73'}}
                    >
                        BPMN Syntactic Validation
                    </a>
                </li>
                <li className="nav-item" style={{padding: '5px 20px', border: 'none', borderBottom: '1px solid #10ad73', cursor: 'pointer', fontWeight: "bold", fontSize:'15px' }}>
                    <a
                        className={`nav-link ${activeTab === 'bpmn-good-modeling-practices' ? 'active' : ''}`}
                        onClick={() => setActiveTab('bpmn-good-modeling-practices')}
                        style={{color: '#10ad73'}}
                    >
                        BPMN Good Modeling Practices
                    </a>
                </li>
            </ul>

            <div style={{background:"#fafafb"}} className="tab-content">
                {activeTab === 'bpmn-element-usage' && (
                    <>
                        <div style={{display: "flex", flexDirection: "row", width: "100%", marginBottom:"10px",marginTop:"10px"}}>
                            <div style={{width: "50%", paddingRight: "10px", border: "2px solid #d8d8d8",background:"white", padding: "5px 15px 15px 15px",marginRight:"10px", borderRadius: "12px 12px 12px 12px",lineHeight: "1.5714285714285714"}}>
                                <div style={{display:"flex"}}>
                                <a style={{fontSize: '25px', color: 'black', fontWeight: "bold"}}>BPMN Collection's
                                        Model Size</a>
                                    <CiCircleQuestion style={{fontSize: '18px', marginBottom: "3%", cursor: "help"}}
                                                      title={"This is a graph of the model size of the collection"}/>
                                    <button style={{background:'white',border:"none", color: '#10ad73', fontSize: '14px', padding: '5px 5px', cursor: 'pointer'}}>
                                        <FaRegImage onClick={() => downloadSvg('chartMS')} style={{fontSize:"30px", alignSelf:"right",marginBottom:"72%"}}/>
                                    </button>
                                </div>
                                    <div id="chartMS" style={{position: "relative", height:"35vh", width:"100%"}}>
                                        <Line data={dataTotalElements} options={{responsive: true, maintainAspectRatio: false}}/>
                                    </div>

                            </div>
                            <div style={{width: "50%", paddingRight: "10px", border: "2px solid #d8d8d8",background:"white", padding: "5px 15px 15px 15px", borderRadius: "12px 12px 12px 12px",lineHeight: "1.5714285714285714"}}>
                                <div style={{display:"flex"}}>
                                <a style={{fontSize: '25px', color: 'black', fontWeight: "bold"}}>BPMN Collection's
                                        Practical Complexity</a>
                                    <CiCircleQuestion style={{fontSize: '18px', marginBottom: "3%", cursor: "help"}}
                                                      title={"This is a graph of the practical complexity of the collection"}/>
                                    <button style={{background:'white',border:"none", color: '#10ad73', fontSize: '14px', padding: '5px 5px', cursor: 'pointer'}}>
                                        <FaRegImage onClick={() => downloadSvg('chartPC')} style={{fontSize:"30px", alignSelf:"right",marginBottom:"72%"}}/>
                                    </button>
                                </div>
                                <div id="chartPC" style={{position: "relative", height:"38vh", width:"100%"}}>
                                    <Line data={dataPC} options={{responsive: true, maintainAspectRatio: false}}/>
                                </div>
                            </div>
                        </div>
                        <div style={{display: "flex", flexDirection: "row", width: "100%", marginBottom:"10px",marginTop:"10px"}}>
                            <div style={{width: "50%", paddingRight: "10px", border: "2px solid #d8d8d8",background:"white", borderRadius: "12px 12px 12px 12px",padding: "5px 15px 15px 15px",marginRight:"10px", lineHeight: "1.5714285714285714"}}>
                                <div style={{display:"flex"}}>
                                <a style={{fontSize: '25px', color: 'black', fontWeight: "bold"}}>BPMN Element's usage</a>
                                    <CiCircleQuestion style={{fontSize: '18px', marginBottom: "3%", cursor: "help"}}
                                                      title={"This is a graph of the element usage"}/>
                                    <button style={{background:'white',border:"none", color: '#10ad73', fontSize: '14px', padding: '5px 5px', cursor: 'pointer'}}>
                                        <FaRegImage onClick={() => downloadSvg('chartEU')} style={{fontSize:"30px", alignSelf:"right",marginBottom:"72%"}}/>
                                    </button>
                                </div>
                                <div id="chartEU" style={{position: "relative", height:"40vh", width:"100%"}}>
                                    <Line data={dataElementUsage} options={{responsive: true, maintainAspectRatio: false}}/>
                                </div>

                                {showTableEU && (
                                <table>
                                    <thead>
                                    <tr>
                                        <th>Element</th>
                                        <th># of Elements</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {dataElementUsage.labels.map((label, index) => (
                                        <tr key={index}>
                                            <td>{label}</td>
                                            <td>{dataElementUsage.datasets[0].data[index]}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                                )}
                            </div>

                            <div style={{width: "50%", paddingRight: "10px", border: "2px solid #d8d8d8",background:"white", padding: "5px 15px 15px 15px", borderRadius: "12px 12px 12px 12px",lineHeight: "1.5714285714285714"}}>
                                <div style={{display:"flex"}}>
                                <a style={{fontSize: '25px', color: 'black', fontWeight: "bold"}}>BPMN Element's Distribution</a>
                                    <CiCircleQuestion style={{fontSize: '18px', marginBottom: "3%", cursor: "help"}}
                                                      title={"This is a graph of the element distribution"}/>
                                    <button style={{background:'white', border:"none", color: '#10ad73', fontSize: '14px', padding: '5px 5px', cursor: 'pointer'}}>
                                        <FaRegImage onClick={() => downloadSvg('chartED')} style={{fontSize:"30px", alignSelf:"right",marginBottom:"72%"}}/>
                                    </button>
                                </div>

                                <div id="chartED" style={{position: "relative", height:"40vh", width:"100%"}}>
                                    <Line data={dataElementDistr} options={{responsive: true, maintainAspectRatio: false}}/>
                                </div>


                                {showTableED && (
                                    <table>
                                        <thead>
                                        <tr>
                                            <th>Element</th>
                                            <th># of Models</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {dataElementDistr.labels.map((label, index) => (
                                            <tr key={index}>
                                                <td>{label}</td>
                                                <td>{dataElementDistr.datasets[0].data[index] as ReactNode}</td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                )}
                                </div>
                        </div>
                        <div style={{display:"flex",flexDirection:"column",marginBottom:"10px", marginTop:"0.20cm"}} >
                            <button style={{ background: 'white', color: '#10ad73', fontSize: '14px', padding: '10px 10px', cursor: 'pointer', marginTop: '0.42cm' }} onClick={downloadInspectionFile}>
                                <GrDocumentCsv /><a style={{ marginRight: '0.5em', color: '#10ad73', marginLeft: '8px' }}>Download Inspection report</a>
                            </button>
                        </div>

                    </>

                )}
                {activeTab === 'bpmn-element-combined-use' && (
                    <>
                    <div style={{display: "flex", flexDirection: "row", width: "100%", marginBottom:"10px",marginTop:"10px"}}>
                        <div style={{display:'flex',width: "100%",flexDirection: "column"}}>
                            <div style={{marginBottom:"10px",marginRight:"10px",  border: "2px solid #d8d8d8",background:"white", padding: "5px 15px 15px 15px",borderRadius: "12px 12px 12px 12px",lineHeight: "1.5714285714285714"}}>
                                    <div style={{display:"flex"}}>
                                        <a style={{fontSize: '25px', color: 'black', fontWeight: "bold"}}>Process Collaboration</a>
                                        <CiCircleQuestion style={{fontSize: '18px', marginBottom: "3%", cursor: "help"}}
                                                          title={"This is a graph of the model size of the collection"}/>
                                        <button style={{background:'white',border:"none", color: '#10ad73', fontSize: '14px', padding: '5px 5px', cursor: 'pointer'}}>
                                            <FaRegImage onClick={() => downloadSvg('chartVPC')} style={{fontSize:"30px", alignSelf:"right",marginBottom:"72%"}}/>
                                        </button>
                                    </div>
                                    <div id="chartVPC" style={{position: "relative", height:"30vh", width:"100%"}}>
                                        <ChartVenn options={{responsive:true,maintainAspectRatio:false}}/>
                                    </div>
                            </div>
                            <div style={{paddingRight: "10px", border: "2px solid #d8d8d8",background:"white", padding: "5px 15px 15px 15px",marginRight:"10px", borderRadius: "12px 12px 12px 12px",lineHeight: "1.5714285714285714"}}>
                                {showTableEU && (
                                    <table>
                                        <thead>
                                        <tr>
                                            <th>Elements Pair</th>
                                            <th style={{width: "30%"}}>Rho (ρ) <CiCircleQuestion style={{fontSize: '18px', marginBottom: "3%", cursor: "help", display: "inline-block", verticalAlign: "middle"}} title={"This is an index to assesses linear relationships between elements"}/></th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {dataElementUsage.labels.map((label, index) => (
                                            <tr key={index}>
                                                <td>{label} - {label}</td>
                                                <td style={{textAlign: "center"}}>{dataElementUsage.datasets[0].data[index]}</td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </div>
                        <div style={{display:"flex",width: "100%",flexDirection: "column"}}>
                                <div style={{marginBottom:"10px",marginRight:"10px",  paddingRight: "10px", border: "2px solid #d8d8d8",background:"white", padding: "5px 15px 15px 15px", borderRadius: "12px 12px 12px 12px",lineHeight: "1.5714285714285714"}}>
                                    <div style={{display:"flex"}}>
                                        <a style={{fontSize: '25px', color: 'black', fontWeight: "bold"}}>Choreography</a>
                                        <CiCircleQuestion style={{fontSize: '18px', marginBottom: "3%", cursor: "help"}}
                                                          title={"This is a graph of the model size of the collection"}/>
                                        <button style={{background:'white',border:"none", color: '#10ad73', fontSize: '14px', padding: '5px 5px', cursor: 'pointer'}}>
                                            <FaRegImage onClick={() => downloadSvg('chartVCOR')} style={{fontSize:"30px", alignSelf:"right",marginBottom:"72%"}}/>
                                        </button>
                                    </div>
                                    <div id="chartVCOR" style={{position: "relative", height:"30vh", width:"100%"}}>
                                        <ChartVenn options={{responsive:true,maintainAspectRatio:false}}/>
                                    </div>
                                </div>
                                <div style={{paddingRight: "10px", border: "2px solid #d8d8d8",background:"white", padding: "5px 15px 15px 15px",marginRight:"10px", borderRadius: "12px 12px 12px 12px",lineHeight: "1.5714285714285714"}}>
                                    {showTableEU && (
                                        <table>
                                            <thead>
                                            <tr>
                                                <th>Elements Pair</th>
                                                <th style={{width: "30%"}}>Rho (ρ) <CiCircleQuestion style={{fontSize: '18px', marginBottom: "3%", cursor: "help", display: "inline-block", verticalAlign: "middle"}} title={"This is an index to assesses linear relationships between elements"}/></th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {dataElementUsage.labels.map((label, index) => (
                                                <tr key={index}>
                                                    <td>{label} - {label}</td>
                                                    <td style={{textAlign: "center"}}>{dataElementUsage.datasets[0].data[index]}</td>
                                                </tr>
                                            ))}
                                            </tbody>
                                        </table>
                                    )}
                                </div>
                        </div>
                        <div style={{display:'flex',width: "100%",flexDirection: "column"}}>
                            <div style={{marginBottom:"10px", paddingRight: "10px", border: "2px solid #d8d8d8",background:"white", padding: "5px 15px 15px 15px", borderRadius: "12px 12px 12px 12px",lineHeight: "1.5714285714285714"}}>
                                <div style={{display:"flex"}}>
                                    <a style={{fontSize: '25px', color: 'black', fontWeight: "bold"}}>Conversation</a>
                                    <CiCircleQuestion style={{fontSize: '18px', marginBottom: "3%", cursor: "help"}}
                                                      title={"This is a graph of the model size of the collection"}/>
                                    <button style={{background:'white',border:"none", color: '#10ad73', fontSize: '14px', padding: '5px 5px', cursor: 'pointer'}}>
                                        <FaRegImage onClick={() => downloadSvg('chartVCON')} style={{fontSize:"30px", alignSelf:"right",marginBottom:"72%"}}/>
                                    </button>
                                </div>
                                <div id="chartVCON" style={{position: "relative", height:"30vh", width:"100%"}}>
                                    <ChartVenn options={{responsive:true,maintainAspectRatio:false}}/>
                                </div>
                            </div>
                            <div style={{paddingRight: "10px", border: "2px solid #d8d8d8",background:"white", padding: "5px 15px 15px 15px", borderRadius: "12px 12px 12px 12px",lineHeight: "1.5714285714285714"}}>
                                {showTableEU && (
                                    <table>
                                        <thead>
                                        <tr>
                                            <th>Elements Pair</th>
                                            <th style={{width: "30%"}}>Rho (ρ) <CiCircleQuestion style={{fontSize: '18px', marginBottom: "3%", cursor: "help", display: "inline-block", verticalAlign: "middle"}} title={"This is an index to assesses linear relationships between elements"}/></th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {dataElementUsage.labels.map((label, index) => (
                                            <tr key={index}>
                                                <td>{label} - {label}</td>
                                                <td style={{textAlign: "center"}}>{dataElementUsage.datasets[0].data[index]}</td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </div>
                    </div>

                    <div style={{marginBottom:"10px", marginTop:"0.20cm"}} >
                        <button style={{background: 'white',width:"100%", color: '#10ad73', fontSize: '14px', padding: '10px 10px', cursor: 'pointer', marginTop: '0.42cm' }} onClick={downloadCombinedFile}>
                        <GrDocumentCsv /><a style={{ marginRight: '0.5em', color: '#10ad73', marginLeft: '8px' }}>Download Combined use report</a>
                        </button>
                    </div>

                    </>

                )}
                {activeTab === 'bpmn-syntactic-validation' && (
                    <div>
                        {displayMsgSyntactic ? (
                            <div className="container">
                                <img style={{width:"8%",height:"10%"}} src="../../img/denied.png" />
                                <p>{displayMsgSyntactic}</p>
                                <a><a href="" style={{cursor:"pointer"}} onClick={deleteFiles}>Upload invalid models</a> for inspecting validation errors.</a>
                            </div>
                        ) : (
                            <div style={{display: "flex", flexDirection: "column", width: "100%", marginBottom:"10px",marginTop:"10px"}}>
                                <div style={{ display: 'flex',width: "100%",flexDirection: "column" }}>
                                    <div style={{marginBottom:"10px", paddingRight: "10px", border: "2px solid #d8d8d8",background:"white", padding: "5px 15px 15px 15px", borderRadius: "12px 12px 12px 12px",lineHeight: "1.5714285714285714"}}>
                                        <div style={{display:"flex"}}>
                                            <a style={{fontSize: '25px', color: 'black', fontWeight: "bold"}}>Syntactical errors</a>
                                            <CiCircleQuestion style={{fontSize: '18px', marginBottom: "3%", cursor: "help"}}
                                                              title={"This is a graph of the model size of the collection"}/>
                                            <button style={{background:'white',border:"none", color: '#10ad73', fontSize: '14px', padding: '5px 5px', cursor: 'pointer'}}>
                                                <FaRegImage onClick={() => downloadSvg('chartSE')} style={{fontSize:"30px", marginBottom:"71%", alignSelf:"right"}}/>
                                            </button>
                                        </div>
                                        <div id="chartSE" style={{position: "relative", height:"100%", width:"100%"}}>
                                            <Bar options={{responsive:true,maintainAspectRatio:false}}  data={dataError}></Bar>
                                        </div>
                                    </div>
                                </div>
                                <div style={{display: "flex", flexDirection: "row"}}>
                                    <div style={{width: "100%", paddingRight: "10px", border: "2px solid #d8d8d8",background:"white", padding: "5px 15px 15px 15px",borderRadius: "12px 12px 12px 12px",lineHeight: "1.5714285714285714"}}>
                                        <div style={{display:"flex", flexDirection:"column"}}>
                                            <table>
                                                <thead>
                                                <tr>
                                                    <th>Error Type</th>
                                                    <th>Error Description <CiCircleQuestion style={{fontSize: '18px', marginBottom: "1%", cursor: "help"}}
                                                                                           title={"The information about errors can be founded at https://wiki.xmldation.com"}/></th>
                                                    <th># of Error</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {sortedErrorCounts.map(([errorType, count]) => {
                                                    const errorTypeFormatted = errorType.replace(/\./g, '-');
                                                    const errorLink = `https://wiki.xmldation.com/Support/Validator/${errorTypeFormatted}`;
                                                    return (
                                                        <tr key={errorType}>
                                                            <td>{errorType}</td>
                                                            <td>
                                                                <img style={{marginBottom:"0.2%"}} src={xmlLogo} width="25"/>
                                                                <a style={{marginLeft:"1%"}} href={errorLink} target="_blank" rel="noreferrer">
                                                                    {errorLink}
                                                                </a>
                                                            </td>
                                                            <td>{count}</td>
                                                        </tr>
                                                    );
                                                })}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                                <button style={{ background: 'white', color: '#10ad73', fontSize: '14px', padding: '10px 10px', cursor: 'pointer', marginTop: '0.42cm' }} onClick={downloadFile}>
                                    <GrDocumentCsv /><a style={{ marginRight: '0.5em', color: '#10ad73', marginLeft: '8px' }}>Download Validation report</a>
                                </button>
                            </div>

                        )}

                    </div>
                )}
                {activeTab === 'bpmn-good-modeling-practices' && (
                    <div>
                        {displayMsgGoodModeling ? (
                            <div className="container">
                                <img style={{width:"8%",height:"10%"}} src="../../img/denied.png" />
                                <p>{displayMsgGoodModeling}</p>
                                <a><a href="" style={{cursor:"pointer"}} onClick={deleteFiles}>Upload Process Collaboration models</a> for inspecting good modeling practices.</a>
                            </div>
                        ) : (
                            <>
                                <div style={{display: "flex", flexDirection: "column", width: "100%", marginBottom:"10px",marginTop:"10px"}}>
                                    <div style={{display: "flex", flexDirection: "row"}}>
                                        <div style={{width: "100%", marginRight:"10px", paddingRight: "10px", border: "2px solid #d8d8d8",background:"white", padding: "5px 15px 15px 15px", borderRadius: "12px 12px 12px 12px",lineHeight: "1.5714285714285714"}}>
                                            <div style={{display:"flex",alignSelf:"center"}}>
                                                <a style={{fontSize: '25px',color: 'black', fontWeight: "bold"}}>Radar Guidelines</a>
                                                <CiCircleQuestion style={{fontSize: '18px', marginBottom: "3%", cursor: "help"}}
                                                                  title={"This is a graph of the model size of the collection"}/>
                                                <button style={{background:'white',border:"none", color: '#10ad73', fontSize: '14px', padding: '5px 5px', cursor: 'pointer'}}>
                                                    <FaRegImage onClick={() => downloadSvg('chartSE')} style={{fontSize:"30px", alignSelf:"right",marginBottom:"71%"}}/>
                                                </button>
                                            </div>
                                            <div id="chartSE" style={{position: "relative", height:"100vh", width:"100%"}}>
                                                <Radar options={{responsive:true,maintainAspectRatio:false}}  data={radarChartData}></Radar>
                                            </div>
                                        </div>

                                        <div style={{width: "30%", paddingRight: "10px", border: "2px solid #d8d8d8",background:"white", padding: "5px 15px 15px 15px", borderRadius: "12px 12px 12px 12px",lineHeight: "1.5714285714285714"}}>
                                        <a style={{fontSize: '20px', color: 'black', fontWeight: "bold"}}>% of Guidelines Satisfaction</a> <CiCircleQuestion style={{fontSize: '18px', marginBottom: "3%", cursor: "help"}} title={"This is a graph of the model size of the collection"}/>
                                            <div style={{display:"flex", flexDirection: "column"}}>
                                                <div style={{marginTop: "10px",display:"flex",flexDirection: "column"}}>
                                                    {percentageResult.map((percentage, index) => {
                                                        const green = Math.floor(255 * (percentage / 100));
                                                        const red = Math.floor(255 * ((100 - percentage) / 100));
                                                        const color = `rgb(${red}, ${green}, 0)`;
                                                        const lineStyle = {
                                                            width: `${percentage}%`, // Larghezza della linea di pienezza in base alla percentuale
                                                            backgroundColor: color, // Colore di sfondo della linea di pienezza uguale al colore del testo
                                                            height: '8px', // Altezza della linea di pienezza
                                                            marginTop: '2px', // Margine superiore della linea di pienezza
                                                        };
                                                        let icon;
                                                        if (percentage >= 0 && percentage <= 25) {
                                                            icon = <HiChevronDoubleDown />;
                                                        } else if (percentage > 25 && percentage <= 50) {
                                                            icon = <HiChevronDown />;
                                                        } else if (percentage > 50 && percentage <= 75) {
                                                            icon = <HiChevronUp/>;
                                                        } else if (percentage > 75 && percentage <= 100) {
                                                            icon = <HiChevronDoubleUp />;
                                                        }

                                                        const g = [        'G2',        'G3',        'G7',        'G8',        'G9',        'G10',        'G11',        'G12',        'G13',        'G14',        'G15',        'G16',        'G17',        'G18',        'G19',        'G20',        'G21',        'G22',        'G24',        'G26',        'G28',        'G29',        'G30',        'G31',        'G32',        'G33',        'G34',        'G35',        'G36',        'G37',        'G38',        'G39',        'G42',        'G44',        'G45',        'G46',        'G47',        'G48',        'G49',        'G50'    ];

                                                        return (
                                                            <div key={index} style={{display: "flex", alignItems: "center", margin: "5px", borderBottom:"1px solid #F5F7F9",fontSize: '15px', position: 'relative'}}>
                                                                <div style={{marginLeft: "1%",fontSize:"14px",fontWeight:"bold", color}}> {icon} {g[index]}: </div>
                                                                <div style={{
                                                                    ...lineStyle,
                                                                    marginLeft: "25%",
                                                                    position: "absolute",
                                                                    width:"75%",
                                                                    top: 8,
                                                                    left: 0,
                                                                    height: '10px',
                                                                    background: percentage === 0 ? "#F5F7F9" : `linear-gradient(to right, ${color} ${percentage}%, #F5F7F9 ${percentage}%)`,
                                                                    borderRadius: "5px"
                                                                }}>
                                                                    {percentage > 0 &&
                                                                        <div style={{
                                                                            position: 'absolute',
                                                                            right: `${90-percentage}%`,
                                                                            top: '-200%',
                                                                            fontSize:"12px",
                                                                            fontWeight:"bold",
                                                                            color:"gray"
                                                                        }}>
                                                                            {percentage.toFixed(2)}%
                                                                        </div>
                                                                    }
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                                <div style={{display: "flex", flexDirection: "column", width: "100%", marginBottom:"10px",marginTop:"10px"}}>
                                    <div style={{width: "100%", display: 'flex',flexDirection: "column",paddingRight: "10px", border: "2px solid #d8d8d8",background:"white", padding: "5px 15px 15px 15px",marginRight:"10px", borderRadius: "12px 12px 12px 12px",lineHeight: "1.5714285714285714"}}>

                                        <div style={{fontSize: "18px", color: "black", width:"100%", display:"flex"}}>
                                            <span className="file-info-item-name" style={{ fontSize: "13px", fontWeight: "bold", width:"20%"}}>File name</span>
                                            <span className="file-info-item" style={{ fontSize: '12px', fontWeight:"bold"}}>G2</span>
                                            <span className="file-info-item" style={{ fontSize: '12px', fontWeight:"bold"}}>G3</span>
                                            <span className="file-info-item" style={{ fontSize: '12px', fontWeight:"bold"}}>G7</span>
                                            <span className="file-info-item" style={{ fontSize: '12px', fontWeight:"bold"}}>G8</span>
                                            <span className="file-info-item" style={{ fontSize: '12px', fontWeight:"bold"}}>G9</span>
                                            <span className="file-info-item" style={{ fontSize: '12px', fontWeight:"bold"}}>G10</span>
                                            <span className="file-info-item" style={{ fontSize: '12px', fontWeight:"bold"}}>G11</span>
                                            <span className="file-info-item" style={{ fontSize: '12px', fontWeight:"bold"}}>G12</span>
                                            <span className="file-info-item" style={{ fontSize: '12px', fontWeight:"bold"}}>G13</span>
                                            <span className="file-info-item" style={{ fontSize: '12px', fontWeight:"bold"}}>G14</span>
                                            <span className="file-info-item" style={{ fontSize: '12px', fontWeight:"bold"}}>G15</span>
                                            <span className="file-info-item" style={{ fontSize: '12px', fontWeight:"bold"}}>G16</span>
                                            <span className="file-info-item" style={{ fontSize: '12px', fontWeight:"bold"}}>G17</span>
                                            <span className="file-info-item" style={{ fontSize: '12px', fontWeight:"bold"}}>G18</span>
                                            <span className="file-info-item" style={{ fontSize: '12px', fontWeight:"bold"}}>G19</span>
                                            <span className="file-info-item" style={{ fontSize: '12px', fontWeight:"bold"}}>G20</span>
                                            <span className="file-info-item" style={{ fontSize: '12px', fontWeight:"bold"}}>G21</span>
                                            <span className="file-info-item" style={{ fontSize: '12px', fontWeight:"bold"}}>G22</span>
                                            <span className="file-info-item" style={{ fontSize: '12px', fontWeight:"bold"}}>G24</span>
                                            <span className="file-info-item" style={{ fontSize: '12px', fontWeight:"bold"}}>G26</span>
                                            <span className="file-info-item" style={{ fontSize: '12px', fontWeight:"bold"}}>G28</span>
                                            <span className="file-info-item" style={{ fontSize: '12px', fontWeight:"bold"}}>G29</span>
                                            <span className="file-info-item" style={{ fontSize: '12px', fontWeight:"bold"}}>G30</span>
                                            <span className="file-info-item" style={{ fontSize: '12px', fontWeight:"bold"}}>G31</span>
                                            <span className="file-info-item" style={{ fontSize: '12px', fontWeight:"bold"}}>G32</span>
                                            <span className="file-info-item" style={{ fontSize: '12px', fontWeight:"bold"}}>G33</span>
                                            <span className="file-info-item" style={{ fontSize: '12px', fontWeight:"bold"}}>G34</span>
                                            <span className="file-info-item" style={{ fontSize: '12px', fontWeight:"bold"}}>G35</span>
                                            <span className="file-info-item" style={{ fontSize: '12px', fontWeight:"bold"}}>G36</span>
                                            <span className="file-info-item" style={{ fontSize: '12px', fontWeight:"bold"}}>G37</span>
                                            <span className="file-info-item" style={{ fontSize: '12px', fontWeight:"bold"}}>G38</span>
                                            <span className="file-info-item" style={{ fontSize: '12px', fontWeight:"bold"}}>G39</span>
                                            <span className="file-info-item" style={{ fontSize: '12px', fontWeight:"bold"}}>G42</span>
                                            <span className="file-info-item" style={{ fontSize: '12px', fontWeight:"bold"}}>G44</span>
                                            <span className="file-info-item" style={{ fontSize: '12px', fontWeight:"bold"}}>G45</span>
                                            <span className="file-info-item" style={{ fontSize: '12px', fontWeight:"bold"}}>G46</span>
                                            <span className="file-info-item" style={{ fontSize: '12px', fontWeight:"bold"}}>G47</span>
                                            <span className="file-info-item" style={{ fontSize: '12px', fontWeight:"bold"}}>G48</span>
                                            <span className="file-info-item" style={{ fontSize: '12px', fontWeight:"bold"}}>G49</span>
                                            <span className="file-info-item" style={{ fontSize: '12px', fontWeight:"bold"}}>G50</span>
                                        </div>

                                        {filesToDisplay
                                            .filter(file => file.modelType === "Process Collaboration" && file.isValid)
                                            .map((file, index) => (
                                                <div key={index} style={{ border: "2px solid rgba(0, 0, 0, 0.05)", padding: "1px", borderRadius: "5px", marginBottom: "1px", fontSize: "15px", color: "black" }}>
                                                    <div className="file-info">
                                                        <p className="file-info-item-name file-name" style={{width:"9%"}}>
                                                            <BsDiagram2 /> {file.name}
                                                        </p>
                                                        <div className="file-info-item" style={{display:"flex", flexDirection:"row"}} >
                                                            {Object.entries(file.guidelineMap)
                                                                .sort((a, b) => parseInt(a[0].substring(1)) - parseInt(b[0].substring(1))) // Ordina gli oggetti per chiave numerica
                                                                .map(([key, value], index) => (
                                                                    <span key={key} style={{marginLeft:"0.56%", marginTop:"8px"}} className={`badge badge-pill badge-success ${value ? 'Valid' : 'Invalid'}`}>
                                                                            {value ? <GiConfirmed /> : <AiFillExclamationCircle />}
                                                                    </span>
                                                                ))}
                                                        </div>

                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                    <button style={{ background: 'white', color: '#10ad73', fontSize: '14px', padding: '10px 10px', cursor: 'pointer', marginTop: '0.42cm' }}  onClick={downloadGMFile}>
                                        <GrDocumentCsv /><a style={{ marginRight: '0.5em', color: '#10ad73', marginLeft: '8px' }}>Download Good Modeling Practice report</a>
                                    </button>
                                </div>
                            </>
                        )}
                    </div>

                )}
               </div>

            <input style={{position: 'fixed', marginBottom:'20px', marginRight:'20px', backgroundColor: 'red', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer', right: '0', bottom: '0'}} onClick={deleteFiles} type="submit" value="Reset"/>

        </div>
    );
}



