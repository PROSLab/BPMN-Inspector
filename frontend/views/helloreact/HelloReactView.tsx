import { Notification } from '@hilla/react-components/Notification.js';
import { TextField } from '@hilla/react-components/TextField.js';
import {Checkbox} from "@hilla/react-components/Checkbox.js";
import {VAADIN_CSRF_HEADER} from "@hilla/frontend/CsrfUtils";
import React, {ReactDOM, useState} from "react";
import { Button } from '@hilla/react-components/Button.js';
import axios from 'axios';
import {ConfirmDialog} from "@hilla/react-components/ConfirmDialog";
import { applyTheme } from 'Frontend/generated/theme';
import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import '@vaadin/icon';
import '@vaadin/icons';
import '@vaadin/vertical-layout';
import {Link} from "react-router-dom";

export default function HelloReactView() {
    const [name, setName] = useState('');
    const [duplicate, setDuplicate] = useState('');
    const [invalid, setInvalid] = useState('');
    const [nonEnglish, setNonEnglish] = useState('');
    const [showHome, setShowHome] = React.useState(true)
    const [showResults, setShowResults] = React.useState(false)
    let selectedFile: any = null;

    // Stampo i files
    const Results = () => {
            // Se codice di errore 200, allora mostra la pagina dei risultati

            return (
                <div className="flex flex-col h-full items-left justify-left p-l text-left box-border">
                    <Link to="/">Home!</Link>
                    <h1>BPMN Models Inspected!</h1>
                </div>
            );
        }

    const Home = () => {
        const onClick = async (e: any) => {

            e.preventDefault()

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
                alert(error)
                setShowHome(true)
                setShowResults(false)
            }
            setShowHome(false)
           setShowResults(true)
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
    //
    //
    return (
        <>
            { showHome ? <Home /> : null }
            { showResults ? <Results /> : null }

        </>
    );
}