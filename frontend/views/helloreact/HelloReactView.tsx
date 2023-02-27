import { Notification } from '@hilla/react-components/Notification.js';
import { TextField } from '@hilla/react-components/TextField.js';
import {Checkbox} from "@hilla/react-components/Checkbox.js";
import {VAADIN_CSRF_HEADER} from "@hilla/frontend/CsrfUtils";
import React, {ReactDOM, memo, useState, useEffect} from "react";
import "./uploadtemplate.css";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {Provider, KeepAlive,} from 'react-keep-alive';
import '@vaadin/icon';
import '@vaadin/icons';
import '@vaadin/vertical-layout';
import '@vaadin/tabs';
import {BsDiagram2} from "react-icons/bs";


export default function HelloReactView() {
    const [name, setName] = useState('')
    const [duplicate, setDuplicate] = useState('')
    const [invalid, setInvalid] = useState('')
    const [nonEnglish, setNonEnglish] = useState('')
    const [showHome, setShowHome] = React.useState(true)
    const [showResults, setShowResults] = React.useState(false)

    let selectedFile: any = null;
    const [show, setShow] = useState(true)
    const [uploadedFiles, setUploadedFiles] = useState<any[]>([])


    // Stampo i files
    const Results = () => {
        const [filesInfo, setFilesInfo] = useState<Array<filesInfo>>([]);
        const [showAllFiles, setShowAllFiles] = useState<boolean>(false);

        interface filesInfo {
            name: string;
            size: number;
        }

        useEffect(() => {
            axios({
                method: "get",
                url: "/files",
                headers: { "Content-Type": 'text/event-stream'}
            }).then((response) => {
                setFilesInfo(response.data);
                console.log(response.data)
            });
        }, []);

        async function deleteFiles() {
            try {
                await axios.delete('/deleteAllFiles');
                toast.success('All files deleted successfully!', {
                    position: "bottom-center",
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
        let displayButton = filesInfo.length >= 10;

        return (
            <>
                <div className="flex flex-col h-full items-left justify-left p-l text-left box-border">
                    <a style={{fontSize:'40px',color:'black',alignSelf:'left',fontWeight:"bold"}}>List of BPMN Models Uploaded</a>
                    <a style={{fontSize:'20px',color:'black',alignSelf:'left', marginBottom:'5px'}}>You have uploaded {filesInfo.length} models:</a>

                    {displayButton && (
                        <button style={{backgroundColor: 'white', color: '#10ad73', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer', right: '0', bottom: '0' }} onClick={() => setShowAllFiles(!showAllFiles)}>
                            {showAllFiles ? `Hide` : `Show all (${filesInfo.length} models)`}
                        </button>
                    )}

                    {filesToDisplay.map((file, index) =>
                            file ? (
                                <div key={index} style={{ border: "2px solid rgba(0, 0, 0, 0.05)", padding: "1px", borderRadius: "5px", marginBottom: "1px", fontSize: "15px", color: "black" }}>
                                    <p>
                                        <BsDiagram2 style={{ marginTop: "1px" }} /> {file.name} {file.size} kb
                                    </p>
                                </div>
                            ) : (
                                <div key={index} style={{ border: "none", padding: "1px", marginBottom: "1px", fontSize: "15px", color: "black" }}>
                                    {index === 1 && !showAllFiles && (
                                        <p style={{fontSize: "15px", color: "black" }}>
                                            ... {filesInfo.length - 1} more files
                                        </p>
                                    )}
                                </div>
                            )
                        )}

                        <section className="p-m gap-m items-end">
                            <h3>Filtering options:</h3>
                            <Checkbox value='0' label='Remove Duplicate models'/>
                            <br/>
                            <Checkbox value='1' label='Remove Invalid models'/>
                            <br/>
                            <Checkbox value='2' label='Remove non-English models' disabled checked/>
                            <br/>

                            <input style={{background:'#10ad73', color: 'white', fontSize: '20px', padding: '10px 40px', borderRadius: '5px', border: 'none', cursor: 'pointer', marginTop: '0.42cm'}} type="submit" value="Inspect"/>
                            <input style={{position: 'fixed', marginBottom:'20px', marginRight:'20px', backgroundColor: 'red', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer', right: '0', bottom: '0'}} onClick={deleteFiles} type="submit" value="Home"/>

                        </section>
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
            if(getExtension(selectedFile[0].name).toLowerCase() !== "zip" && getExtension(selectedFile[0].name).toLowerCase() !== "xml" && getExtension(selectedFile[0].name).toLowerCase() !== "bpmn") {
               // @ts-ignore
                console.log(getExtension(selectedFile[0].name).toLowerCase())
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

            console.log(selectedFile)
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

        return (
            <div className="flex flex-col h-full items-left justify-left p-l text-left box-border">

                <a style={{fontSize:'40px',color:'black',alignSelf:'center',fontWeight:"bold"}}>BPMN Models Inspector</a>
                <a style={{fontSize:'20px',color:'black',alignSelf:'center'}}>Upload one or more .bpmn, .xml or .zip files.</a>
                <div className="form-container">
                <section className="flex flex-col h-full items-center p-l text-center box-border" style={{
                    cursor: "pointer",
                    borderStyle: "solid",
                    marginLeft: "10%",
                    marginRight: "10%",
                    marginTop: "2em",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "300px",
                    border: "4px dashed #10ad73",
                    padding: "10em",
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                }}>


                    <div className="image-container">
                        <svg className="float-svg-end"></svg>
                        <svg className="float-svg-xor"></svg>
                        <svg className="float-svg-interMsg"></svg>
                        <svg className="float-svg-endT"></svg>
                        <svg className="float-svg-data"></svg>
                    </div>


                    <form encType={"multipart/form-data"} onSubmit={onClick}>
                        <input style={{background:'white', width:'300px', color: '#10ad73', fontSize: '20px', padding: '1px 1px', borderRadius: '5px', border: 'none', cursor: 'pointer', marginTop: '0.42cm'}}
                               type="file" name="file" id="file" onChange={handleFileSelect} multiple/>
                        <br/>
                        <input style={{background:'#10ad73',textDecorationStyle:'dashed', color: 'white', fontSize: '20px', padding: '10px 40px', borderRadius: '5px', border: 'none', cursor: 'pointer', marginTop: '0.42cm'}}
                               type="submit" value="Upload models"/>
                    </form>
                </section>
            </div>
                <a style={{fontSize:'15px',color:'black',fontStyle:"italic",marginTop:'1cm'}}>Note: Any files uploaded that are not in the .bpmn or .xml format will be automatically deleted.</a>

            </div>

        )
    }
    //
    //{ showResults ? <Results /> : null }
    return (
        <>
            { showHome ? <Home /> : null }
            { showResults ? <Results /> : null }
        </>
    );
}