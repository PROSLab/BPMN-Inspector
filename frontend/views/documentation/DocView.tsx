
export default function DocView() {
    return (
        <div className="flex flex-col h-full items-left justify-left p-l text-left box-border">
            <h2> Documentation </h2>
            <p>BPMN Inspector is a Java tool that supports static analysis of BPMN 2.0 process models. BPMN Inspector is able to detect and distinguish up to 267 different graphical BPMN elements and other characteristics related to BPMN models.</p>
            <p>The java application takes as input one or a set of BPMN models (.bpmn) and returns a comma-separated value (.<em>csv</em>) or a (.<em>json</em>) file containing for each analyzed model: </p>
            <div className="bi bi-github"><a className="bi bi-github" href="https://github.com/PROSLab/BPMN-Inspector">GitHub source code</a></div>
        </div>
    );
}
