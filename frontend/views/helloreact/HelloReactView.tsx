import {Checkbox} from "@hilla/react-components/Checkbox.js";
import {VAADIN_CSRF_HEADER} from "@hilla/frontend/CsrfUtils";
import React, {ReactDOM, memo, useState, useEffect, ReactNode} from "react";
import "./uploadtemplate.css";
import "./fileList.css";
import axios from 'axios';
import "axios-progress-bar/dist/nprogress.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '@vaadin/vaadin-lumo-styles/badge.js'
import '@vaadin/tabs';
import { Slide } from 'react-slideshow-image';
import {BsDiagram2} from "react-icons/bs";
import {GrDocumentCsv, GrDocumentDownload} from "react-icons/gr";
import {HiDocumentSearch} from "react-icons/hi";
import '@polymer/polymer/lib/elements/custom-style.js';
import '@polymer/polymer/lib/elements/custom-style.js';
import {CheckboxGroup} from "@hilla/react-components/CheckboxGroup.js";
import {Link, RouterProvider} from "react-router-dom";
import KeepAlive, {AliveScope} from 'react-activation'
import { Router, Route } from 'react-router-dom';
import {loader} from "react-global-loader";
import {AiFillExclamationCircle} from "react-icons/ai";
import {GiConfirmed} from "react-icons/gi";
import {Tab, Tabs} from "react-bootstrap";
import {CiCircleQuestion} from "react-icons/ci";
import {FaRegImage} from "react-icons/fa";
import {Line} from "react-chartjs-2";
import {BiDownArrowAlt, BiUpArrowAlt} from "react-icons/all";


