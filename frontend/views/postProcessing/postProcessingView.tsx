import React from "react";
import axios from "axios";

// @ts-ignore
export default function postProcessingView({ data }) {
    return (
        <div className="flex flex-col h-full items-left justify-left p-l text-left box-border">
            <h1>Dati elaborati:</h1>
            <ul>
                {data.map((item: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal | null | undefined) => (
                    <li>{item}</li>
                ))}
            </ul>
        </div>
    );
}

export async function getServerSideProps() {
    const response = await axios.post("/process-filtered-models", ["dato1", "dato2"]);

    return {
        props: {
            data: response.data,
        },
    };
}