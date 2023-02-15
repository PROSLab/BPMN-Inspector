import { Notification } from '@hilla/react-components/Notification.js';
import { TextField } from '@hilla/react-components/TextField.js';
import {Checkbox} from "@hilla/react-components/Checkbox.js";
import {VAADIN_CSRF_HEADER} from "@hilla/frontend/CsrfUtils";
import React, {ReactDOM, useState} from "react";
import { Button } from '@hilla/react-components/Button.js';
import axios from 'axios';
import {ConfirmDialog} from "@hilla/react-components/ConfirmDialog";

export default function HelloReactView() {
    const [name, setName] = useState('');
    const [duplicate, setDuplicate] = useState('');
    const [invalid, setInvalid] = useState('');
    const [nonEnglish, setNonEnglish] = useState('');
    const [showResults, setShowResults] = React.useState(true)
    let selectedFile: any = null;

    const Results = () => {
        const onClick = async (e: any) => {
            setShowResults(false)
            e.preventDefault()

            const formData = new FormData();

            if(selectedFile == null) {
                alert("Please insert a file!")
                return
            }

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
                console.log(error)
            }
    }
        const handleFileSelect = (event: any) => {
            const files = event.target.files
            selectedFile = files
        }

        return (
            <div id={"container"}>
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
                    border: "3px dashed rgb(0,0,0)",
                    padding: "10em",
                }}>
                    <tr>

                        <h1>
                            <td>BPMN Inspector</td>
                        </h1>
                        <h4>
                            <td>Import BPMN models</td>
                        </h4>

                    </tr>
                    <form encType={"multipart/form-data"} onSubmit={onClick}>
                        <input type="file" name="file" id="file" onChange={handleFileSelect} multiple/>
                        <input type="submit" value="Inspect!" style={{color: "green", cursor: "pointer"}}/>
                    </form>
                    <tr>
                        <div id="TestsDiv" style={{display: "none"}}>
                            tests here!
                        </div>
                    </tr>
                </section>

                <section className="p-m gap-m items-end">
                    <h3>Filtering options:</h3>
                    <tr>

                        <Checkbox value='0' label='Remove Duplicate models'/>
                        <br/>
                        <Checkbox value='1' label='Remove Invalid models'/>
                        <br/>
                        <Checkbox value='2' label='Remove non-English models' disabled checked
                        />
                        <br/>
                    </tr>

                </section>
            </div>
        )
    }
    // { showResults ? <Results /> : null }
    return (
        <>

            <Results />


        </>
    );
}