export default function HelloReactView() {
    const [activeTab, setActiveTab] = useState('filtering');
    const [showHome, setShowHome] = React.useState(true)
    const [showResults, setShowResults] = React.useState(false)
    const [filteredData, setFilteredData] = useState<string[]>([]);
    const filteringArray: string[] = [];
    const [show, setShow] = useState(true)
    const [uploadedFiles, setUploadedFiles] = useState<any[]>([])
    let selectedFile: any = null;


    const filterCollection = () => {

        const checkboxes = document.querySelectorAll<HTMLInputElement>('input[type="checkbox"]');

        checkboxes.forEach((checkbox) => {
            if (checkbox.checked) {
                filteringArray.push(checkbox.value);
            }
        });

        loader.show();
        axios({
            method: "post",
            url: '/download-filtered-models',
            data: filteringArray,
            responseType: 'blob',
        }).then(response => {
            const url = window.URL.createObjectURL(new Blob([response.data], {type: 'application/zip'}));
            const link = document.createElement('a');
            link.href = url;
            document.body.appendChild(link);
            link.click();
            loader.hide();
        }).catch(error => {
            console.log(error);
        });
    };

    // Stampo i files
    const Results = () => {
        const [filesInfo, setFilesInfo] = useState<Array<filesInfo>>([]);
        const [showAllFiles, setShowAllFiles] = useState<boolean>(false);

        interface filesInfo {
            name: string;
            size: number;
            isValid: boolean;
            isDuplicated: boolean;
            isEnglish: string;
            modelType: string
        }

        useEffect(() => {

            loader.show();
            axios({
                method: "post",
                url: "/files",
                data: filteringArray,
            }).then((response) => {
                setFilesInfo(response.data);
                loader.hide();
            });
        }, []);

        const inspectionPage = () => {
            const checkboxes = document.querySelectorAll<HTMLInputElement>('input[type="checkbox"]');

            checkboxes.forEach((checkbox) => {
                if (checkbox.checked) {
                    filteringArray.push(checkbox.value);
                }
            });

            loader.show();
            axios({
                url: '/postProcessingView',
                method: 'POST',
                data: filteringArray,
            }).then((response) => {
                loader.hide();
            });
        }
        async function deleteFiles() {
            try {
                await axios.delete('/deleteAllFiles');
                toast.success('All files deleted successfully!', {
                    position: "bottom-right",
                    autoClose: 1000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                });
                setUploadedFiles([]);
                setShowHome(true)
                setShowResults(false)
            } catch (error) {
                console.error(error);
            }
        }

        let filesToDisplay = showAllFiles ? filesInfo : filesInfo.slice(0, 1);
        let displayButton = filesInfo.length > 1;

        const {valid, invalid} = filesInfo.reduce((counts, file) => {
            if (file.isValid) {
                counts.valid++;
            } else {
                counts.invalid++;
            }
            return counts;
        }, {valid: 0, invalid: 0});

        const totalDuplicated = filesInfo.reduce((counts, file) => {
            if (file.isDuplicated) {
                counts.totalDuplicated++;
            }
            return counts;
        }, { totalDuplicated: 0});

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

        // @ts-ignore
        return (
            <>
                <div className="flex flex-col h-full items-left justify-left p-l text-left box-border">
                    <a style={{fontSize:'40px',color:'black',alignSelf:'left',fontWeight:"bold"}}>Preview of BPMN Models Uploaded</a>
                    <a style={{fontSize:'20px',color:'black',alignSelf:'left'}}>You have uploaded <a style={{color:'green',fontWeight:"bold"}}>{filesInfo.length}</a> models. The collection contains <a style={{color:'red',fontWeight:"bold"}}>{invalid}</a> invalids and <a style={{color:'red',fontWeight:"bold"}}>{totalDuplicated.totalDuplicated}</a> duplicated models.</a>
                    <a style={{fontSize:'20px',color:'black',alignSelf:'left',marginBottom:'0.5cm'}}>The collection is composed by: Process Collaboration <a style={{color:'green',fontWeight:"bold"}}>{totalProcess}</a>, Choreography <a style={{color:'green',fontWeight:"bold"}}>{totalChoreography}</a>, Conversation <a style={{color:'green',fontWeight:"bold"}}>{totalConversation}</a>.</a>

                    {displayButton && (
                        <button style={{ backgroundColor: 'white', color: '#10ad73', padding: '5px 20px', border: 'none', borderBottom: '1px solid #10ad73', cursor: 'pointer', right: '0', bottom: '0', fontWeight: "bold", fontSize:'12px' }} onClick={() => setShowAllFiles(!showAllFiles)}>
                            {showAllFiles ? `Hide list` : `Click here to show all (${filesInfo.length} models)`}
                        </button>
                    )}

                    <div className="file-info" >
                        <span className="file-info-item-name" style={{ fontSize: '15px', fontWeight:"bold"}}>File name</span>
                        <span className="file-info-item" style={{ fontSize: '15px', fontWeight:"bold"}}>Model Type</span>
                        <span className="file-info-item" style={{ fontSize: '15px', fontWeight:"bold"}}>Validation</span>
                        <span className="file-info-item" style={{ fontSize: '15px', fontWeight:"bold"}}>Duplicated</span>
                        <span className="file-info-item" style={{ fontSize: '15px', fontWeight:"bold"}}>Model Language</span>
                        <span className="file-info-item" style={{ fontSize: '15px', fontWeight:"bold"}}>File size</span>

                    </div>

                    {filesToDisplay.map((file, index) =>
                            <div key={index} style={{ border: "2px solid rgba(0, 0, 0, 0.05)", padding: "1px", borderRadius: "5px", marginBottom: "1px", fontSize: "15px", color: "black" }}>
                                <div className="file-info">
                                    <p className="file-info-item-name file-name">
                                        <BsDiagram2 /> {file.name}
                                    </p>
                                    <p className="file-info-item file-name">
                                        {file.modelType}
                                    </p>
                                    <p className={`file-info-item file-name`}>
                                        <span className={`badge badge-pill badge-success ${file.isValid ? 'Valid' : 'Invalid'}`} >{file.isValid ? "Valid" : "Invalid"}</span>
                                    </p>
                                    <p className={`file-info-item file-name`}>
                                       <span className={`badge badge-pill badge-success ${file.isDuplicated ? 'Invalid' : 'Valid'}`} >
                                          {file.isDuplicated ? <AiFillExclamationCircle></AiFillExclamationCircle> : <GiConfirmed></GiConfirmed>}
                                       </span>
                                    </p>
                                    <p className="file-info-item file-name">
                                        {file.isEnglish}
                                    </p>
                                    <p className="file-info-item file-name">
                                        {file.size} kb
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
                    <div>
                           <p style={{fontSize:'20px',color:'black',alignSelf:'left',fontWeight:"bold",justifySelf:"left", marginBottom:'0.4em'}}>Filtering options:</p>

                            <CheckboxGroup
                                theme=''
                                onValueChanged={({ detail: { value } }) => console.log(value)}
                            >
                                <Checkbox value='duplicated' label='Remove Duplicate models' name="checkbox1" />
                                <br/>
                                <Checkbox value='invalid' label='Remove Invalid models' name="checkbox2" />
                                <br/>
                                <Checkbox value='english' label='Remove non-English models' name="checkbox3"/>
                                <br/>
                            </CheckboxGroup>

                        <br></br>
                        <Link to="/inspect" state={{data: filteringArray}} >
                            <button style={{background:'#10ad73', color: 'white', fontSize: '20px', padding: '10px 30px', borderRadius: '5px', border: 'none', cursor: 'pointer', marginTop: '0.42cm', marginBottom:'0.42cm'}} onClick={inspectionPage}>
                                <HiDocumentSearch /><a style={{background:'#10ad73', color: 'white', fontSize: '20px', padding: '10px 10px', cursor: 'pointer', marginTop: '0.42cm',fontStyle:"italic"}}>Inspect!</a>
                            </button>
                        </Link>
                        <button style={{marginLeft:'2%',background:'white', borderBottom: "1px #10ad73", color: '#10ad73', fontSize: '14px', padding: '10px 10px', cursor: 'pointer', marginTop: '0.42cm'}} onClick={filterCollection}>
                            <GrDocumentDownload /><a style={{marginRight: '0.5em', color:'#10ad73',marginLeft:'8px'}}>Filter collection</a>
                        </button>
                        <button style={{marginLeft:'2%',background:'white', borderBottom: "1px #10ad73", color: '#10ad73', fontSize: '14px', padding: '10px 10px', cursor: 'pointer', marginTop: '0.42cm'}} onClick={downloadFile}>
                            <GrDocumentCsv /><a style={{marginRight: '0.5em', color:'#10ad73',marginLeft:'8px'}}>Validation report</a>
                        </button>
                        <button style={{marginLeft:'2%',background:'white', borderBottom: "1px #10ad73", color: '#10ad73', fontSize: '14px', padding: '10px 10px', cursor: 'pointer', marginTop: '0.42cm'}} onClick={downloadInspectionFile}>
                            <GrDocumentCsv /><a style={{marginRight: '0.5em', color:'#10ad73',marginLeft:'8px'}}>Inspection report</a>
                        </button>
                        <input style={{position: 'fixed', marginBottom:'20px', marginRight:'20px', backgroundColor: 'red', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer', right: '0', bottom: '0'}} onClick={deleteFiles} type="submit" value="Home"/>
                        </div>
                    </div>
                </>
            );
        }

    const Home = () => {
        const onClick = async (e: any) => {

            e.preventDefault()
            if(selectedFile === null) {
                return toast.error('Insert at least one file!', {
                    position: "bottom-left",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                });
            }
                // @ts-ignore
            if (getExtension(selectedFile[0].name).toLowerCase() !== "zip" && getExtension(selectedFile[0].name).toLowerCase() !== "xml" && getExtension(selectedFile[0].name).toLowerCase() !== "bpmn") {

                return toast.error('Insert at least one .bpmn, .xml or .zip!', {
                    position: "bottom-left",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                });
                }

            const formData = new FormData();
            Array.from(selectedFile).forEach((file: any) => {
                formData.append("file", file);
            });

            try {
                const response = await axios({
                    method: "post",
                    url: "/upload",
                    data: formData,
                    headers: { "Content-Type": "multipart/form-data" },
                });

            } catch(error) {
                setShowHome(true)
                setShowResults(false)
            }
            setShowHome(false)
            setShowResults(true)
            return toast.success('File uploaded succesfully!', {
                position: "bottom-left",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
    }
        const handleFileSelect = (event: any) => {
            const files = event.target.files
            selectedFile = files
        }

        function getExtension(filename: string) {
            return filename.split('.').pop()
        }

        const spanStyle = {
            padding: '20px',
            background: '#efefef',
            color: '#000000'
        }

        const divStyle = {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundSize: 'cover',
            height: '400px'
        }

        const slideTexts = [
            {
                title: 'Prima slide',
                text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
                icon: 'fa fa-check'
            },
            {
                title: 'Seconda slide',
                text: 'Praesent et lorem ac nisi lobortis commodo non ac quam.',
                icon: 'fa fa-star'
            },
            {
                title: 'Terza slide',
                text: 'Donec nec purus sed neque fermentum feugiat. ',
                icon: 'fa fa-heart'
            }
        ]

        const iconStyle = {
            fontSize: '48px',
            marginBottom: '16px'
        };


        return (
            <div style={{display: "flex", flexDirection: "row", height: "100%"}}>
                <div style={{flexDirection:"column"}} className="flex h-full items-left justify-left p-l text-left box-border">
                    <div>
                        <a style={{fontSize:'40px',color:'black',marginLeft: "8%",fontWeight:"bold"}}>BPMN Models Inspector</a>
                        <br />
                        <a style={{fontSize:'20px',color:'black',marginLeft: "11%"}}>Upload one or more .bpmn, .xml or .zip files.</a>
                        <div className="form-container">
                            <section className="flex flex-col h-full items-center p-l text-center box-border" style={{
                                cursor: "pointer",
                                borderStyle: "solid",
                                marginLeft: "3%",
                                marginRight: "60%",
                                marginTop: "2em",
                                marginBottom: "10px",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                                height: "380px",
                                width: "500px",
                                border: "4px dashed #10ad73",
                                padding: "10em",
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: 'center',
                            }}>
                                <div className="image-container">
                                    <svg className="float-svg-data"></svg>
                                    <svg className="float-svg-dataStore"></svg>
                                    <svg className="float-svg-end"></svg>
                                    <svg className="float-svg-endError"></svg>
                                    <svg className="float-svg-endMessage"></svg>
                                    <svg className="float-svg-endTerminate"></svg>
                                    <svg className="float-svg-interMsg"></svg>
                                    <svg className="float-svg-intThrowEscalation"></svg>
                                    <svg className="float-svg-intCatchTimer"></svg>
                                    <svg className="float-svg-parallelGateway"></svg>
                                    <svg className="float-svg-startSignal"></svg>
                                    <svg className="float-svg-task"></svg>
                                    <svg className="float-svg-xorGateway"></svg>
                                </div>
                                <form encType={"multipart/form-data"} onSubmit={onClick}>
                                    <input style={{background:'white', width:'200px', color: '#10ad73', fontSize: '15px', padding: '1px 1px', borderRadius: '5px', border: 'none', cursor: 'pointer', marginTop: '0.42cm'}}
                                           type="file" name="file" id="file" onChange={handleFileSelect} multiple/>
                                    <br/>
                                    <input style={{background:'#10ad73',textDecorationStyle:'dashed', color: 'white', fontSize: '20px', padding: '10px 40px', borderRadius: '5px', border: 'none', cursor: 'pointer', marginTop: '0.42cm'}} type="submit" value="Upload models"/>
                                </form>
                            </section>
                            <a style={{fontSize:'14px',marginLeft: "7%",color:'black',fontStyle:"italic",marginTop:'4cm',padding:"10px" }}>Note: Files not in the .bpmn or .xml format will be automatically deleted.</a>
                        </div>
                    </div>
                </div>
                <div style={{width:"100%",marginLeft:"80px",marginRight:"80px", marginTop:"160px"}}>
                    <br />
                    <ul className="nav nav-tabs nav-fill">
                        <li className="nav-item" style={{padding: '5px 20px',fontWeight:"bold", cursor: 'pointer', fontSize:'15px',width:"30%" }}>
                            <a
                                className={`nav-link ${activeTab === 'filtering' ? 'active' : ''}`}
                                onClick={(e) => {e.preventDefault(); setActiveTab('filtering');}}
                                style={{ color: '#10ad73'}}>
                                Filter Models
                            </a>
                        </li>
                        <li className="nav-item" style={{padding: '5px 20px',fontWeight:"bold", cursor: 'pointer', fontSize:'15px',width:"30%" }}>    <a
                                className={`nav-link ${activeTab === 'inspection' ? 'active' : ''}`}
                                onClick={(e) => {e.preventDefault(); setActiveTab('inspection');}}
                                style={{color: '#10ad73'}}>
                                Inspect Models
                            </a>
                        </li>
                        <li className="nav-item" style={{padding: '5px 20px',fontWeight:"bold", cursor: 'pointer', fontSize:'15px',width:"30%" }}>    <a
                                className={`nav-link ${activeTab === 'validation' ? 'active' : ''}`}
                                onClick={(e) => {e.preventDefault(); setActiveTab('validation');}}
                                style={{color: '#10ad73'}}>
                                Validate Models
                            </a>
                        </li>
                    </ul>

                    {activeTab === 'filtering' && (
                        <>
                            TEST 1


                        </>

                    )}
                    {activeTab === 'inspection' && (
                        <>
                            TEST 2


                        </>

                    )}
                    {activeTab === 'validation' && (
                        <>
                            TEST 3


                        </>

                    )}
                </div>
            </div>


                    )
    }

    //{ showResults ? <Results /> : null }
    //{ showHome ? <Home /> : null }
    return (
        <>
            { showResults ? <Results /> : null }
            { showHome ? <Home /> : null }
        </>
    );
}

