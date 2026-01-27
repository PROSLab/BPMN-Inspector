import { Checkbox } from "@hilla/react-components/Checkbox.js";
import { VAADIN_CSRF_HEADER } from "@hilla/frontend/CsrfUtils";
import React, { ReactDOM, memo, useState, useEffect, ReactNode } from "react";
import "./uploadtemplate.css";
import "./fileList.css";
import axios from 'axios';
import "axios-progress-bar/dist/nprogress.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '@vaadin/vaadin-lumo-styles/badge.js'
import '@vaadin/tabs';
import { Slide } from 'react-slideshow-image';
import { BsDiagram2 } from "react-icons/bs";
import { GrDocumentCsv, GrDocumentDownload } from "react-icons/gr";
import { HiDocumentSearch } from "react-icons/hi";
import '@polymer/polymer/lib/elements/custom-style.js';
import '@polymer/polymer/lib/elements/custom-style.js';
import { CheckboxGroup } from "@hilla/react-components/CheckboxGroup.js";
import { Link, RouterProvider } from "react-router-dom";
import KeepAlive, { AliveScope } from 'react-activation'
import { Router, Route } from 'react-router-dom';
import { loader } from "react-global-loader";
import { AiFillExclamationCircle } from "react-icons/ai";
import { GiConfirmed } from "react-icons/gi";
import bpmnDesk from "../../img/bpmnDesk.svg"
import uploadImg from "../../img/filtering.gif"
import filterImg from "../../img/filter.gif"
import inspect1Img from "../../img/validate.gif"
import inspect2Img from "../../img/inspection.gif"

