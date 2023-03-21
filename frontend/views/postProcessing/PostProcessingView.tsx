import React, {useEffect, useState} from "react";
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
import {GrDocumentCsv} from "react-icons/gr";

interface filesInfoFiltered {
    name: string;
    size: number;
    isValid: boolean;
    isDuplicated: boolean;
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
    }

    console.log(data)

    useEffect(() => {
        loader.show();
        axios({
            method: "post",
            url: "/files",
            data: data,
        }).then((response) => {
            setFilesInfo(response.data);
            console.log(response.data)
            loader.hide();
        });
    }, []);

    async function deleteFiles() {
        try {
            await axios.delete('/deleteAllFiles');
            toast.success('All files deleted successfully!', {
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

    return (

        <div className="flex flex-col h-full items-left justify-left p-l text-left box-border">
            <a style={{fontSize:'40px',color:'black',fontWeight:"bold"}}>BPMN Models inspected</a>
            <a style={{fontSize:'20px',color:'black',alignSelf:'left',marginBottom:'0.5cm'}}>
                <a style={{color:'green',fontWeight:"bold"}}>{total}</a> models have been inspected. <a style={{fontSize:'20px',color:'black',alignSelf:'left',marginBottom:'0.5cm'}}>The collection inspected is composed by the following process types: Process Collaboration <a style={{color:'green',fontWeight:"bold"}}>{totalProcess}</a>, Choreography <a style={{color:'green',fontWeight:"bold"}}>{totalChoreography}</a>, Conversation <a style={{color:'green',fontWeight:"bold"}}>{totalConversation}</a>.</a>

                <br></br> <a style={{marginRight:'10px'}}>Active filters:</a>
                {data[0] || data[1] ? (
                    <>

                        {data[0] && <span className='badge bg-success'>{"   "+data[0]}</span>}
                        {data[0] && data[1] && " "}
                        {data[1] && <span className='badge bg-success'>{data[1]}</span>}

                    </>
                ) : (
                    <span className='badge bg-secondary'>No filter</span>
                )}

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
            </ul>

            <div className="tab-content">
                {activeTab === 'bpmn-element-usage' && (
                            <div className="col">
                                <div>
                                    <a style={{fontSize:'25px',color:'black',alignSelf:'left',fontWeight:"bold", display: "block"}}>1. BPMN Collection's Model Size</a>
                                    <a>This is a graph of the average model size of the collection</a>
                                </div>
                                <LineChart options={{responsive:false, height: '10%', width:'50%',maintainAspectRatio:false}}/>
                            </div>
                )}
                {activeTab === 'bpmn-element-combined-use' && (
                    <div>
                        <a style={{fontSize:'25px',color:'black',alignSelf:'left',fontWeight:"bold"}}>BPMN Element Combined use</a>
                        <div style={{display:'flex'}}>

                            <ChartVenn options={{responsive:false, height: '10%', width:'30%',maintainAspectRatio:false}}/>
                            <ChartVenn options={{responsive:false, height: '10%', width:'30%',maintainAspectRatio:false}}/>
                            <ChartVenn options={{responsive:false, height: '10%', width:'30%',maintainAspectRatio:false}}/>

                        </div>
                    </div>
                )}
                {activeTab === 'bpmn-syntactic-validation' && (
                    <div>
                        <a style={{fontSize:'25px',color:'black',alignSelf:'left',fontWeight:"bold"}}>BPMN Syntactic Validation</a>
                        <div style={{display:'flex'}}>

                            <BarChart options={{responsive:false, height: '20%', width:'30%',maintainAspectRatio:false}}></BarChart>
                            <PieChart ></PieChart>


                        </div>
                    </div>
                )}
                {activeTab === 'bpmn-good-modeling-practices' && (
                    <div>
                        <a style={{fontSize:'25px',color:'black',alignSelf:'left',fontWeight:"bold"}}>BPMN Good Modeling Practices</a>
                        <div style={{display:'flex'}}>

                            {displayButton && (
                                <button style={{ backgroundColor: 'white', color: '#10ad73', padding: '5px 20px', border: 'none', borderBottom: '1px solid #10ad73', cursor: 'pointer', right: '0', bottom: '0', fontWeight: "bold", fontSize:'12px' }} onClick={() => setShowAllFiles(!showAllFiles)}>
                                    {showAllFiles ? `Hide list` : `Click here to show all (${filesInfo.length} models)`}
                                </button>
                            )}


                        </div>
                        <div className="file-info" >
                            <span className="file-info-item-name" style={{ fontSize: '18px', fontWeight:"bold"}}>File name</span>
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
                            {filesToDisplay.map((file, index) =>
                                <div key={index} style={{ border: "2px solid rgba(0, 0, 0, 0.05)", padding: "1px", borderRadius: "5px", marginBottom: "1px", fontSize: "15px", color: "black" }}>
                                    <div className="file-info">
                                        <p className="file-info-item-name file-name">
                                            <BsDiagram2 style={{}} /> {file.name}
                                        </p>
                                        <p className={`file-info-item file-name`}>
                                        <span className={`badge badge-pill badge-success ${file.isDuplicated ? 'Invalid' : 'Valid'}`} >
                                            {file.isDuplicated ? <AiFillExclamationCircle></AiFillExclamationCircle> : <GiConfirmed></GiConfirmed>}
                                        </span>
                                            <span className={`badge badge-pill badge-success ${file.isDuplicated ? 'Invalid' : 'Valid'}`} >
                                            {file.isDuplicated ? <AiFillExclamationCircle></AiFillExclamationCircle> : <GiConfirmed></GiConfirmed>}
                                        </span>
                                            <span className={`badge badge-pill badge-success ${file.isDuplicated ? 'Invalid' : 'Valid'}`} >
                                            {file.isDuplicated ? <AiFillExclamationCircle></AiFillExclamationCircle> : <GiConfirmed></GiConfirmed>}
                                        </span>
                                            <span className={`badge badge-pill badge-success ${file.isDuplicated ? 'Invalid' : 'Valid'}`} >
                                            {file.isDuplicated ? <AiFillExclamationCircle></AiFillExclamationCircle> : <GiConfirmed></GiConfirmed>}
                                        </span>
                                            <span className={`badge badge-pill badge-success ${file.isDuplicated ? 'Invalid' : 'Valid'}`} >
                                            {file.isDuplicated ? <AiFillExclamationCircle></AiFillExclamationCircle> : <GiConfirmed></GiConfirmed>}
                                        </span>
                                            <span className={`badge badge-pill badge-success ${file.isDuplicated ? 'Invalid' : 'Valid'}`} >
                                            {file.isDuplicated ? <AiFillExclamationCircle></AiFillExclamationCircle> : <GiConfirmed></GiConfirmed>}
                                        </span>
                                            <span className={`badge badge-pill badge-success ${file.isDuplicated ? 'Invalid' : 'Valid'}`} >
                                            {file.isDuplicated ? <AiFillExclamationCircle></AiFillExclamationCircle> : <GiConfirmed></GiConfirmed>}
                                        </span>
                                            <span className={`badge badge-pill badge-success ${file.isDuplicated ? 'Invalid' : 'Valid'}`} >
                                            {file.isDuplicated ? <AiFillExclamationCircle></AiFillExclamationCircle> : <GiConfirmed></GiConfirmed>}
                                        </span>
                                            <span className={`badge badge-pill badge-success ${file.isDuplicated ? 'Invalid' : 'Valid'}`} >
                                            {file.isDuplicated ? <AiFillExclamationCircle></AiFillExclamationCircle> : <GiConfirmed></GiConfirmed>}
                                        </span>
                                            <span className={`badge badge-pill badge-success ${file.isDuplicated ? 'Invalid' : 'Valid'}`} >
                                            {file.isDuplicated ? <AiFillExclamationCircle></AiFillExclamationCircle> : <GiConfirmed></GiConfirmed>}
                                        </span>
                                            <span className={`badge badge-pill badge-success ${file.isDuplicated ? 'Invalid' : 'Valid'}`} >
                                            {file.isDuplicated ? <AiFillExclamationCircle></AiFillExclamationCircle> : <GiConfirmed></GiConfirmed>}
                                        </span>
                                            <span className={`badge badge-pill badge-success ${file.isDuplicated ? 'Invalid' : 'Valid'}`} >
                                            {file.isDuplicated ? <AiFillExclamationCircle></AiFillExclamationCircle> : <GiConfirmed></GiConfirmed>}
                                        </span>
                                            <span className={`badge badge-pill badge-success ${file.isDuplicated ? 'Invalid' : 'Valid'}`} >
                                            {file.isDuplicated ? <AiFillExclamationCircle></AiFillExclamationCircle> : <GiConfirmed></GiConfirmed>}
                                        </span>
                                            <span className={`badge badge-pill badge-success ${file.isDuplicated ? 'Invalid' : 'Valid'}`} >
                                            {file.isDuplicated ? <AiFillExclamationCircle></AiFillExclamationCircle> : <GiConfirmed></GiConfirmed>}
                                        </span>
                                            <span className={`badge badge-pill badge-success ${file.isDuplicated ? 'Invalid' : 'Valid'}`} >
                                            {file.isDuplicated ? <AiFillExclamationCircle></AiFillExclamationCircle> : <GiConfirmed></GiConfirmed>}
                                        </span>
                                            <span className={`badge badge-pill badge-success ${file.isDuplicated ? 'Invalid' : 'Valid'}`} >
                                            {file.isDuplicated ? <AiFillExclamationCircle></AiFillExclamationCircle> : <GiConfirmed></GiConfirmed>}
                                        </span>
                                            <span className={`badge badge-pill badge-success ${file.isDuplicated ? 'Invalid' : 'Valid'}`} >
                                            {file.isDuplicated ? <AiFillExclamationCircle></AiFillExclamationCircle> : <GiConfirmed></GiConfirmed>}
                                        </span>
                                            <span className={`badge badge-pill badge-success ${file.isDuplicated ? 'Invalid' : 'Valid'}`} >
                                            {file.isDuplicated ? <AiFillExclamationCircle></AiFillExclamationCircle> : <GiConfirmed></GiConfirmed>}
                                        </span>
                                            <span className={`badge badge-pill badge-success ${file.isDuplicated ? 'Invalid' : 'Valid'}`} >
                                            {file.isDuplicated ? <AiFillExclamationCircle></AiFillExclamationCircle> : <GiConfirmed></GiConfirmed>}
                                        </span>
                                            <span className={`badge badge-pill badge-success ${file.isDuplicated ? 'Invalid' : 'Valid'}`} >
                                            {file.isDuplicated ? <AiFillExclamationCircle></AiFillExclamationCircle> : <GiConfirmed></GiConfirmed>}
                                        </span>
                                            <span className={`badge badge-pill badge-success ${file.isDuplicated ? 'Invalid' : 'Valid'}`} >
                                            {file.isDuplicated ? <AiFillExclamationCircle></AiFillExclamationCircle> : <GiConfirmed></GiConfirmed>}
                                        </span>
                                            <span className={`badge badge-pill badge-success ${file.isDuplicated ? 'Invalid' : 'Valid'}`} >
                                            {file.isDuplicated ? <AiFillExclamationCircle></AiFillExclamationCircle> : <GiConfirmed></GiConfirmed>}
                                        </span>
                                            <span className={`badge badge-pill badge-success ${file.isDuplicated ? 'Invalid' : 'Valid'}`} >
                                            {file.isDuplicated ? <AiFillExclamationCircle></AiFillExclamationCircle> : <GiConfirmed></GiConfirmed>}
                                        </span>
                                            <span className={`badge badge-pill badge-success ${file.isDuplicated ? 'Invalid' : 'Valid'}`} >
                                            {file.isDuplicated ? <AiFillExclamationCircle></AiFillExclamationCircle> : <GiConfirmed></GiConfirmed>}
                                        </span>
                                            <span className={`badge badge-pill badge-success ${file.isDuplicated ? 'Invalid' : 'Valid'}`} >
                                            {file.isDuplicated ? <AiFillExclamationCircle></AiFillExclamationCircle> : <GiConfirmed></GiConfirmed>}
                                        </span>
                                            <span className={`badge badge-pill badge-success ${file.isDuplicated ? 'Invalid' : 'Valid'}`} >
                                            {file.isDuplicated ? <AiFillExclamationCircle></AiFillExclamationCircle> : <GiConfirmed></GiConfirmed>}
                                        </span>
                                            <span className={`badge badge-pill badge-success ${file.isDuplicated ? 'Invalid' : 'Valid'}`} >
                                            {file.isDuplicated ? <AiFillExclamationCircle></AiFillExclamationCircle> : <GiConfirmed></GiConfirmed>}
                                        </span>
                                            <span className={`badge badge-pill badge-success ${file.isDuplicated ? 'Invalid' : 'Valid'}`} >
                                            {file.isDuplicated ? <AiFillExclamationCircle></AiFillExclamationCircle> : <GiConfirmed></GiConfirmed>}
                                        </span>
                                            <span className={`badge badge-pill badge-success ${file.isDuplicated ? 'Invalid' : 'Valid'}`} >
                                            {file.isDuplicated ? <AiFillExclamationCircle></AiFillExclamationCircle> : <GiConfirmed></GiConfirmed>}
                                        </span>
                                            <span className={`badge badge-pill badge-success ${file.isDuplicated ? 'Invalid' : 'Valid'}`} >
                                            {file.isDuplicated ? <AiFillExclamationCircle></AiFillExclamationCircle> : <GiConfirmed></GiConfirmed>}
                                        </span>
                                            <span className={`badge badge-pill badge-success ${file.isDuplicated ? 'Invalid' : 'Valid'}`} >
                                            {file.isDuplicated ? <AiFillExclamationCircle></AiFillExclamationCircle> : <GiConfirmed></GiConfirmed>}
                                        </span>
                                            <span className={`badge badge-pill badge-success ${file.isDuplicated ? 'Invalid' : 'Valid'}`} >
                                            {file.isDuplicated ? <AiFillExclamationCircle></AiFillExclamationCircle> : <GiConfirmed></GiConfirmed>}
                                        </span>
                                            <span className={`badge badge-pill badge-success ${file.isDuplicated ? 'Invalid' : 'Valid'}`} >
                                            {file.isDuplicated ? <AiFillExclamationCircle></AiFillExclamationCircle> : <GiConfirmed></GiConfirmed>}
                                        </span>
                                            <span className={`badge badge-pill badge-success ${file.isDuplicated ? 'Invalid' : 'Valid'}`} >
                                            {file.isDuplicated ? <AiFillExclamationCircle></AiFillExclamationCircle> : <GiConfirmed></GiConfirmed>}
                                        </span>
                                            <span className={`badge badge-pill badge-success ${file.isDuplicated ? 'Invalid' : 'Valid'}`} >
                                            {file.isDuplicated ? <AiFillExclamationCircle></AiFillExclamationCircle> : <GiConfirmed></GiConfirmed>}
                                        </span>
                                            <span className={`badge badge-pill badge-success ${file.isDuplicated ? 'Invalid' : 'Valid'}`} >
                                            {file.isDuplicated ? <AiFillExclamationCircle></AiFillExclamationCircle> : <GiConfirmed></GiConfirmed>}
                                        </span>
                                            <span className={`badge badge-pill badge-success ${file.isDuplicated ? 'Invalid' : 'Valid'}`} >
                                            {file.isDuplicated ? <AiFillExclamationCircle></AiFillExclamationCircle> : <GiConfirmed></GiConfirmed>}
                                        </span>
                                            <span className={`badge badge-pill badge-success ${file.isDuplicated ? 'Invalid' : 'Valid'}`} >
                                            {file.isDuplicated ? <AiFillExclamationCircle></AiFillExclamationCircle> : <GiConfirmed></GiConfirmed>}
                                        </span>
                                            <span className={`badge badge-pill badge-success ${file.isDuplicated ? 'Invalid' : 'Valid'}`} >
                                            {file.isDuplicated ? <AiFillExclamationCircle></AiFillExclamationCircle> : <GiConfirmed></GiConfirmed>}
                                        </span>
                                            <span className={`badge badge-pill badge-success ${file.isDuplicated ? 'Invalid' : 'Valid'}`} >
                                            {file.isDuplicated ? <AiFillExclamationCircle></AiFillExclamationCircle> : <GiConfirmed></GiConfirmed>}
                                        </span>
                                            <span className={`badge badge-pill badge-success ${file.isDuplicated ? 'Invalid' : 'Valid'}`} >
                                            {file.isDuplicated ? <AiFillExclamationCircle></AiFillExclamationCircle> : <GiConfirmed></GiConfirmed>}
                                        </span>
                                            <span className={`badge badge-pill badge-success ${file.isDuplicated ? 'Invalid' : 'Valid'}`} >
                                            {file.isDuplicated ? <AiFillExclamationCircle></AiFillExclamationCircle> : <GiConfirmed></GiConfirmed>}
                                        </span>
                                            <span className={`badge badge-pill badge-success ${file.isDuplicated ? 'Invalid' : 'Valid'}`} >
                                            {file.isDuplicated ? <AiFillExclamationCircle></AiFillExclamationCircle> : <GiConfirmed></GiConfirmed>}
                                        </span>
                                            <span className={`badge badge-pill badge-success ${file.isDuplicated ? 'Invalid' : 'Valid'}`} >
                                            {file.isDuplicated ? <AiFillExclamationCircle></AiFillExclamationCircle> : <GiConfirmed></GiConfirmed>}
                                        </span>
                                            <span className={`badge badge-pill badge-success ${file.isDuplicated ? 'Invalid' : 'Valid'}`} >
                                            {file.isDuplicated ? <AiFillExclamationCircle></AiFillExclamationCircle> : <GiConfirmed></GiConfirmed>}
                                        </span>
                                            <span className={`badge badge-pill badge-success ${file.isDuplicated ? 'Invalid' : 'Valid'}`} >
                                            {file.isDuplicated ? <AiFillExclamationCircle></AiFillExclamationCircle> : <GiConfirmed></GiConfirmed>}
                                        </span>
                                            <span className={`badge badge-pill badge-success ${file.isDuplicated ? 'Invalid' : 'Valid'}`} >
                                            {file.isDuplicated ? <AiFillExclamationCircle></AiFillExclamationCircle> : <GiConfirmed></GiConfirmed>}
                                        </span>
                                            <span className={`badge badge-pill badge-success ${file.isDuplicated ? 'Invalid' : 'Valid'}`} >
                                            {file.isDuplicated ? <AiFillExclamationCircle></AiFillExclamationCircle> : <GiConfirmed></GiConfirmed>}
                                        </span>
                                            <span className={`badge badge-pill badge-success ${file.isDuplicated ? 'Invalid' : 'Valid'}`} >
                                            {file.isDuplicated ? <AiFillExclamationCircle></AiFillExclamationCircle> : <GiConfirmed></GiConfirmed>}
                                        </span>
                                            <span className={`badge badge-pill badge-success ${file.isDuplicated ? 'Invalid' : 'Valid'}`} >
                                            {file.isDuplicated ? <AiFillExclamationCircle></AiFillExclamationCircle> : <GiConfirmed></GiConfirmed>}
                                        </span>
                                            <span className={`badge badge-pill badge-success ${file.isDuplicated ? 'Invalid' : 'Valid'}`} >
                                            {file.isDuplicated ? <AiFillExclamationCircle></AiFillExclamationCircle> : <GiConfirmed></GiConfirmed>}
                                        </span>
                                            <span className={`badge badge-pill badge-success ${file.isDuplicated ? 'Invalid' : 'Valid'}`} >
                                            {file.isDuplicated ? <AiFillExclamationCircle></AiFillExclamationCircle> : <GiConfirmed></GiConfirmed>}
                                        </span>
                                            <span className={`badge badge-pill badge-success ${file.isDuplicated ? 'Invalid' : 'Valid'}`} >
                                            {file.isDuplicated ? <AiFillExclamationCircle></AiFillExclamationCircle> : <GiConfirmed></GiConfirmed>}
                                        </span>
                                            <span className={`badge badge-pill badge-success ${file.isDuplicated ? 'Invalid' : 'Valid'}`} >
                                            {file.isDuplicated ? <AiFillExclamationCircle></AiFillExclamationCircle> : <GiConfirmed></GiConfirmed>}
                                        </span>
                                            <span className={`badge badge-pill badge-success ${file.isDuplicated ? 'Invalid' : 'Valid'}`} >
                                            {file.isDuplicated ? <AiFillExclamationCircle></AiFillExclamationCircle> : <GiConfirmed></GiConfirmed>}
                                        </span>
                                            <span className={`badge badge-pill badge-success ${file.isDuplicated ? 'Invalid' : 'Valid'}`} >
                                            {file.isDuplicated ? <AiFillExclamationCircle></AiFillExclamationCircle> : <GiConfirmed></GiConfirmed>}
                                        </span>
                                            <span className={`badge badge-pill badge-success ${file.isDuplicated ? 'Invalid' : 'Valid'}`} >
                                            {file.isDuplicated ? <AiFillExclamationCircle></AiFillExclamationCircle> : <GiConfirmed></GiConfirmed>}
                                        </span>

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
               </div>

            <input style={{position: 'fixed', marginBottom:'20px', marginRight:'20px', backgroundColor: 'red', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer', right: '0', bottom: '0'}} onClick={deleteFiles} type="submit" value="Reset"/>

        </div>
    );
}



