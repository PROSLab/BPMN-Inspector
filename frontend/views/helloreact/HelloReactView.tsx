import { Notification } from '@hilla/react-components/Notification.js';
import { TextField } from '@hilla/react-components/TextField.js';
import { HelloReactEndpoint } from 'Frontend/generated/endpoints';
import {Checkbox} from "@hilla/react-components/Checkbox";
import {VAADIN_CSRF_HEADER} from "@hilla/frontend/CsrfUtils";
import React, { useState } from "react";

export default function HelloReactView() {

    // @ts-ignore
    return (
        <>
            <section className="flex flex-col h-full items-center p-l text-center box-border" style={{cursor: "pointer",borderStyle:"solid",marginLeft:"10%",marginRight:"10%",marginTop:"2em",
                display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",height:"300px",border:"3px dashed rgb(0,0,0)", padding:"10em",}}>
                    <tr>

                        <h1><td>BPMN Inspector</td></h1>
                        <h4><td>Import BPMN models</td></h4>

                    </tr>
                <form method="POST" action="/upload" encType={"multipart/form-data"}>
                    <input type="file" name="file" multiple />
                    <input type="submit" value="Inspect!" style={{color:"green",cursor:"pointer"}}/>
                </form>
                    <tr>

                    </tr>
            </section>
            <section className="p-m gap-m items-end">
                <h3>Filtering options:</h3>
                <tr>
                    <input type="checkbox" id="duplicate" name="duplicate" value="Duplicate" /><em>Remove Duplicate models</em>
                    <br/>
                    <input type="checkbox" id="invalid" name="invalid" value="Invalid" /><em>Remove Invalid models</em>
                    <br/>
                    <input type="checkbox" id="nonEnglish" name="nonEnglish" value="nonEnglish" disabled checked/><em><del>Remove non-English models</del></em>
                    <br/>
                </tr>



            </section>
        </>
    );
}