export default function HelloReactView() {
    const [activeTab, setActiveTab] = useState('filtering');
    const [tabIndex, setTabIndex] = useState(0);
    const [showHome, setShowHome] = React.useState(true)
    const [showResults, setShowResults] = React.useState(false)
    const [filteredData, setFilteredData] = useState<string[]>([]);
    let filteringArray: any[] = [];
    const [show, setShow] = useState(true)
    const [uploadedFiles, setUploadedFiles] = useState<any[]>([])
    const [selectedFile, setSelectedFile] = useState<any>(null);

    const filterCollection = () => {

        const checkboxes = document.querySelectorAll<HTMLInputElement>('input[type="checkbox"]');

        checkboxes.forEach((checkbox) => {
            if (checkbox.checked) {
                // @ts-ignore
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
            const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/zip' }));
            const link = document.createElement('a');
            link.href = url;
            document.body.appendChild(link);
            link.click();
            loader.hide();
        }).catch(error => {
            console.log(error);
        });

        filteringArray.fill("");
    };

    // Stampo i files
    const Results = () => {
        const [filesInfo, setFilesInfo] = useState<Array<filesInfo>>([]);
        const [showAllFiles, setShowAllFiles] = useState<boolean>(false);

        interface filesInfo {
            bpmnModeler: string;
            name: string;
            size: number;
            isValid: boolean;
            isDuplicated: boolean;
            isEnglish: string;
            modelType: string
            elementMap: any;
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
        }, [filteringArray]);

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

        const { valid, invalid } = filesInfo.reduce((counts, file) => {
            if (file.isValid) {
                counts.valid++;
            } else {
                counts.invalid++;
            }
            return counts;
        }, { valid: 0, invalid: 0 });

        const totalDuplicated = filesInfo.reduce((counts, file) => {
            if (file.isDuplicated) {
                counts.totalDuplicated++;
            }
            return counts;
        }, { totalDuplicated: 0 });

        const { totalProcess, totalChoreography, totalConversation } = filesInfo.reduce((counts, file) => {
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
        }, { totalProcess: 0, totalChoreography: 0, totalConversation: 0 });

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

        return (
            <>
                <div className="flex flex-col h-full items-left justify-left p-l text-left box-border">
                    <a style={{ fontSize: '40px', color: 'black', alignSelf: 'left', fontWeight: "bold" }}>Preview of BPMN Models Uploaded</a>
                    <a style={{ fontSize: '20px', color: 'black', alignSelf: 'left' }}>You have uploaded <a style={{ color: 'green', fontWeight: "bold" }}>{filesInfo.length}</a> models. The collection contains <a style={{ color: 'red', fontWeight: "bold" }}>{invalid}</a> invalids and <a style={{ color: 'red', fontWeight: "bold" }}>{totalDuplicated.totalDuplicated}</a> duplicated models.</a>
                    <a style={{ fontSize: '20px', color: 'black', alignSelf: 'left', marginBottom: '0.5cm' }}>The collection is composed by: Process Collaboration <a style={{ color: 'green', fontWeight: "bold" }}>{totalProcess}</a>, Choreography <a style={{ color: 'green', fontWeight: "bold" }}>{totalChoreography}</a>, Conversation <a style={{ color: 'green', fontWeight: "bold" }}>{totalConversation}</a>.</a>

                    {displayButton && (
                        <button style={{ backgroundColor: 'white', color: 'rgb(16, 173, 115)', padding: '5px 20px', border: 'none', borderBottom: '1px solid rgb(16, 173, 115)', cursor: 'pointer', right: '0', bottom: '0', fontWeight: "bold", fontSize: '12px' }} onClick={() => setShowAllFiles(!showAllFiles)}>
                            {showAllFiles ? `Hide list` : `Click here to show all (${filesInfo.length} models)`}
                        </button>
                    )}

                    <div className="file-info" >
                        <span className="file-info-item-name" style={{ fontSize: '15px', fontWeight: "bold" }}>File name</span>
                        <span className="file-info-item" style={{ fontSize: '15px', fontWeight: "bold" }}>Modeler</span>
                        <span className="file-info-item" style={{ fontSize: '15px', fontWeight: "bold" }}>Model Type</span>
                        <span className="file-info-item" style={{ fontSize: '15px', fontWeight: "bold" }}>Validation</span>
                        <span className="file-info-item" style={{ fontSize: '15px', fontWeight: "bold" }}>Duplicated</span>
                        <span className="file-info-item" style={{ fontSize: '15px', fontWeight: "bold" }}>Language</span>
                        <span className="file-info-item" style={{ fontSize: '15px', fontWeight: "bold" }}>File size</span>
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
                        <p style={{ display: showAllFiles ? "none" : "block", fontSize: '17px', marginLeft: '0.5cm' }}>... {filesInfo.length - 1} more files.</p>
                    }
                    {filesInfo.length === 2 &&
                        <p style={{ display: showAllFiles ? "none" : "block", fontSize: '17px', marginLeft: '0.5cm' }}>... {filesInfo.length - 1} more file.</p>
                    }
                    <div>
                        <p style={{ fontSize: '20px', marginTop: "2%", color: 'black', fontWeight: "bold", marginBottom: '0.4em' }}>Filtering options <a style={{ fontSize: '14px', padding: "1px", color: 'black', fontStyle: "italic", fontWeight: "normal" }}>(Select a filtering constraint to inspect or download the models.)</a>
                        </p>
                        <div style={{ display: 'flex' }}>
                            <div style={{ marginRight: '20px', width: "25%" }}>
                                <p style={{ fontSize: '16px', marginBottom: '0.2em' }}>Filter by model features:</p>
                                <CheckboxGroup
                                    theme=''
                                    onValueChanged={({ detail: { value } }: { detail: { value: any } }) => console.log(value)}

                                >
                                    <div style={{ flexDirection: 'column' }}>
                                        <Checkbox value='duplicated' label='Remove Duplicate models' name="checkbox1" />
                                        <Checkbox value='invalid' label='Remove Invalid models' name="checkbox2" />
                                        <Checkbox value='english' label='Remove non-English models' name="checkbox3" />
                                    </div>
                                </CheckboxGroup>
                            </div>
                            <div style={{ width: "30%" }}>
                                <p style={{ fontSize: '16px', marginBottom: '0.2em' }}>Filter by model type:</p>
                                <CheckboxGroup
                                    theme=''
                                    onValueChanged={({ detail: { value } }: { detail: { value: any } }) => console.log(value)}
                                >
                                    <Checkbox value='process' label='Remove Process Collaboration models' name="checkbox4" />
                                    <Checkbox value='choreography' label='Remove Choreography models' name="checkbox5" />
                                    <Checkbox value='conversation' label='Remove Conversation models' name="checkbox6" />
                                </CheckboxGroup>
                            </div>
                        </div>

                        <Link to="/inspect" state={{ data: filteringArray }} >
                            <button style={{ background: 'rgb(16, 173, 115)', color: 'white', fontSize: '20px', padding: '10px 30px', borderRadius: '5px', border: 'none', cursor: 'pointer', marginTop: '2%', marginBottom: '0.42cm' }} onClick={inspectionPage}>
                                <HiDocumentSearch /><a style={{ color: 'white', fontSize: '20px', padding: '10px 10px', cursor: 'pointer', marginTop: '0.42cm', fontStyle: "italic" }}>Filter & Inspect</a>
                            </button>
                        </Link>
                        <button style={{ background: 'rgb(232,194,48)', color: 'white', fontSize: '20px', padding: '10px 30px', borderRadius: '5px', border: 'none', cursor: 'pointer', marginTop: '0.42cm', marginLeft: '1%', marginBottom: '0.42cm' }} onClick={filterCollection}>
                            <GrDocumentDownload /><a style={{ color: 'black', fontSize: '20px', padding: '10px 10px', cursor: 'pointer', marginTop: '0.42cm', fontStyle: "italic" }}>Filter & Download</a>
                        </button>
                        <input style={{ position: 'absolute', top: "8px", right: "42px", zIndex: '9', fontSize: "17px", backgroundColor: 'white', color: 'red', fontWeight: "bold", padding: '5px 13px', border: '2px solid red', borderRadius: '3px', cursor: 'pointer' }} onClick={deleteFiles} type="submit" value="🕵️ Start a new inspection" />
                    </div>
                </div>
            </>
        );
    }

    const Home = () => {
        const downloadTestModels = () => {
            axios({
                url: '/download-test-models',
                method: 'GET',
                responseType: 'blob',
            }).then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'testModels.zip');
                document.body.appendChild(link);
                link.click();
            });
        };

        const onClick = async (e: any) => {
            e.preventDefault()
            if (selectedFile === null) {
                toast.error('Insert at least one file!', {
                    position: "bottom-left",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                });
                return;
            }
            if (getExtension(selectedFile[0].name).toLowerCase() !== "zip" && getExtension(selectedFile[0].name).toLowerCase() !== "xml" && getExtension(selectedFile[0].name).toLowerCase() !== "bpmn") {
                toast.error('Insert at least one .bpmn, .xml or .zip!', {
                    position: "bottom-left",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                });
                return;
            }

            const formData = new FormData();
            Array.from(selectedFile).forEach((file: any) => {
                formData.append("file", file);
            });

            try {
                await axios({
                    method: "post",
                    url: "/upload",
                    data: formData,
                    headers: { "Content-Type": "multipart/form-data" },
                });
                setShowHome(false)
                setShowResults(true)
                toast.success('File uploaded successfully!', {
                    position: "bottom-left",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                });
            } catch (error) {
                setShowHome(true)
                setShowResults(false)
            }
            return;
        }

        const handleFileSelect = (event: any) => {
            setSelectedFile(event.target.files);
        }

        function getExtension(filename: string) {
            return filename.split('.').pop()
        }

        return (
            <div className="flex flex-col h-full bg-white text-gray-800" style={{ overflowX: 'hidden' }}>
                <div className="content-container mx-auto w-full flex flex-col items-center">
                    {/* Header Section */}
                    <div className="flex flex-col items-center justify-center pt-s pb-m px-m text-center w-full">
                        <h1 className="text-3xl font-bold mb-xs mt-0" style={{ color: 'black' }}>BPMN Inspector</h1>
                        <p className="text-lg text-gray-600">
                            Upload one or more .bpmn, .xml or .zip files.
                        </p>
                    </div>

                    {/* Main Content */}
                    <div className="flex flex-col lg:flex-row w-full gap-xl items-center lg:items-start pb-xl px-m">

                        {/* Left Side: Upload Area */}
                        <div className="flex-1 w-full flex flex-col items-center justify-center">
                            <section className="upload-area glass-panel flex flex-col items-center justify-center p-xl rounded-2xl w-full" style={{ minHeight: '420px', position: 'relative' }}>
                                <div className="image-container pointer-events-none opacity-20 absolute inset-0">
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

                                <form encType="multipart/form-data" onSubmit={onClick} className="flex flex-col items-center z-10 w-full max-w-sm">
                                    <div className="p-m bg-white/80 rounded-xl mb-m border border-gray-200 shadow-sm w-full flex flex-col items-center gap-m">
                                        <div className="text-gray-400 mb-s">
                                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                                        </div>
                                        <input
                                            type="file"
                                            name="file"
                                            id="file"
                                            onChange={handleFileSelect}
                                            multiple
                                            className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold hover:file:bg-gray-100 cursor-pointer w-full"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="bg-green-600 hover:bg-green-700 text-white text-xl font-bold py-3 px-12 rounded-xl transition-all shadow-lg active:transform active:translate-y-1 w-full"
                                        style={{ background: 'rgb(16, 173, 115)' }}
                                    >
                                        Upload models
                                    </button>
                                </form>
                            </section>
                            <p className="text-sm text-gray-500 italic mt-m text-center max-w-sm">
                                Note: Files not in the .bpmn or .xml format will be automatically deleted.
                            </p>
                        </div>

                        {/* Right Side: Slideshow/Tabs Area */}
                        <div className="flex-1 w-full flex flex-col">
                            <div className="glass-panel p-xl rounded-2xl w-full shadow-sm" style={{ minHeight: '420px' }}>
                                <ul className="nav nav-tabs nav-fill mb-l" style={{ display: 'flex', listStyle: 'none', padding: 0, borderBottom: '1px solid #dee2e6' }}>
                                    <li className="nav-item" style={{ flex: 1, textAlign: 'center' }}>
                                        <button
                                            onClick={(e) => { e.preventDefault(); setActiveTab('filtering'); }}
                                            className={`nav-link w-full py-3 font-bold transition-all ${activeTab === 'filtering' ? 'active' : 'text-gray-400'}`}
                                            style={{ color: activeTab === 'filtering' ? 'rgb(16, 173, 115)' : '#6c757d', background: 'transparent', border: 'none', cursor: 'pointer', borderBottom: activeTab === 'filtering' ? '3px solid rgb(16, 173, 115)' : '3px solid transparent' }}
                                        >
                                            Upload Models
                                        </button>
                                    </li>
                                    <li className="nav-item" style={{ flex: 1, textAlign: 'center' }}>
                                        <button
                                            onClick={(e) => { e.preventDefault(); setActiveTab('inspection'); }}
                                            className={`nav-link w-full py-3 font-bold transition-all ${activeTab === 'inspection' ? 'active' : ''}`}
                                            style={{ color: activeTab === 'inspection' ? 'rgb(16, 173, 115)' : '#6c757d', background: 'transparent', border: 'none', cursor: 'pointer', borderBottom: activeTab === 'inspection' ? '3px solid rgb(16, 173, 115)' : '3px solid transparent' }}
                                        >
                                            Filter Models
                                        </button>
                                    </li>
                                    <li className="nav-item" style={{ flex: 1, textAlign: 'center' }}>
                                        <button
                                            onClick={(e) => { e.preventDefault(); setActiveTab('validation'); }}
                                            className={`nav-link w-full py-3 font-bold transition-all ${activeTab === 'validation' ? 'active' : ''}`}
                                            style={{ color: activeTab === 'validation' ? 'rgb(16, 173, 115)' : '#6c757d', background: 'transparent', border: 'none', cursor: 'pointer', borderBottom: activeTab === 'validation' ? '3px solid rgb(16, 173, 115)' : '3px solid transparent' }}
                                        >
                                            Inspect Models
                                        </button>
                                    </li>
                                </ul>

                                <div className="flex flex-col items-center justify-center text-center p-m" style={{ minHeight: '220px' }}>
                                    {activeTab === 'filtering' && (
                                        <div className="flex flex-col items-center animate-fadeIn">
                                            <img src={uploadImg} alt="Upload" width="120" height="120" className="mb-m" />
                                            <p className="text-xl font-bold text-gray-800">
                                                1. <span style={{ color: "#a5b8da" }}>Upload</span> a collection of BPMN models.
                                            </p>
                                        </div>
                                    )}
                                    {activeTab === 'inspection' && (
                                        <div className="flex flex-col items-center animate-fadeIn">
                                            <img src={filterImg} alt="Filter" width="120" height="120" className="mb-m" />
                                            <p className="text-xl font-bold text-gray-800">
                                                2. <span style={{ color: "#c0b777" }}>Filter</span> the collection of BPMN models.
                                            </p>
                                        </div>
                                    )}
                                    {activeTab === 'validation' && (
                                        <div className="flex flex-col items-center animate-fadeIn">
                                            <div className="flex gap-m mb-m items-center">
                                                <img src={inspect1Img} alt="Inspect 1" width="110" height="110" />
                                                <img src={inspect2Img} alt="Inspect 2" width="120" height="120" />
                                            </div>
                                            <p className="text-xl font-bold text-gray-800">
                                                3. <span style={{ color: "#cba991" }}>Inspect</span> the collection of BPMN models.
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-xl p-m bg-gray-50/80 rounded-xl flex items-center justify-center text-center border border-gray-100">
                                    <span className="text-sm text-gray-600">
                                        No models to test? Download an example collection
                                        <button
                                            onClick={downloadTestModels}
                                            className="mx-1 font-bold underline decoration-dotted underline-offset-4"
                                            style={{ background: 'transparent', border: 'none', padding: 0, color: 'rgb(16, 173, 115)' }}
                                        >
                                            here
                                        </button>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    //{ showResults ? <Results /> : null }
    //{ showHome ? <Home /> : null }
    return (
        <>
            {showResults ? <Results /> : null}
            {showHome ? <Home /> : null}
        </>
    );
}

