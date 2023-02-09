import { Button } from '@hilla/react-components/Button.js';
import { Notification } from '@hilla/react-components/Notification.js';
import { TextField } from '@hilla/react-components/TextField.js';
import { HelloReactEndpoint } from 'Frontend/generated/endpoints';
import { useState } from 'react';
import {Checkbox} from "@hilla/react-components/Checkbox";
import {VAADIN_CSRF_HEADER} from "@hilla/frontend/CsrfUtils";

export default function HelloReactView() {

  const [name, setName] = useState('');


  return (
    <>
      <section className="flex flex-col h-full items-center p-l text-center box-border" style={{cursor: "pointer",borderStyle:"solid",marginLeft:"10%",marginRight:"10%",marginTop:"2em",
          display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",height:"300px",border:"3px dashed rgb(0,0,0)", padding:"10em",}}>
          <form>
              <table>
                  <tr>
                      <h1><td>BPMN Inspector</td></h1>
                      <h2><td>Import BPMN models</td></h2>
                  </tr>
                  <tr>
                      <input type="file" multiple/>
                  </tr>

              </table>
          </form>
      </section>
        <section className="p-m gap-m items-end">
        <h3>Filtering options:</h3>
        <tr>
            <input type="checkbox" id="topping" name="topping" value="Duplicate" /><em>Remove Duplicate models</em>
            <br/>
            <input type="checkbox" id="topping" name="topping" value="Invalid" /><em>Remove Invalid models</em>
            <br/>
            <input type="checkbox" id="topping" name="topping" value="nonEnglish" /><em>Remove non-English models</em>
            <br/>
            <Button style={{marginTop: "30px",}} onClick={() => {
                alert('clicked');
            }}>
                <em>Inspect!</em>
            </Button>
        </tr>
        </section>
    </>
  );
}
