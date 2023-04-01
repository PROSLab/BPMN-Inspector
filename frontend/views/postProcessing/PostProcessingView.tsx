import React, {useEffect, useRef, useState} from "react";
import axios from "axios";
import { useLocation } from 'react-router-dom';
import "./postCss.css";
import {toast} from "react-toastify";
import LineChart from "Frontend/components/charts/LineChart";
import { Chart, registerables } from 'chart.js';
import '@vaadin/vaadin-lumo-styles/badge.js'
import BarChart from "Frontend/components/charts/BarChart";
import PieChart from "Frontend/components/charts/PieChart";
// @ts-ignore
import ChartVenn from "Frontend/components/charts/ChartVenn";
import {BsDiagram2} from "react-icons/bs";
import {loader} from "react-global-loader";
import {GiConfirmed} from "react-icons/gi";
import {AiFillExclamationCircle} from "react-icons/ai";
import {resolve} from "chart.js/helpers";
import {GrDocumentCsv, GrDocumentDownload} from "react-icons/gr";
import {Bar, Line } from "react-chartjs-2";
import { CiCircleQuestion } from "react-icons/ci";
import { FaRegImage } from "react-icons/fa";
import { Canvg } from 'canvg';
import html2canvas from 'html2canvas';
git

interface filesInfoFiltered {
    name: string;
    size: number;
    isValid: boolean;
    isDuplicated: boolean;
    elementMap: any;
}

