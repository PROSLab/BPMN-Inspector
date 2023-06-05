import { useEffect, useState } from "react";
import MarkdownComponent from "Frontend/components/markdownreader/MarkdownComponent";
import axios from "axios";

export default function DocView() {
    const [markdownContent, setMarkdownContent] = useState("");

    useEffect(() => {
        // Effettua la richiesta HTTP per ottenere il contenuto del file README.md
        axios
            .get("https://raw.githubusercontent.com/PROSLab/BPMN-Inspector/master/README.md")
            .then((response) => {
                setMarkdownContent(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    return (
        <div>
            <h1>Contenuto Markdown</h1>
            <MarkdownComponent markdownContent={markdownContent} />
        </div>
    );
}
