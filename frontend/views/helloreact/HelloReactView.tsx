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
      <section className="flex p-m gap-m items-end">
          <form>
              <table>
                  <tr>
                      <h3><td>Import BPMN models</td></h3>
                  </tr>
                  <tr>
                      <input type="file" multiple/>
                  </tr>
              </table>
          </form>

        <TextField
          label="Test"
          onValueChanged={(e) => {
            setName(e.detail.value);
          }}
        />
        <Button
          onClick={async () => {
            const serverResponse = await HelloReactEndpoint.sayHello(name);
            Notification.show(serverResponse);
          }}
        >
          Test
        </Button>

      </section>
    </>
  );
}