export default function PostProcessingView() {
    const [activeTab, setActiveTab] = useState('bpmn-element-usage');
    const location = useLocation()
    const filteringArray: string[] = [];
    const {data} = location.state
    Chart.register(...registerables);

    const [filesInfo, setFilesInfo] = useState<Array<filesInfo>>([]);
    const [filesInfoFiltered, setFilesInfoFiltered] = useState<Array<filesInfoFiltered>>([]);
    const [showAllFiles, setShowAllFiles] = useState<boolean>(false);
    let displayButton = filesInfo.length > 1;
    let filesToDisplay = showAllFiles ? filesInfo : filesInfo.slice(0, 1);
    interface filesInfo {
        modelType: string;
        name: string;
        size: number;
        isValid: boolean;
        isEnglish: string;
        isDuplicated: boolean;
        elementMap: Map<string, number>;
    }

    useEffect(() => {
        loader.show();
        axios({
            method: "post",
            url: "/files",
            data: data,
        }).then((response) => {
            setFilesInfo(response.data);
            loader.hide();
        });
    }, []);

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

    const uniqueData = Array.from(new Set(data));

    let displayMsgSyntactic = "";
    let displayMsgGoodModeling = "";

    if (data.includes('invalid')) {
        displayMsgSyntactic = "You filtered the models for valid, so the analysis on invalids is empty.";
    }

    if (totalProcess===0) {
        displayMsgGoodModeling = "The evaluation of good modeling practices is supported on Process Collaboration models only.";
    }

    function downloadSvg() {
        const chart = document.querySelector('#chart');
        if (chart) {
            html2canvas(chart as HTMLElement).then((canvas) => {
                const url = canvas.toDataURL('image/png');
                const downloadLink = document.createElement('a');
                downloadLink.href = url;
                downloadLink.download = 'chart.png';
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
                    label: "# of files with this element",
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

        const dataElementUsage = {
            labels: sortedKeys,
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

    const dataPC = countPracticalLengths(filesInfo);
    const dataTotalElements = countTotalLengths(filesInfo);
    const dataElementDistr = countElementDistr(filesInfo);
    const dataElementUsage = countElementUsage(filesInfo);
    // @ts-ignore
    // @ts-ignore
    return (
        <div className="flex flex-col h-full items-left justify-left p-l text-left box-border">
            <a style={{fontSize:'40px',color:'black',fontWeight:"bold"}}>BPMN Models inspected</a>
            <a style={{fontSize:'20px',color:'black',alignSelf:'left',marginBottom:'0.5cm'}}>
                <a style={{color:'green',fontWeight:"bold"}}>{total}</a> models have been inspected. <a style={{fontSize:'20px',color:'black',alignSelf:'left',marginBottom:'0.5cm'}}>The collection inspected is composed by: Process Collaboration <a style={{color:'green',fontWeight:"bold"}}>{totalProcess}</a>, Choreography <a style={{color:'green',fontWeight:"bold"}}>{totalChoreography}</a>, Conversation <a style={{color:'green',fontWeight:"bold"}}>{totalConversation}</a>.</a>
            </a>

            <ul className="nav nav-tabs nav-fill">
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
                <li className="nav-item" style={{padding: '5px 20px', border: 'none', borderBottom: '1px solid #10ad73', cursor: 'pointer', fontWeight: "bold", fontSize:'15px' }}>
                    <a
                        className={`nav-link ${activeTab === 'bpmn-model-list' ? 'active' : ''}`}
                        onClick={() => setActiveTab('bpmn-model-list')}
                        style={{color: '#10ad73'}}
                    >
                        BPMN List (Test)
                    </a>
                </li>
            </ul>

            <div className="tab-content">
                {activeTab === 'bpmn-element-usage' && (
                    <>
                        <div style={{display: "flex", flexDirection: "row", width: "100%"}}>
                            <div style={{width: "50%", paddingRight: "10px", borderRight: "1px solid #d8d8d8"}}>
                                <div style={{
                                    textAlign: "center",
                                    borderBottom: "1px solid #d8d8d8",
                                    paddingBottom: "1px"
                                }}>
                                    <a style={{fontSize: '25px', color: 'black', fontWeight: "bold"}}>BPMN Collection's
                                        Model Size</a>
                                    <CiCircleQuestion style={{fontSize: '18px', marginBottom: "3%", cursor: "help"}}
                                                      title={"This is a graph of the model size of the collection"}/>
                                    <button style={{background:'white', border:"none", color: '#10ad73', fontSize: '14px', padding: '5px 5px', cursor: 'pointer'}}>
                                        <FaRegImage onClick={downloadSvg} style={{fontSize:"30px", alignSelf:"right"}}/>
                                    </button>

                                </div>
                                    <div id="chart">
                                        <Line data={dataTotalElements} options={{responsive: false, maintainAspectRatio: false}}/>
                                    </div>
                            </div>
                            <div style={{width: "50%", paddingLeft: "10px"}}>
                                <div style={{
                                    textAlign: "center",
                                    borderBottom: "1px solid #d8d8d8",
                                    paddingBottom: "1px"
                                }}>
                                    <a style={{fontSize: '25px', color: 'black', fontWeight: "bold"}}>BPMN Collection's
                                        Practical Complexity</a>
                                    <CiCircleQuestion style={{fontSize: '18px', marginBottom: "3%", cursor: "help"}}
                                                      title={"This is a graph of the practical complexity of the collection"}/>
                                    <button style={{background:'white', border:"none", color: '#10ad73', fontSize: '14px', padding: '5px 5px', cursor: 'pointer'}}>
                                        <FaRegImage onClick={downloadSvg} style={{fontSize:"30px", alignSelf:"right"}}/>
                                    </button>
                                </div>
                                <div id="chart">
                                    <Line data={dataPC} options={{responsive: false, maintainAspectRatio: false}}/>
                                </div>
                            </div>
                        </div>
                        <div style={{display: "flex", flexDirection: "row", width: "100%"}}>
                            <div style={{width: "50%", paddingRight: "10px", borderRight: "1px solid #d8d8d8"}}>
                                <div style={{textAlign: "center", borderBottom: "1px solid #d8d8d8", paddingBottom: "1px"}}>
                                    <a style={{fontSize: '25px', color: 'black', fontWeight: "bold"}}>BPMN Element's usage</a>
                                    <CiCircleQuestion style={{fontSize: '18px', marginBottom: "3%", cursor: "help"}}
                                                      title={"This is a graph of the element usage"}/>
                                    <button style={{background:'white', border:"none", color: '#10ad73', fontSize: '14px', padding: '5px 5px', cursor: 'pointer'}}>
                                        <FaRegImage onClick={downloadSvg} style={{fontSize:"30px", alignSelf:"right"}}/>
                                    </button>
                                </div>
                                <div id="chart">
                                    <Line data={dataElementUsage} options={{responsive: false, maintainAspectRatio: false}}/>
                                </div>
                            </div>
                            <div style={{width: "50%", paddingRight: "10px", borderRight: "1px solid #d8d8d8"}}>
                                <div style={{textAlign: "center", borderBottom: "1px solid #d8d8d8", paddingBottom: "1px"}}>
                                    <a style={{fontSize: '25px', color: 'black', fontWeight: "bold"}}>BPMN Element's Distribution</a>
                                    <CiCircleQuestion style={{fontSize: '18px', marginBottom: "3%", cursor: "help"}}
                                                      title={"This is a graph of the element distribution"}/>
                                    <button style={{background:'white', border:"none", color: '#10ad73', fontSize: '14px', padding: '5px 5px', cursor: 'pointer'}}>
                                        <FaRegImage onClick={downloadSvg} style={{fontSize:"30px", alignSelf:"right"}}/>
                                    </button>
                                </div>
                                <div id="chart">
                                    <Line data={dataElementDistr} options={{responsive: false, maintainAspectRatio: false}}/>
                                </div>

                            </div>
                        </div>
                    </>

                )}
                {activeTab === 'bpmn-element-combined-use' && (
                    <div>
                        <a style={{fontSize:'25px',color:'black',alignSelf:'left',fontWeight:"bold"}}>BPMN Element Combined use</a>
                        <div style={{display:'flex'}}>

                            <ChartVenn options={{responsive:false, height: '10%', width:'30%',maintainAspectRatio:false}}/>
                            <ChartVenn options={{responsive:false, height: '10%', width:'30%',maintainAspectRatio:false}}/>
                            <ChartVenn options={{responsive:false, height: '10%', width:'30%',maintainAspectRatio:false}}/>
                            <BarChart options={{responsive:false,height: '10%', width:'30%',maintainAspectRatio:false}} data={data}></BarChart>
                            <PieChart ></PieChart>

                        </div>
                    </div>
                )}
                {activeTab === 'bpmn-syntactic-validation' && (
                    <div>
                        {displayMsgSyntactic ? (
                            <div className="container">
                                <img src="../../img/denied.png" />
                                <p>{displayMsgSyntactic}</p>
                                <a><a href="" style={{cursor:"pointer"}} onClick={deleteFiles}>Upload invalid models</a> for inspecting validation errors.</a>
                            </div>
                        ) : (
                            <div>
                                <a style={{ fontSize: '25px', color: 'black', alignSelf: 'left', fontWeight: 'bold' }}>BPMN Syntactic Validation</a>
                                <div style={{ display: 'flex' }}>
                                    {filesToDisplay.map((file, index) =>
                                        <div key={index} style={{ border: "2px solid rgba(0, 0, 0, 0.05)", padding: "1px", borderRadius: "5px", marginBottom: "1px", fontSize: "15px", color: "black" }}>
                                            <div className="file-info">
                                                <p className="file-info-item-name file-name">
                                                    <BsDiagram2 style={{}} /> {file.name}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    <button style={{ marginLeft: '2%', background: 'white', borderBottom: "1px #10ad73", color: '#10ad73', fontSize: '14px', padding: '10px 10px', cursor: 'pointer', marginTop: '0.42cm' }} onClick={downloadFile}>
                                        <GrDocumentCsv /><a style={{ marginRight: '0.5em', color: '#10ad73', marginLeft: '8px' }}>Validation report</a>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
                {activeTab === 'bpmn-model-list' && (
                    <div className="col">
                        {displayButton && (
                            <button style={{ backgroundColor: 'white', alignItems:"right", color: '#10ad73', padding: '5px 20px', border: 'none', borderBottom: '1px solid #10ad73', cursor: 'pointer', right: '0', bottom: '0', fontWeight: "bold", fontSize:'12px' }} onClick={() => setShowAllFiles(!showAllFiles)}>
                                {showAllFiles ? `Hide list` : `Click here to show all (${filesInfo.length} models)`}
                            </button>
                        )}

                        <div className="file-info" >
                            <span className="file-info-item-name" style={{ fontSize: '18px', fontWeight:"bold"}}>File name</span>
                        </div>
                        {filesToDisplay.map((file, index) =>
                            <div key={index} style={{ border: "2px solid rgba(0, 0, 0, 0.05)", padding: "1px", borderRadius: "5px", marginBottom: "1px", fontSize: "15px", color: "black" }}>
                                <div className="file-info">
                                    <p className="file-info-item-name file-name">
                                        <BsDiagram2 style={{}} /> {file.name}
                                    </p>
                                    <p className={`file-info-item file-name`}>

                                    </p>

                                </div>
                            </div>
                        )}

                        {filesInfo.length > 2 &&
                            <p style={{ display: showAllFiles ? "none" : "block", fontSize:'17px', marginLeft:'0.5cm'}}>... {filesInfo.length - 1} more files.</p>
                        }
                        {filesInfo.length === 2 &&
                            <p style={{ display: showAllFiles ? "none" : "block", fontSize:'17px', marginLeft:'0.5cm'}}>... {filesInfo.length - 1} more file.</p>
                        }
                    </div>
                )}
                {activeTab === 'bpmn-good-modeling-practices' && (
                    <div>
                        {displayMsgGoodModeling ? (
                            <div className="container">
                                <img src="../../img/denied.png" />
                                <p>{displayMsgGoodModeling}</p>
                                <a><a href="" style={{cursor:"pointer"}} onClick={deleteFiles}>Upload Process Collaboration models</a> for inspecting good modeling practices.</a>
                            </div>
                        ) : (
                            <>
                                <a style={{fontSize: "25px", color: "black", alignSelf: "left", fontWeight: "bold",}}>BPMN Good Modeling Practices</a>

                                {displayButton && (
                                    <button style={{backgroundColor: "white", alignSelf: "right", color: "#10ad73", padding: "5px 20px", border: "none", borderBottom: "1px solid #10ad73", cursor: "pointer", right: "0", bottom: "0", fontWeight: "bold", fontSize: "12px",}} onClick={() => setShowAllFiles(!showAllFiles)}>
                                        {showAllFiles ? `Hide list` : `Click here to show all (${filesInfo.length} models)`}
                                    </button>
                                )}
                                <div className="file-info">
                                    <span className="file-info-item-name" style={{ fontSize: "18px", fontWeight: "bold" }}>File name</span>
                                    <span className="file-info-item" style={{ fontSize: '15px', fontWeight:"bold"}}>G1</span>
                                    <span className="file-info-item" style={{ fontSize: '15px', fontWeight:"bold"}}>G2</span>
                                    <span className="file-info-item" style={{ fontSize: '15px', fontWeight:"bold"}}>G3</span>
                                    <span className="file-info-item" style={{ fontSize: '15px', fontWeight:"bold"}}>G4</span>
                                    <span className="file-info-item" style={{ fontSize: '15px', fontWeight:"bold"}}>G5</span>
                                    <span className="file-info-item" style={{ fontSize: '15px', fontWeight:"bold"}}>G6</span>
                                    <span className="file-info-item" style={{ fontSize: '15px', fontWeight:"bold"}}>G7</span>
                                    <span className="file-info-item" style={{ fontSize: '15px', fontWeight:"bold"}}>G8</span>
                                    <span className="file-info-item" style={{ fontSize: '15px', fontWeight:"bold"}}>G9</span>
                                    <span className="file-info-item" style={{ fontSize: '15px', fontWeight:"bold"}}>G10</span>
                                    <span className="file-info-item" style={{ fontSize: '15px', fontWeight:"bold"}}>G11</span>
                                    <span className="file-info-item" style={{ fontSize: '15px', fontWeight:"bold"}}>G12</span>
                                    <span className="file-info-item" style={{ fontSize: '15px', fontWeight:"bold"}}>G13</span>
                                    <span className="file-info-item" style={{ fontSize: '15px', fontWeight:"bold"}}>G14</span>
                                    <span className="file-info-item" style={{ fontSize: '15px', fontWeight:"bold"}}>G15</span>
                                    <span className="file-info-item" style={{ fontSize: '15px', fontWeight:"bold"}}>G16</span>
                                    <span className="file-info-item" style={{ fontSize: '15px', fontWeight:"bold"}}>G17</span>
                                    <span className="file-info-item" style={{ fontSize: '15px', fontWeight:"bold"}}>G18</span>
                                    <span className="file-info-item" style={{ fontSize: '15px', fontWeight:"bold"}}>G19</span>
                                    <span className="file-info-item" style={{ fontSize: '15px', fontWeight:"bold"}}>G20</span>
                                    <span className="file-info-item" style={{ fontSize: '15px', fontWeight:"bold"}}>G21</span>
                                    <span className="file-info-item" style={{ fontSize: '15px', fontWeight:"bold"}}>G22</span>
                                    <span className="file-info-item" style={{ fontSize: '15px', fontWeight:"bold"}}>G23</span>
                                    <span className="file-info-item" style={{ fontSize: '15px', fontWeight:"bold"}}>G24</span>
                                    <span className="file-info-item" style={{ fontSize: '15px', fontWeight:"bold"}}>G25</span>
                                    <span className="file-info-item" style={{ fontSize: '15px', fontWeight:"bold"}}>G26</span>
                                    <span className="file-info-item" style={{ fontSize: '15px', fontWeight:"bold"}}>G27</span>
                                    <span className="file-info-item" style={{ fontSize: '15px', fontWeight:"bold"}}>G28</span>
                                    <span className="file-info-item" style={{ fontSize: '15px', fontWeight:"bold"}}>G29</span>
                                    <span className="file-info-item" style={{ fontSize: '15px', fontWeight:"bold"}}>G30</span>
                                </div>

                                {filesToDisplay.filter(file => file.modelType === "Process Collaboration").map((file, index) => (
                                    <div key={index} style={{border: "2px solid rgba(0, 0, 0, 0.05)", padding: "1px", borderRadius: "5px", marginBottom: "1px", fontSize: "15px", color: "black"}}>
                                        <div className="file-info">
                                            <p className="file-info-item-name file-name">
                                                <BsDiagram2 style={{}} /> {file.name}
                                            </p>
                                            <p className={`file-info-item file-name`}>
                                              <span className={`badge badge-pill ${file.isDuplicated ? "badge-danger" : "badge-success"}`}>
                                                {file.isDuplicated ? (<AiFillExclamationCircle />) : (<GiConfirmed />)}
                                              </span>
                                            </p>
                                        </div>
                                    </div>
                                ))}


                                {filesInfo.length > 2 &&
                                    <p style={{ display: showAllFiles ? "none" : "block", fontSize:'17px', marginLeft:'0.5cm'}}>... {filesInfo.length - 1} more files.</p>
                                }
                                {filesInfo.length === 2 &&
                                    <p style={{ display: showAllFiles ? "none" : "block", fontSize:'17px', marginLeft:'0.5cm'}}>... {filesInfo.length - 1} more file.</p>
                                }
                            </>
                        )}
                    </div>

                )}
               </div>

            <input style={{position: 'fixed', marginBottom:'20px', marginRight:'20px', backgroundColor: 'red', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer', right: '0', bottom: '0'}} onClick={deleteFiles} type="submit" value="Reset"/>

        </div>
    );
}



