import React, {ReactNode, useEffect, useRef, useState} from "react";
import axios from "axios";
import { useLocation } from 'react-router-dom';
import "./postCss.css";
import {toast} from "react-toastify";
import { Chart, registerables } from 'chart.js';
import '@vaadin/vaadin-lumo-styles/badge.js'
import xmlLogo from "Frontend/img/xmlLogo.png"
import VennChart from 'Frontend/components/charts/VennChart';
import zingchart from "zingchart";
// @ts-ignore
import ChartVenn from "Frontend/components/charts/ChartVenn";
import {BsDiagram2} from "react-icons/bs";
import {GiConfirmed} from "react-icons/gi";
import {AiFillExclamationCircle} from "react-icons/ai";
import {GrDocumentCsv, GrDocumentDownload} from "react-icons/gr";
import {Bar, Line, Radar} from "react-chartjs-2";
import { CiCircleQuestion } from "react-icons/ci";
import {FaCircle, FaRegImage} from "react-icons/fa";
import html2canvas from 'html2canvas';
import {loader} from "react-global-loader";
import {extractSets, VennDiagramChart} from "chartjs-chart-venn";

interface filesInfoFiltered {
    name: string;
    size: number;
    isValid: boolean;
    isDuplicated: boolean;
    isEnglish: string;
    elementMap: Map<string, number>;
    guidelineMap: Map<string, string>;
    errorLog: string;
}
export default function PostProcessingView() {
    const [activeTab, setActiveTab] = useState('bpmn-element-usage');
    const [selectedItemIndex, setSelectedItemIndex] = useState(-1);
    const [dataSets, setDataSets] = useState<Data[]>([]);
    const g = [        'G2',        'G3',        'G7',        'G8',        'G9',        'G10',        'G11',        'G12',
        'G13',        'G14',        'G15',        'G16',        'G17',        'G18',        'G19',        'G20',
        'G21',        'G22',        'G24',        'G26',        'G28',        'G29',        'G30',        'G31',
        'G32',        'G33',        'G34',        'G35',        'G36',        'G37',        'G38',        'G39',
        'G42',        'G44',        'G45',        'G46',        'G47',        'G48',        'G49',        'G50'    ];
    const [activeButton, setActiveButton] = React.useState(null);
    const descriptions = [
        { title: 'Minimize model size', description: 'The designer should create models which comply with the BPMN standard. Once the\n' +
                'process logic has been defined, the designer should validate a model ensuring that the\n' +
                'model is syntactically correct.' },
        { title: 'Apply hierarchical structure with sub-processes', description: ' The designer should try to keep models as small as possible. Large models tend to contain\n' +
                'more errors. Additionally they are difficult to read and comprehend. Defining the correct\n' +
                'scope of tasks and level of detail of models is the key to reduce the overage of information.' },
        { title: 'Model loops via loop activities', description: 'The designer should model a loop via activity looping (with the loop marker) instead of\n' +
                'using a sequence flow looping; this, where possible, and if this practice actually contributes\n' +
                'to simplify the model.' },
        { title: 'Provide activity descriptions', description: 'The designer should provide a brief description for each activity in the model.' },
        { title: 'Minimize gateway heterogeneity', description: 'The designer should minimize the heterogeneity of gateway types. The use of several\n' +
                'type of gateway may cause confusion.' },
        { title: 'Use pools consistently', description: 'The designer should define as many pools as processes and/or participants. Use a blackbox pool to represent external participant/processes. The modelled pools need to be\n' +
                'in relation with each other and have to be linked to the main pool through message\n' +
                'exchange.' },
        { title: 'Use lanes consistently', description: 'The designer should model internal organisational units as lanes within a single process\n' +
                'pool, not as separate pools; separate pools imply independent processes. The designer\n' +
                'should create a lane, in a pool, only if at least one activity or intermediate event is\n' +
                'performed in it.\n' },
        { title: ' Use start and end ' +
                'events explicitly', description: 'The designer should explicitly make use of start and end events. The use of start and end\n' +
                'events is necessary to represent the different states that begin and complete the modeled\n' +
                'process. Processes with implicit start and end events are undesirable and could lead to\n' +
                'misinterpretations.' },
        { title: 'Use start events consistently', description: 'The designer should include, in the model, only one start event. Where necessary, alternative instantiations of the process should be depicted with separate start events and\n' +
                'using a event-based start gateway' },
        { title: 'Use end events consistently', description: 'The designer should distinguish success and failure end states in a process or a subprocess\n' +
                'with separate end events. Flows that end in the same end state should be merged to the\n' +
                'same end event. Therefore, separate end events that do not represent distinct end states\n' +
                'must be merged in a single end event.' },
        { title: 'Restrict usage of terminate end event', description: 'The designer should use terminate events only when strictly necessary. They are used to\n' +
                'model situations where several alternative paths are enabled and the entire process have\n' +
                'to be finished when one of them is completed. The designer should use other end events\n' +
                'rather than the terminate end event (e.g. a generic end event), to guarantee that the\n' +
                'executions of the reaming process paths or activities will not be stopped.' },
        { title: 'Use explicit gateways', description: 'The designer should split or join sequence flows always using gateways. The designer\n' +
                'should not split or join flows using activities or events. This includes that an activity can\n' +
                'have only one incoming sequence flow and only one outgoing sequence flow.' },
        { title: 'Mark exclusive gateways', description: 'The designer should use the Exclusive Gateway with the marker “X” instead of using it\n' +
                'without marker.' },
        { title: 'Split and join flows consistently', description: 'The designer should not use gateways to join and split at the same time.' },
        { title: 'Balance gateways', description: 'The designer should always use the same type of gateway for splitting and joining the\n' +
                'flow. In particular, the designer should ensure that join parallel gateways have the correct number of incoming sequence flows especially when used in conjunction with other\n' +
                'gateways; this is related to ensuring the soundness property. Do not apply this guidelines\n' +
                'on Event-based or Complex Gateways.' },
        { title: 'Use meaningful gateways', description: 'The designer should not represent gateways that have only one incoming and only one\n' +
                'outgoing sequence flow. Gateways with only one incoming and one outgoing sequence\n' +
                'flow do not provide any added value.' },
        { title: 'Minimize inclusive\n' +
                'OR gateways', description: 'The designer should minimise the use of inclusive gateways (OR). Inclusive OR-splits\n' +
                'activate one, several, or all subsequent branches based on conditions. They need to be\n' +
                'synchronized with inclusive OR-join elements, which are difficult to understand in the\n' +
                'general case.' },
        { title: 'Use default flows', description: 'Where possible, after an exclusive and an inclusive gateway, the designer should express\n' +
                'the default flow. One way for the modeler to ensure that the process does not get stuck\n' +
                'at a gateway is to use a default condition for one of the outgoing sequence flow. This\n' +
                'default sequence flow will always evaluate to true if all the other sequence flow conditions\n' +
                'turn out to be false.' },
        { title: 'Use message flows', description: ' The designer should represent message flows for each message events and send or receive\n' +
                'tasks. If in a subprocess are present more message flows to the same pool, the designer\n' +
                'should show in the top-level process maximum two message flows: one for all outgoing\n' +
                'message flow and one for all incoming message flow with that pool.' },
        { title: 'Document minor details', description: 'The designer should leave details to documentation keeping labels simple and limiting\n' +
                'the use of text annotations.' },
        { title: 'Labelling pools', description: 'The designer should label pools using the participants name. An exception can be done\n' +
                'for the main pool: it can be labeled using the process name. If a pool is present in a\n' +
                'subprocess, the name of the pool must be the same of the upper-level process pool which\n' +
                'includes the subprocess activity. This means that the pool of the upper-level process and\n' +
                'the pool of the subprocess needs to be the same.' },
        { title: 'Labelling lanes', description: 'The designer should always assign a label to lanes. The label should identify the responsible entity for the process. Lanes are often used for representing things as internal roles\n' +
                '(e.g., manager, associate), systems (e.g., an enterprise application), or internal departments (e.g., shipping, finance).' },
        { title: 'Labelling activities', description: 'The designer should label activities with one verb, and one object. The verb used should\n' +
                'use the present tense and be familiar to the organisation. The object has to be qualified\n' +
                'and also of meaning to the business. The designer should not label multiple activities\n' +
                'with the same name, except for same Call Activities used many time in the process. Send\n' +
                'and receive verbs should be present only for sending and receiving activities.\n' },
        { title: 'Labelling events', description: 'The designer should model all events with a label representing the state of the process.' },
        { title: 'Labelling start and\n' +
                'end events', description: 'The designer should not label start untyped and end untyped event if there is only one\n' +
                'instance of them. The designer should use labeling when multiple start and end events\n' +
                'are used. Label them according to what they represent using a noun. Do not repeat\n' +
                'names.' },
        { title: 'Labelling message\n' +
                'events\n', description: 'The designer should draw a message flow whenever he uses a message event, and he\n' +
                'should label the event. When a focus on the message itself is required, the designer can\n' +
                'represent a message icon and label it with the name of the message.' },
        { title: 'Labelling XOR gateways', description: 'The designer should label XOR split gateways with an interrogative phrase (do not label\n' +
                'XOR join-gateways). Sequence flows coming out of diverging gateways should be labeled\n' +
                'using their associated conditions stated as outcomes.' },
        { title: 'Labelling AND gateways', description: 'The designer should omit labels on AND-splits and joins (and sequence flows connecting\n' +
                'them); they add no new information, so it is best to omit them.\n' },
        { title: 'Labelling converging\n' +
                'gateways', description: 'The designer should not label converging gateways. When the convergence logic is not\n' +
                'obvious, the designer should associate a text annotation to the gateway.' },
        { title: 'Labelling data object', description: 'The designer should label data objects using a qualified noun that is the name of a business object. The designer should label multiple instances of the same data object (which\n' +
                'are really data object references) using a matching label followed by the applicable state\n' +
                'in square brackets.' },
        { title: 'Labelling synchronised end/split', description: 'The designer should use gateways and subprocesses consistently. The designer should\n' +
                'match the labels of subprocess end states with the labels of a gateway immediately following the subprocess; this allows to have a clear vision on how subprocess and process\n' +
                'are linked together.' },
        { title: 'Include loop marker\n' +
                'annotations', description: 'The designer should associate a text annotation to a loop represented with a loop marker\n' +
                'so to express the condition (which alternatively is hidden).' },
        { title: 'Use sub-processes\n' +
                'to scope attached\n' +
                'events', description: 'The designer should use a sub-process with attached event to clearly define the scope\n' +
                'of an event. If the response to the handling of an exception (in the use of boundary\n' +
                'events) is the same for every activity within a contiguous segment of the process, the\n' +
                'designer should not attach the same boundary event to all the activities and he should\n' +
                'not represent the same exception flows multiple times. The correct way, the designer\n' +
                'should model it, is to enclose that segment in a subprocess and attach a single boundary\n' +
                'event to the sub-process boundary.' },
        { title: 'Avoid overlapping elements\n', description: 'The designer should avoid overlapping, or crossing, BPMN elements.' },
        { title: 'Use linear sequence\n' +
                'flows', description: 'The designer should use linear sequence flows without useless foldings; it helps to maintain\n' +
                'the model clear' },
        { title: 'Use linear message\n' +
                'flows\n', description: 'The designer should use linear message flows without useless foldings; it helps to maintain\n' +
                'the model clear.' },
        { title: 'Use a consistent process orientation', description: 'The designer should draw pools horizontally and use consistent layout with horizontal\n' +
                'sequence flows, and vertical message flows and associations.' },
        { title: 'Organize artifacts\n' +
                'flows', description: 'The designer should group artifacts flows, if there are several artifacts. The designer\n' +
                'should pick a point on the boundary of an activity and have all the flows connected to\n' +
                'that point. If there are multiple flows for the same artifact, the designer should group\n' +
                'the flows.' },
        { title: 'Associate data objects consistently', description: 'The designer should associate data objects only to activities. In particular the designer\n' +
                'should not associate a data object with a sequence flow if the sequence flow is connected\n' +
                'to a gateway. The designer should always model the association with a direction.\n' },
        { title: 'Keep a standard format', description: 'The designer should keep a unique format along diagrams and focus on a clean and\n' +
                'friendly look and feel. Using different font sizes, colours, boxes sizes or overlapping labels\n' +
                'might make the diagrams reading a challenge. The designer should not model further\n' +
                'properties with different colours, in order to make diagrams recognisable.' },
    ];
    const location = useLocation()
    const filteringArray: string[] = [];
    const {data} = location.state
    Chart.register(...registerables);
    const [correlationData, setCorrelationData] = useState<CorrelationPair[]>([]);
    const [filesInfo, setFilesInfo] = useState<Array<filesInfo>>([]);
    const [filesInfoFiltered, setFilesInfoFiltered] = useState<Array<filesInfoFiltered>>([]);
    const [showAllFiles, setShowAllFiles] = useState<boolean>(true);
    let displayButton = filesInfo.length > 1;
    let filesToDisplay = showAllFiles ? filesInfo : filesInfo.slice(0, 1);
    interface filesInfo {
        errorLog: string;
        modelType: string;
        name: string;
        size: number;
        isValid: boolean;
        isEnglish: string;
        isDuplicated: boolean;
        elementMap: Map<string, number>;
        guidelineMap: Map<string, string>;
    }

    useEffect(() => {
        loader.show();
        axios({
            method: "post",
            url: "/files",
            data: data,
        }).then((response) => {
            setFilesInfo(response.data);
            loader.hide();
        });
    }, []);

    console.log(filesInfo);

    const [highestCorrelations, setHighestCorrelations] = useState<Array<CorrelationPair>>([]);
    const [lowestCorrelations, setLowestCorrelations] = useState<Array<CorrelationPair>>([]);

    interface Data {
        value: string;
        percentage: string;
    }
    interface CorrelationData {
        element1: string;
        element2: string;
        correlation: number;
    }
    interface CorrelationPair {
        element1: string;
        element2: string;
        correlation: number;
    }
    interface ApiResponse {
        highestCorrelations: CorrelationData[];
        lowestCorrelations: CorrelationData[];
    }

    useEffect(() => {
        axios
            .get("/prepare-combined-report")
            .then((response) => {
                const { highestCorrelations, lowestCorrelations } = response.data as ApiResponse;
                console.log(response.data)
                // @ts-ignore
                setHighestCorrelations(highestCorrelations);
                // @ts-ignore
                setLowestCorrelations(lowestCorrelations);
            })
            .catch((error) => {
                console.log("Errore nel caricamento dei dati", error);
            });
    }, []);

    useEffect(() => {
        axios.get('/prepare-combinedset-report')
            .then(response => {
                setDataSets(response.data);
            })
            .catch(error => {
                console.log('Errore nel caricamento dei dati', error);
            });
    }, []);


    async function deleteFiles() {
        try {
            await axios.delete('/deleteAllFiles');
            toast.success('Back to the Home Page!', {
                position: "bottom-left",
                autoClose: 1000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
            window.location.href = '/';
        } catch (error) {
            console.error(error);
        }
    }

    const {totalProcess,totalChoreography,totalConversation} = filesInfo.reduce((counts, file) => {
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
    }, { totalProcess: 0, totalChoreography: 0, totalConversation: 0});

    let totalModels = totalProcess+totalChoreography+totalConversation;
    console.log(totalModels)
    const totalDuplicated = filesInfo.reduce((counts, file) => {
        if (file.isDuplicated) {
            counts.totalDuplicated++;
        }
        return counts;
    }, { totalDuplicated: 0});

    const {valid, invalid} = filesInfo.reduce((counts, file) => {
        if (file.isValid) {
            counts.valid++;
        } else {
            counts.invalid++;
        }
        return counts;
    }, {valid: 0, invalid: 0});

        let total = filesInfo.length;

        if (data.includes("invalid") && data.includes("duplicated")) {
            total = total - (invalid + totalDuplicated.totalDuplicated);
        }
        else if (data.includes("duplicated") && !data.includes("invalid")) {
            total -= totalDuplicated.totalDuplicated;
        }
        else if (!data.includes("duplicated") && data.includes("invalid")) {
            total -= invalid;
        }

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

    const downloadGMFile = () => {
        axios({
            url: '/download-goodemodeling-report',
            method: 'GET',
            responseType: 'blob',
        }).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'bpmn_guidelines.csv');
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

    const downloadCompleteReport = () => {
        axios({
            url: '/download-complete-report',
            method: 'GET',
            responseType: 'blob',
        }).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'bpmn_inspector_report.csv');
            document.body.appendChild(link);
            link.click();
        });
    };

    const downloadCombinedFile = () => {
        axios({
            url: '/download-combined-report',
            method: 'GET',
            responseType: 'blob',
        }).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'bpmn_PairsCorrelations_Report.csv');
            document.body.appendChild(link);
            link.click();
        });
    };

    const downloadCombinedSetFile = () => {
        axios({
            url: '/download-combinedset-report',
            method: 'GET',
            responseType: 'blob',
        }).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'bpmn_BPMNSubSetsCorrelations_Report.csv');
            document.body.appendChild(link);
            link.click();
        });
    };

    let displayMsgSyntactic = "";
    let displayMsgGoodModeling = "";
    let displayMsgCombined = "";

    if (invalid===0) {
        displayMsgSyntactic = "No invalids models were detected.";
    }

    if (totalProcess===0 || valid===0) {
        displayMsgGoodModeling = "The evaluation of good modeling practices is supported only on valid Process Collaboration models.";
    }

    if (total === 1) {
        displayMsgCombined = "The evaluation of the combined use of elements can be evaluate only in more than one model.";
    }

    function downloadSvg(diagramId: string) {
        const diagram = document.querySelector(`#${diagramId}`);
        if (diagram) {
            html2canvas(diagram as HTMLElement).then((canvas) => {
                const url = canvas.toDataURL('image/jpeg');
                const downloadLink = document.createElement('a');
                downloadLink.href = url;
                downloadLink.download = `${diagramId}.jpeg`;
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);
            });
        }
    }

    function countTotalLengths(files: filesInfo[]) {
        let maxLength = 0;
        const arrayLength: number[] = [];
        let totalModels = 0;

        for (const file of files) {
            // @ts-ignore
            const totalElements = file.elementMap["TotalElements"];

            if (totalElements !== undefined && totalElements >= 0) {
                totalModels++;
                if (totalElements > maxLength) {
                    maxLength = totalElements;
                }
                while (arrayLength.length <= totalElements) {
                    arrayLength.push(0);
                }
                arrayLength[totalElements]++;
            }
        }

        const percentageArray = arrayLength.map((count) => (count / totalModels) * 100);

        const labels = [];
        for (let i = 0; i <= maxLength; i++) {
            labels.push(`${i}`);
        }

        const dataTotalElements = {
            labels: labels,
            datasets: [
                {
                    label: "% of the model with this size",
                    backgroundColor: "rgb(16,173,115)",
                    borderColor: "rgb(8,59,12)",
                    data: percentageArray,
                    color: "rgb(8,59,12)",
                },
            ],
        };
        return dataTotalElements;
    }

    const optionsTotalElements = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
        },
        interaction: {
            mode: 'index' as const,
            intersect: false,
        },
        stacked: false,
        scales: {
            y: {
                display: true,
                ticks: {
                    precision: 0,
                    callback: (value: any) => `${value}%`,
                },
                title: {
                    display: true,
                    text: '% of Models',
                    color: 'black',
                    font: {
                        size: 13,
                    },
                },
            },
            x: {
                title: {
                    display: true,
                    text: 'Model Size',
                    color: 'black',
                    font: {
                        size: 13,
                    },
                },
            },
        },
    };

    function countPracticalLengths(files: filesInfo[]) {
        let maxLength = 0;
        const arrayLength: number[] = [0];
        let totalModels = 0;

        for (const file of files) {
            // @ts-ignore
            const practicalComplexity = file.elementMap["Practical Complexity"];

            if (practicalComplexity !== undefined && practicalComplexity >= 0) {
                totalModels++;
                if (practicalComplexity > maxLength) {
                    maxLength = practicalComplexity;
                }
                while (arrayLength.length <= practicalComplexity) {
                    arrayLength.push(0);
                }
                arrayLength[practicalComplexity]++;
            }
        }

        const percentageArray = arrayLength.map((count) => (count / totalModels) * 100);

        const labels = [];
        for (let i = 0; i <= maxLength; i++) {
            labels.push(`${i}`);
        }

        const filteredPercentageArray = percentageArray.map((value) => Math.round(value));

        const dataPC = {
            labels: labels,
            datasets: [
                {
                    label: "% of models with this size",
                    backgroundColor: "rgb(16,173,115)",
                    borderColor: "rgb(8,59,12)",
                    data: filteredPercentageArray,
                    color: "rgb(8,59,12)",
                },
            ],
        };
        return dataPC;
    }

    const optionsPC = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
        },
        interaction: {
            mode: 'index' as const,
            intersect: false,
        },
        stacked: false,
        scales: {
            y: {
                type: 'linear' as const,
                display: true,
                position: 'left' as const,
                ticks: {
                    precision: 0,
                    callback: (value: any) => `${value}%`,
                },
                title: {
                    display: true,
                    text: '% of Models',
                    color: 'black',
                    font: {
                        size: 13,
                    },
                },
            },
            x: {
                title: {
                    display: true,
                    text: 'Practical Complexity',
                    color: 'black',
                    font: {
                        size: 13,
                    },
                },
            },
        },
    };
    function countElementDistr(files: filesInfo[]) {
        const elementCounts = {};

        // Loop through each file
        for (const file of files) {
            // Loop through each element in the file's elementMap
            for (const element in file.elementMap) {
                if (element === "TotalElements" || element === "Practical Complexity") {
                    continue;
                }
                if (file.elementMap.hasOwnProperty(element)) {
                    // @ts-ignore
                    const value = file.elementMap[element];
                    if (value > 0) {
                        if (!elementCounts.hasOwnProperty(element)) {
                            // @ts-ignore
                            elementCounts[element] = 0;
                        }
                        // @ts-ignore
                        elementCounts[element]++;
                    }
                }
            }
        }

        // @ts-ignore
        const sortedCounts = Object.entries(elementCounts).sort((a, b) => b[1] - a[1]);

        // Extract labels and data from the sortedCounts array
        const labels = sortedCounts.map((count) => count[0]);
        const data = sortedCounts.map((count) => count[1]);

        // Create the chart data object
        const dataElementDistr = {
            labels: labels,
            datasets: [
                {
                    label: "# of models with this element",
                    backgroundColor: "rgb(16,173,115)",
                    borderColor: "rgb(8,59,12)",
                    data: data,
                    color: "rgb(8,59,12)",
                },
            ],
        };

        return dataElementDistr;
    }

    const optionsElementDistr = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
        },
        interaction: {
            mode: 'index' as const,
            intersect: false,
        },
        stacked: false,
        scales: {
            y: {
                type: 'linear' as const,
                display: true,
                position: 'left' as const,
                title: {
                    display: true,
                    text: '# of Models',
                    color: 'black',
                    font: {
                        size: 13,
                    },
                },
                ticks: {
                    precision: 0
                },
            },
        },
    };

    function countElementUsage(files: filesInfo[]) {
        const sumMap: Record<string, number> = {};
        for (const file of files) {
            for (const key in file.elementMap) {
                if (key === "TotalElements" || key === "Practical Complexity") {
                    continue;
                }
                // @ts-ignore
                const value = file.elementMap[key];
                if (!sumMap.hasOwnProperty(key)) {
                    sumMap[key] = value;
                } else {
                    sumMap[key] += value;
                }
            }
        }

        const sortedKeys = Object.keys(sumMap)
            .filter((key) => sumMap[key] >= 1) // filtra gli elementi che hanno valore 0 o inferiore
            .sort((a, b) => sumMap[b] - sumMap[a]);

        const labels = sortedKeys.map((key) => key);

        const dataElementUsage = {
            labels: labels,
            datasets: [
                {
                    label: "# of this element in the collection",
                    backgroundColor: "rgb(16,173,115)",
                    borderColor: "rgb(8,59,12)",
                    color: "rgb(8,59,12)",
                    data: sortedKeys.map((key) => sumMap[key]),
                },
            ],
        };
        return dataElementUsage;
    }
    const optionsElementUsage = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
        },
        stacked: false,
        scales: {
            y: {
                ticks: {
                    precision: 0
                },
                title: {
                    display: true,
                    text: '# of Models',
                    color: 'black',
                    font: {
                        size: 13,
                    },
                },
            },
        },
    };


    // @ts-ignore
    const calculatePercentage = (filesToDisplay) => {
        const columnCount = 40; // Numero di colonne da G1 a G40
        const percentageArray: number[] = [];

        // Inizializza l'array delle percentuali a 0
        for (let i = 0; i < columnCount; i++) {
            percentageArray[i] = 0;
        }

        // Calcola il numero di valori 'true' per ogni colonna
        filesToDisplay.forEach((file: { modelType: string; isValid: any; guidelineMap: { [x: string]: any; }; }) => {
            if (file.modelType === "Process Collaboration" && file.isValid) {
                for (let i = 0; i < columnCount; i++) {
                    if (file.guidelineMap[`G${i + 1}`]) {
                        percentageArray[i]++;
                    }
                }
            }
        });

        // Calcola la percentuale per ogni colonna
        const totalFiles = filesToDisplay.filter((file: { modelType: string; isValid: any; }) => file.modelType === "Process Collaboration" && file.isValid).length;
        const percentageResult = percentageArray.map(count => (count / totalFiles) * 100);

        return percentageResult;
    }

    const dataPC = countPracticalLengths(filesInfo);
    const dataTotalElements = countTotalLengths(filesInfo);
    const dataElementDistr = countElementDistr(filesInfo);
    const dataElementUsage = countElementUsage(filesInfo);
    const percentageResult = calculatePercentage(filesToDisplay);

    const labels = Array.from({ length: 40 }, (_, index) => `G${index + 1}`); // Genera un array di etichette "G1", "G2", ecc.

    const radarChartData = {
        labels: g, // Array di etichette
        datasets: [
            {
                label: "% of guideline's satisfaction",
                backgroundColor: "rgba(16,173,115,0.7)",
                borderColor: "rgba(8,59,12,0.6)",
                data: percentageResult, // Array di valori delle percentuali
                link: [''],
                pointRadius: 8, // Dimensione dei punti
            },
        ],
    };

    const optionRadarChartData = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
        },
        elements: {
            point: {
                radius: 6,
                hoverRadius: 6,
                hoverBorderWidth: 0,
                hoverBackgroundColor: "rgba(16,173,115,0.7)",
                hoverBorderColor: "rgba(8,59,12,0.6)",
                hitRadius: 10,
                cursor: "pointer",
                },
            },
    };

    const handleClick = (index: number | React.SetStateAction<null>) => {
        // @ts-ignore
        setActiveButton(index === activeButton ? null : index);
    };
    const chartRef = useRef();
    const onClick = (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
        // @ts-ignore
        const activeElements = chartRef.current.getElementsAtEventForMode(event, 'point', { intersect: true });
        if (activeElements.length > 0) {
            const datasetIndex = activeElements[0].datasetIndex;
            const dataPointIndex = activeElements[0].index;
            setSelectedItemIndex(dataPointIndex);
            handleClick(dataPointIndex);
        }
    };


    // @ts-ignore
    const errorCounts: { [errorType: string]: number } = {};
    filesInfo.forEach(file => {
        // Estrazione delle stringhe di errore dall'attributo errorLog
        const errorStrings = file.errorLog.split(':');
        // Iterazione delle stringhe di errore
        errorStrings.forEach((errorString: string) => {
            // Verifica se la stringa di errore inizia con "cvc"
            if (errorString.startsWith('cvc')) {
                // Aggiunta del tipo di errore all'oggetto di conteggio
                // @ts-ignore
                if (errorCounts[errorString]) {
                    // @ts-ignore
                    errorCounts[errorString] += 1;
                } else {
                    // @ts-ignore
                    errorCounts[errorString] = 1;
                }
            }
        });
    });
    // @ts-ignore
    const sortedErrorCounts = Object.entries(errorCounts).sort((a, b) => b[1] - a[1]);
    const labelsErr = sortedErrorCounts.map(([errorType]) => errorType);
    // Creazione dell'array di valori

    const dataError = {
        labels: labelsErr,
        datasets: [
            {
                label: "% of guideline's satisfaction",
                backgroundColor: "rgb(16,173,115, 0.5)",
                borderColor: "rgb(0,0,0)",
                data: sortedErrorCounts.map(([_, count]) => count), // Array di valori delle percentuali
            },
        ],
    };

    const optionDataError = {
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
        },
        scales: {
            y: {
                ticks: {
                    precision: 0
                },
                title: {
                    display: true,
                    text: '# of Errors',
                    color: 'black',
                    font: {
                        size: 16,
                        weight: 'bold',
                    },
                },
            },
            x: {
                title: {
                    display: true,
                    text: 'Error Type',
                    color: 'black',
                    font: {
                        size: 16,
                        weight: 'bold',
                    },
                },
            },
        },
    };

    const seriesData = dataSets
        .filter((data) => parseFloat(data.percentage) !== 0)
        .map((data, index) => ({
            values: [parseFloat(data.percentage)],
            text: `${data.value.replace(/-/g, "\n")}`, // Aggiungi "\n" dopo ogni "-"
            tooltip: {
                text: `${data.value}`,
            },
            scaleX: index + 1,
        }));

    let myConfig = {
        type: "funnel",
        plot: {
            startWidth: "dynamic",
            minExit: `${seriesData[seriesData.length - 1].values[0]}%`,
            valueBox: {
                text: "%v%",
                placement: "center",
                fontFamily: "Tahoma",
                fontColor: "#ffffff",
                fontSize: 12,
                fontWeight: "normal",
                fontStyle: "normal",
            },
            animation: {
                effect: "ANIMATION_FADE_IN"
            }
        },
        scaleY: {
            labels: seriesData.map((data) => data.text),
            scaleLabel: {
                fontFamily: "Arial",
                fontSize: 8,
                fontWeight: "bold",
                fontColor: "#333333",
            },
        },
        series: seriesData,
    };

    zingchart.render({
        id: "myChart",
        data: myConfig,
        height: "10%",
        width: "50%",
    });


    return (
        <div style={{background:"#fafafb"}} className="flex flex-col h-full items-left justify-left p-l text-left box-border">
            <ul style={{background:"#fafafb"}} className="nav nav-tabs nav-fill">
                <li className="nav-item" style={{padding: '5px 20px', border: 'none', borderBottom: '1px solid #10ad73', cursor: 'pointer', fontWeight: "bold", fontSize:'15px' }}>
                    <a
                        className={`nav-link ${activeTab === 'bpmn-element-usage' ? 'active' : ''}`}
                        onClick={() => setActiveTab('bpmn-element-usage')}
                        style={{ color: '#10ad73'}}
                    >
                        BPMN Element Usage
                    </a>
                </li>
                <li className="nav-item" style={{padding: '5px 20px', border: 'none', borderBottom: '1px solid #10ad73', cursor: 'pointer', fontWeight: "bold", fontSize:'15px' }}>
                    <a
                        className={`nav-link ${activeTab === 'bpmn-element-combined-use' ? 'active' : ''}`}
                        onClick={() => setActiveTab('bpmn-element-combined-use')}
                        style={{color: '#10ad73'}}
                            >
                        BPMN Element Combined use
                    </a>
                </li>
                <li className="nav-item" style={{padding: '5px 20px', border: 'none', borderBottom: '1px solid #10ad73', cursor: 'pointer', fontWeight: "bold", fontSize:'15px' }}>
                    <a
                        className={`nav-link ${activeTab === 'bpmn-syntactic-validation' ? 'active' : ''}`}
                        onClick={() => setActiveTab('bpmn-syntactic-validation')}
                        style={{color: '#10ad73'}}
                    >
                        BPMN Syntactic Validation
                    </a>
                </li>
                <li className="nav-item" style={{padding: '5px 20px', border: 'none', borderBottom: '1px solid #10ad73', cursor: 'pointer', fontWeight: "bold", fontSize:'15px' }}>
                    <a
                        className={`nav-link ${activeTab === 'bpmn-good-modeling-practices' ? 'active' : ''}`}
                        onClick={() => setActiveTab('bpmn-good-modeling-practices')}
                        style={{color: '#10ad73'}}
                    >
                        BPMN Good Modeling Practices
                    </a>
                </li>
            </ul>

            <div style={{background:"#fafafb"}} className="tab-content">
                {activeTab === 'bpmn-element-usage' && (
                    <>
                        <div style={{display: "flex", flexDirection: "row", width: "100%", marginBottom:"10px",marginTop:"10px"}}>
                            <div style={{width: "50%", paddingRight: "10px", border: "2px solid #d8d8d8",background:"white", padding: "5px 15px 15px 15px",marginRight:"10px", borderRadius: "12px 12px 12px 12px",lineHeight: "1.5714285714285714"}}>
                                <div style={{display:"flex"}}>
                                <a style={{fontSize: '25px', color: 'black', fontWeight: "bold"}}>BPMN Collection's
                                        Model Size</a>
                                    <CiCircleQuestion style={{fontSize: '18px', marginBottom: "3%", cursor: "help"}}
                                                      title={"This is a graph of the model size of the collection"}/>
                                    <button style={{background:'white',border:"none", color: '#10ad73', fontSize: '14px', padding: '5px 5px', cursor: 'pointer'}}>
                                        <FaRegImage onClick={() => downloadSvg('chartMS')} style={{fontSize:"30px", alignSelf:"right",marginBottom:"72%"}}/>
                                    </button>
                                </div>
                                    <div id="chartMS" style={{position: "relative", height:"35vh", width:"100%"}}>
                                        <Line data={dataTotalElements} options={optionsTotalElements}/>
                                    </div>

                            </div>
                            <div style={{width: "50%", paddingRight: "10px", border: "2px solid #d8d8d8",background:"white", padding: "5px 15px 15px 15px", borderRadius: "12px 12px 12px 12px",lineHeight: "1.5714285714285714"}}>
                                <div style={{display:"flex"}}>
                                <a style={{fontSize: '25px', color: 'black', fontWeight: "bold"}}>BPMN Collection's
                                        Practical Complexity</a>
                                    <CiCircleQuestion style={{fontSize: '18px', marginBottom: "3%", cursor: "help"}}
                                                      title={"This is a graph of the practical complexity of the collection"}/>
                                    <button style={{background:'white',border:"none", color: '#10ad73', fontSize: '14px', padding: '5px 5px', cursor: 'pointer'}}>
                                        <FaRegImage onClick={() => downloadSvg('chartPC')} style={{fontSize:"30px", alignSelf:"right",marginBottom:"72%"}}/>
                                    </button>
                                </div>
                                <div id="chartPC" style={{position: "relative", height:"38vh", width:"100%"}}>
                                    <Line data={dataPC} options={optionsPC}/>
                                </div>
                            </div>
                        </div>
                        <div style={{display: "flex", flexDirection: "row", width: "100%", marginBottom:"10px",marginTop:"10px"}}>
                            <div style={{width: "50%", paddingRight: "10px", border: "2px solid #d8d8d8",background:"white", borderRadius: "12px 12px 12px 12px",padding: "5px 15px 15px 15px",marginRight:"10px", lineHeight: "1.5714285714285714"}}>
                                <div style={{display:"flex"}}>
                                <a style={{fontSize: '25px', color: 'black', fontWeight: "bold"}}>BPMN Element's usage</a>
                                    <CiCircleQuestion style={{fontSize: '18px', marginBottom: "3%", cursor: "help"}}
                                                      title={"This is a graph of the element usage"}/>
                                    <button style={{background:'white',border:"none", color: '#10ad73', fontSize: '14px', padding: '5px 5px', cursor: 'pointer'}}>
                                        <FaRegImage onClick={() => downloadSvg('chartEU')} style={{fontSize:"30px", alignSelf:"right",marginBottom:"72%"}}/>
                                    </button>
                                </div>
                                <div id="chartEU" style={{position: "relative", height:"40vh", width:"100%"}}>
                                    <Line data={dataElementUsage} options={optionsElementUsage}/>
                                </div>
                            </div>

                            <div style={{width: "50%", paddingRight: "10px", border: "2px solid #d8d8d8",background:"white", padding: "5px 15px 15px 15px", borderRadius: "12px 12px 12px 12px",lineHeight: "1.5714285714285714"}}>
                                <div style={{display:"flex"}}>
                                <a style={{fontSize: '25px', color: 'black', fontWeight: "bold"}}>BPMN Element's Distribution</a>
                                    <CiCircleQuestion style={{fontSize: '18px', marginBottom: "3%", cursor: "help"}}
                                                      title={"This is a graph of the element distribution"}/>
                                    <button style={{background:'white', border:"none", color: '#10ad73', fontSize: '14px', padding: '5px 5px', cursor: 'pointer'}}>
                                        <FaRegImage onClick={() => downloadSvg('chartED')} style={{fontSize:"30px", alignSelf:"right",marginBottom:"72%"}}/>
                                    </button>
                                </div>

                                <div id="chartED" style={{position: "relative", height:"40vh", width:"100%"}}>
                                    <Line data={dataElementDistr} options={optionsElementDistr}/>
                                </div>
                                </div>
                        </div>

                        <div style={{width: "100%", paddingRight: "10px", border: "2px solid #d8d8d8",background:"white", padding: "5px 15px 15px 15px", borderRadius: "12px 12px 12px 12px",lineHeight: "1.5714285714285714"}}>
                            <table>
                                <thead>
                                <tr>
                                    <th style={{ width: '10%', textAlign: 'center'  }}>Rank (<span style={{ fontStyle: 'italic', whiteSpace: 'nowrap' }}>r</span>) <CiCircleQuestion style={{ fontSize: '18px', marginBottom: '3%', cursor: 'help' }} title={'Element rank by number of occurrences'} /></th>
                                    <th style={{ width: '20%', textAlign: 'center'  }}>Element</th>
                                    <th style={{ width: '20%', textAlign: 'center'  }}>Occurrences <CiCircleQuestion style={{ fontSize: '18px', marginBottom: '3%', cursor: 'help' }} title={'Number of occurrences for each element in the collection'} /></th>
                                    <th style={{ width: '20%', textAlign: 'center'  }}>Number of Models <CiCircleQuestion style={{ fontSize: '18px', marginBottom: '3%', cursor: 'help' }} title={'Number of models presenting at least one occurrence of this element'} /></th>
                                    <th style={{ width: '20%', textAlign: 'center'  }}>Probability Distribution <CiCircleQuestion style={{ fontSize: '18px', marginBottom: '3%', cursor: 'help' }} title={'Probability to find this element in a model considering this collection'} /></th>
                                </tr>
                                </thead>
                                <tbody>
                                {dataElementUsage.labels
                                    .map((label, index) => ({
                                        label,
                                        usage: dataElementUsage.datasets[0].data[index],
                                        distribution: dataElementDistr.datasets[0].data[index],
                                    }))
                                    .sort((a, b) => b.usage - a.usage)
                                    .map((item, index) => ({
                                        ...item,
                                        rank: index + 1,
                                        percentage: ((item.distribution as number) / totalModels) * 100,
                                    }))
                                    .map((item, index) => (
                                        <tr key={index}>
                                            <td style={{ width: '5%', textAlign: 'center' }}>{item.rank}</td>
                                            <td style={{ width: '20%', textAlign: 'center' }}>{item.label}</td>
                                            <td style={{ width: '20%', textAlign: 'center' }}>{item.usage}</td>
                                            <td style={{ width: '20%', textAlign: 'center' }}>{item.distribution as string}</td>
                                            <td style={{ width: '20%', textAlign: 'center' }}>{item.percentage.toFixed(2)}%</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div style={{display:"flex",flexDirection:"column",marginBottom:"10px", marginTop:"0.20cm"}} >
                            <button style={{ background: 'white', color: '#10ad73', fontSize: '14px', padding: '10px 10px', cursor: 'pointer', marginTop: '0.42cm' }} onClick={downloadInspectionFile}>
                                <GrDocumentCsv /><a style={{ marginRight: '0.5em', color: '#10ad73', marginLeft: '8px' }}>Download Inspection report</a>
                            </button>
                        </div>

                    </>

                )}
                {activeTab === 'bpmn-element-combined-use' && (
                    <div>
                        {displayMsgCombined ? (
                            <div className="container">
                                <img style={{width:"8%",height:"10%"}} src="../../img/denied.png" />
                                <p>{displayMsgCombined}</p>
                                <a><a href="" style={{cursor:"pointer"}} onClick={deleteFiles}>Upload more than one model</a></a>
                            </div>
                        ) : (
                    <div style={{display: "flex", flexDirection: "row", width: "100%", marginBottom:"10px",marginTop:"10px"}}>
                        <div style={{display:'flex',width: "50%",flexDirection: "column",marginRight: "10px"}}>
                            <div style={{width: "100%", marginRight: "10px", border: "2px solid #d8d8d8",background:"white", padding: "5px 15px 15px 15px", borderRadius: "12px 12px 12px 12px",lineHeight: "1.5714285714285714"}}>
                                <div style={{display:"flex", flexDirection:"column"}}>
                                    <div style={{ display: "flex", flexDirection: "row", alignItems: "center", flexWrap: "wrap" }}>
                                        <a style={{ fontSize: '25px', color: 'black', fontWeight: "bold" }}>Most Combined Use</a>
                                        <CiCircleQuestion style={{ fontSize: '18px', marginBottom: "3%", cursor: "help" }} title={"This is a graph of the model size of the collection"} />
                                        <button style={{ background: 'white', border: "none", color: '#10ad73', fontSize: '14px', padding: '5px 5px', cursor: 'pointer' }}>
                                            <FaRegImage onClick={() => downloadSvg('chartVCON')} style={{ fontSize: "30px", alignSelf: "right", marginBottom: "71%" }} />
                                        </button>
                                    </div>

                                    <div id="chartVPC"  style={{marginRight: "auto"}}>
                                        <div id="myChart" style={{marginLeft: "100px"}}></div>
                                    </div>

                                    <div>
                                        <table>
                                            <thead>
                                            <tr>
                                                <th>Set of Combined BPMN Elements</th>
                                                <th>Percentage</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {dataSets.map((data, index) => {
                                                if (data.percentage === "0.00%") {
                                                    return null; // Ignora l'elemento se la percentuale è 0
                                                }
                                                else {
                                                    return (
                                                        <tr key={index} style={{fontSize: "13px"}}>
                                                            <td>{data.value}</td>
                                                            <td style={{textAlign: "center"}}>{data.percentage}</td>
                                                        </tr>
                                                    );
                                                }
                                            })}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                            <button style={{background: 'white',width:"100%", marginRight:"10px", color: '#10ad73', fontSize: '14px', padding: '10px 10px', cursor: 'pointer', marginTop: '0.42cm' }} onClick={downloadCombinedSetFile}>
                                <GrDocumentCsv /><a style={{ marginRight: '0.5em', color: '#10ad73', marginLeft: '8px' }}>Download Combined use report</a>
                            </button>
                        </div>
                        <div style={{display:'flex',width: "50%",flexDirection: "column"}}>
                            <div style={{width: "100%",paddingRight: "10px", border: "2px solid #d8d8d8",background:"white", padding: "5px 15px 15px 15px", borderRadius: "12px 12px 12px 12px",lineHeight: "1.5714285714285714"}}>
                                <div>
                                    <a style={{fontSize: '25px', color: 'black', fontWeight: "bold"}}>10 Highest Correlations </a>
                                    <CiCircleQuestion style={{fontSize: '18px', marginBottom: "3%", cursor: "help"}}
                                                      title={"This is a graph of the model size of the collection"}/>
                                    <table style={{marginBottom:"15px"}}>
                                        <thead>
                                        <tr>
                                            <th>Element 1</th>
                                            <th>Element 2</th>
                                            <th style={{textAlign:"center"}}>Rho (ρ)</th>
                                        </tr>
                                        </thead>
                                        <tbody >
                                        {highestCorrelations.map((relation, index) => (
                                            <tr key={index} style={{fontSize:"13px"}}>
                                                <td>{relation.element1}</td>
                                                <td>{relation.element2}</td>
                                                <td style={{textAlign:"center"}}>{relation.correlation}</td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>

                                    <a style={{fontSize: '25px', color: 'black', fontWeight: "bold"}}>10 Lowest Correlations </a>
                                    <CiCircleQuestion style={{fontSize: '18px', marginBottom: "3%", cursor: "help"}}
                                                      title={"This is a graph of the model size of the collection"}/>
                                    <table>
                                        <thead>
                                        <tr>
                                            <th>Element 1</th>
                                            <th>Element 2</th>
                                            <th style={{textAlign:"center"}}>Rho (ρ)</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {lowestCorrelations.map((relation, index) => (
                                            <tr key={index} style={{fontSize:"13px"}}>
                                                <td>{relation.element1}</td>
                                                <td>{relation.element2}</td>
                                                <td style={{textAlign:"center"}}>{relation.correlation}</td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <button style={{background: 'white',width:"100%", color: '#10ad73', fontSize: '14px', padding: '10px 10px', cursor: 'pointer', marginTop: '0.42cm' }} onClick={downloadCombinedFile}>
                                <GrDocumentCsv /><a style={{ marginRight: '0.5em', color: '#10ad73', marginLeft: '8px' }}>Download Pearson correlation report</a>
                            </button>
                        </div>
                    </div>
                        )}
                    </div>
                )}
                {activeTab === 'bpmn-syntactic-validation' && (
                    <div>
                        {displayMsgSyntactic ? (
                            <div className="container">
                                <img style={{width:"8%",height:"10%"}} src="../../img/denied.png" />
                                <p>{displayMsgSyntactic}</p>
                                <a><a href="" style={{cursor:"pointer"}} onClick={deleteFiles}>Upload invalid models</a> for inspecting validation errors.</a>
                            </div>
                        ) : (
                            <div style={{display: "flex", flexDirection: "column", width: "100%", marginBottom:"10px",marginTop:"10px"}}>
                                <div style={{ display: 'flex',width: "100%",flexDirection: "column" }}>
                                    <div style={{marginBottom:"10px", paddingRight: "10px", border: "2px solid #d8d8d8",background:"white", padding: "5px 15px 15px 15px", borderRadius: "12px 12px 12px 12px",lineHeight: "1.5714285714285714"}}>
                                        <div style={{display:"flex"}}>
                                            <a style={{fontSize: '25px', color: 'black', fontWeight: "bold"}}>Syntactical errors</a>
                                            <CiCircleQuestion style={{fontSize: '18px', marginBottom: "3%", cursor: "help"}}
                                                              title={"This is a graph of the model size of the collection"}/>
                                            <button style={{background:'white',border:"none", color: '#10ad73', fontSize: '14px', padding: '5px 5px', cursor: 'pointer'}}>
                                                <FaRegImage onClick={() => downloadSvg('chartSE')} style={{fontSize:"30px", marginBottom:"71%", alignSelf:"right"}}/>
                                            </button>
                                        </div>
                                        <div id="chartSE" style={{position: "relative",height:"35vh", width:"100%"}}>
                                            <Bar options={optionDataError}  data={dataError} style={{position: "relative",height:"5%", width:"100%"}}></Bar>
                                        </div>
                                    </div>
                                </div>
                                <div style={{display: "flex", flexDirection: "row"}}>
                                    <div style={{width: "100%", paddingRight: "10px", border: "2px solid #d8d8d8",background:"white", padding: "5px 15px 15px 15px",borderRadius: "12px 12px 12px 12px",lineHeight: "1.5714285714285714"}}>
                                        <div style={{display:"flex", flexDirection:"column"}}>
                                            <table>
                                                <thead>
                                                <tr>
                                                    <th>Error Type</th>
                                                    <th>Error Description <CiCircleQuestion style={{fontSize: '18px', marginBottom: "1%", cursor: "help"}}
                                                                                           title={"The information about errors can be founded at https://wiki.xmldation.com"}/></th>
                                                    <th># of Error</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {sortedErrorCounts.map(([errorType, count]) => {
                                                    const errorTypeFormatted = errorType.replace(/\./g, '-');
                                                    const errorLink = `https://wiki.xmldation.com/Support/Validator/${errorTypeFormatted}`;
                                                    return (
                                                        <tr key={errorType}>
                                                            <td>{errorType}</td>
                                                            <td>
                                                                <img style={{marginBottom:"0.2%"}} src={xmlLogo} width="25"/>
                                                                <a style={{marginLeft:"1%"}} href={errorLink} target="_blank" rel="noreferrer">
                                                                    {errorLink}
                                                                </a>
                                                            </td>
                                                            <td>{count}</td>
                                                        </tr>
                                                    );
                                                })}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                                <button style={{ background: 'white', color: '#10ad73', fontSize: '14px', padding: '10px 10px', cursor: 'pointer', marginTop: '0.42cm' }} onClick={downloadFile}>
                                    <GrDocumentCsv /><a style={{ marginRight: '0.5em', color: '#10ad73', marginLeft: '8px' }}>Download Validation report</a>
                                </button>
                            </div>

                        )}

                    </div>
                )}
                {activeTab === 'bpmn-good-modeling-practices' && (
                    <div>
                        {displayMsgGoodModeling ? (
                            <div className="container">
                                <img style={{width:"8%",height:"10%"}} src="../../img/denied.png" />
                                <p>{displayMsgGoodModeling}</p>
                                <a><a href="" style={{cursor:"pointer"}} onClick={deleteFiles}>Upload Process Collaboration models</a> for inspecting good modeling practices.</a>
                            </div>
                        ) : (
                            <>
                                <div style={{display: "flex", flexDirection: "column", width: "100%", marginBottom:"10px",marginTop:"10px"}}>
                                    <div style={{display: "flex", flexDirection: "row"}}>
                                        <div style={{width: "60%", marginRight:"10px", paddingRight: "10px", border: "2px solid #d8d8d8",background:"white", padding: "5px 15px 15px 15px", borderRadius: "12px 12px 12px 12px",lineHeight: "1.5714285714285714"}}>
                                            <div style={{ display: "flex", flexDirection: "row", alignItems: "center", flexWrap: "wrap" }}>
                                                <a style={{ fontSize: '25px', color: 'black', fontWeight: "bold" }}>Radar Guidelines</a>
                                                <CiCircleQuestion style={{ fontSize: '18px', marginBottom: "3%", cursor: "help" }} title={"This is a graph of the model size of the collection"} />
                                                <button style={{ background: 'white', border: "none", color: '#10ad73', fontSize: '14px', padding: '5px 5px', cursor: 'pointer' }}>
                                                    <FaRegImage onClick={() => downloadSvg('chartSE')} style={{ fontSize: "30px", alignSelf: "right", marginBottom: "71%" }} />
                                                </button>
                                                <a style={{ fontSize: '14px', color: 'black', fontStyle: "italic", marginBottom:"4%"}}>Click on the points of the radar for more information about the guideline.</a>
                                            </div>
                                            <div id="chartSE" style={{position: "relative", height:"100vh", width:"100%"}}>
                                                <Radar options={optionRadarChartData}  data={radarChartData} onClick={onClick} ref={chartRef}></Radar>
                                            </div>
                                            <div style={{ display: "flex", flexDirection: "row" }}>
                                                <table style={{ marginRight: "10px" }}>
                                                    <thead>
                                                    <tr>
                                                        <th>10 Most Met Guidelines</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    {radarChartData.datasets[0].data
                                                        .map((percentage, index) => ({ percentage, index }))
                                                        .sort((a, b) => b.percentage - a.percentage)
                                                        .slice(0, 10)
                                                        .map(({ percentage, index }) => (
                                                            <tr key={index} style={{ fontSize: "12px" }}>
                                                                <td>
                                                                    {g[index]} - <span style={{ fontWeight: "bold" }}>{descriptions[index].title}</span>
                                                                    <span style={{ color: `rgb(${255 - percentage * 2.55}, ${percentage * 2.55}, 0)`, fontWeight: "bold", marginLeft: "10px" }}>
                                                                        {percentage.toFixed(2)}%
                                                                    </span>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>

                                                <table>
                                                    <thead>
                                                    <tr>
                                                        <th>10 Most Violated Guidelines</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    {radarChartData.datasets[0].data
                                                        .map((percentage, index) => ({ percentage, index }))
                                                        .filter(({ percentage }) => percentage < 100)
                                                        .sort((a, b) => a.percentage - b.percentage)
                                                        .slice(0, 10)
                                                        .map(({ percentage, index }) => (
                                                            <tr key={index} style={{ fontSize: "12px" }}>
                                                                <td>
                                                                    {`${g[index]} - `}
                                                                    <span style={{ fontWeight: "bold" }}>{descriptions[index].title}</span>
                                                                    <span style={{ color: `rgb(${255 - percentage * 2.55}, ${percentage * 2.55}, 0)`, fontWeight: "bold", marginLeft: "10px" }}>
                                                                      {percentage.toFixed(2)}%
                                                                    </span>
                                                                </td>
                                                            </tr>
                                                        ))}

                                                    {[...Array(10 - radarChartData.datasets[0].data.filter(percentage => percentage < 100).length)].map((_, index) => (
                                                        <tr key={index + 10} style={{ fontSize: "12px" }}>
                                                            <td>
                                                                {"-"}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                        <div style={{width: "40%", paddingRight: "10px", border: "2px solid #d8d8d8",background:"white", padding: "5px 15px 15px 15px", borderRadius: "12px 12px 12px 12px",lineHeight: "1.5714285714285714"}}>
                                        <a style={{fontSize: '20px', color: 'black', fontWeight: "bold"}}>Guidelines List</a> <CiCircleQuestion style={{fontSize: '18px', marginBottom: "3%", cursor: "help"}} title={"This is a graph of the model size of the collection"}/>
                                            <div style={{display:"flex", flexDirection: "column"}}>
                                                <div style={{ marginTop: "10px", display: "flex", flexDirection: "column" }}>
                                                    {g.map((item, index) => (
                                                        <div key={index} style={{ marginBottom: "2px" }}>
                                                            <button
                                                                key={index}
                                                                onClick={() => handleClick(index)}
                                                                style={{
                                                                    marginRight: "10px",
                                                                    padding: "2px",
                                                                    border: "none",
                                                                    backgroundColor: "rgba(250, 250, 250, 0.8)",
                                                                    color: "#10ad73",
                                                                    borderRadius: "3px",
                                                                }}
                                                                className={selectedItemIndex === index && activeButton === index ? "active" : ""}
                                                            >
                                                                {item} - <span style={{ fontWeight: "bold" }}>{descriptions[index].title}</span>
                                                            </button>
                                                            {activeButton === index && (
                                                                <div style={{ marginTop: "5px", marginLeft: "20px", color: "black" }}>
                                                          <span
                                                              style={{
                                                                  color: `rgb(${255 - radarChartData.datasets[0].data[index] * 2.55}, ${radarChartData.datasets[0].data[index] * 2.55}, 0)`,
                                                                  fontWeight: "bold",
                                                              }}
                                                          >
                                                            Satisfaction: {radarChartData.datasets[0].data[index].toFixed(2)}%
                                                          </span>{" "}- {descriptions[index].description}
                                                                </div>
                                                            )}
                                                        </div>

                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div style={{display: "flex", flexDirection: "column", width: "100%", marginBottom:"10px",marginTop:"10px"}}>
                                    <div style={{width: "100%", display: 'flex',flexDirection: "column",paddingRight: "10px", border: "2px solid #d8d8d8",background:"white", padding: "5px 15px 15px 15px",marginRight:"10px", borderRadius: "12px 12px 12px 12px",lineHeight: "1.5714285714285714"}}>

                                        <div style={{fontSize: "18px", color: "black", width:"100%", display:"flex"}}>
                                            <span className="file-info-item-name" style={{ fontSize: "13px", fontWeight: "bold", width:"20%"}}>File name</span>
                                            <span className="file-info-item" style={{ fontSize: '12px', fontWeight:"bold"}}>G2</span>
                                            <span className="file-info-item" style={{ fontSize: '12px', fontWeight:"bold"}}>G3</span>
                                            <span className="file-info-item" style={{ fontSize: '12px', fontWeight:"bold"}}>G7</span>
                                            <span className="file-info-item" style={{ fontSize: '12px', fontWeight:"bold"}}>G8</span>
                                            <span className="file-info-item" style={{ fontSize: '12px', fontWeight:"bold"}}>G9</span>
                                            <span className="file-info-item" style={{ fontSize: '12px', fontWeight:"bold"}}>G10</span>
                                            <span className="file-info-item" style={{ fontSize: '12px', fontWeight:"bold"}}>G11</span>
                                            <span className="file-info-item" style={{ fontSize: '12px', fontWeight:"bold"}}>G12</span>
                                            <span className="file-info-item" style={{ fontSize: '12px', fontWeight:"bold"}}>G13</span>
                                            <span className="file-info-item" style={{ fontSize: '12px', fontWeight:"bold"}}>G14</span>
                                            <span className="file-info-item" style={{ fontSize: '12px', fontWeight:"bold"}}>G15</span>
                                            <span className="file-info-item" style={{ fontSize: '12px', fontWeight:"bold"}}>G16</span>
                                            <span className="file-info-item" style={{ fontSize: '12px', fontWeight:"bold"}}>G17</span>
                                            <span className="file-info-item" style={{ fontSize: '12px', fontWeight:"bold"}}>G18</span>
                                            <span className="file-info-item" style={{ fontSize: '12px', fontWeight:"bold"}}>G19</span>
                                            <span className="file-info-item" style={{ fontSize: '12px', fontWeight:"bold"}}>G20</span>
                                            <span className="file-info-item" style={{ fontSize: '12px', fontWeight:"bold"}}>G21</span>
                                            <span className="file-info-item" style={{ fontSize: '12px', fontWeight:"bold"}}>G22</span>
                                            <span className="file-info-item" style={{ fontSize: '12px', fontWeight:"bold"}}>G24</span>
                                            <span className="file-info-item" style={{ fontSize: '12px', fontWeight:"bold"}}>G26</span>
                                            <span className="file-info-item" style={{ fontSize: '12px', fontWeight:"bold"}}>G28</span>
                                            <span className="file-info-item" style={{ fontSize: '12px', fontWeight:"bold"}}>G29</span>
                                            <span className="file-info-item" style={{ fontSize: '12px', fontWeight:"bold"}}>G30</span>
                                            <span className="file-info-item" style={{ fontSize: '12px', fontWeight:"bold"}}>G31</span>
                                            <span className="file-info-item" style={{ fontSize: '12px', fontWeight:"bold"}}>G32</span>
                                            <span className="file-info-item" style={{ fontSize: '12px', fontWeight:"bold"}}>G33</span>
                                            <span className="file-info-item" style={{ fontSize: '12px', fontWeight:"bold"}}>G34</span>
                                            <span className="file-info-item" style={{ fontSize: '12px', fontWeight:"bold"}}>G35</span>
                                            <span className="file-info-item" style={{ fontSize: '12px', fontWeight:"bold"}}>G36</span>
                                            <span className="file-info-item" style={{ fontSize: '12px', fontWeight:"bold"}}>G37</span>
                                            <span className="file-info-item" style={{ fontSize: '12px', fontWeight:"bold"}}>G38</span>
                                            <span className="file-info-item" style={{ fontSize: '12px', fontWeight:"bold"}}>G39</span>
                                            <span className="file-info-item" style={{ fontSize: '12px', fontWeight:"bold"}}>G42</span>
                                            <span className="file-info-item" style={{ fontSize: '12px', fontWeight:"bold"}}>G44</span>
                                            <span className="file-info-item" style={{ fontSize: '12px', fontWeight:"bold"}}>G45</span>
                                            <span className="file-info-item" style={{ fontSize: '12px', fontWeight:"bold"}}>G46</span>
                                            <span className="file-info-item" style={{ fontSize: '12px', fontWeight:"bold"}}>G47</span>
                                            <span className="file-info-item" style={{ fontSize: '12px', fontWeight:"bold"}}>G48</span>
                                            <span className="file-info-item" style={{ fontSize: '12px', fontWeight:"bold"}}>G49</span>
                                            <span className="file-info-item" style={{ fontSize: '12px', fontWeight:"bold"}}>G50</span>
                                        </div>

                                        {filesToDisplay
                                            .filter(file => file.modelType === "Process Collaboration" && file.isValid)
                                            .map((file, index) => (
                                                <div key={index} style={{ border: "2px solid rgba(0, 0, 0, 0.05)", padding: "1px", borderRadius: "5px", marginBottom: "1px", fontSize: "15px", color: "black" }}>
                                                    <div className="file-info">
                                                        <p className="file-info-item-name file-name" style={{width:"9%"}}>
                                                            <BsDiagram2 /> {file.name}
                                                        </p>
                                                        <div className="file-info-item" style={{display:"flex", flexDirection:"row"}} >
                                                            {Object.entries(file.guidelineMap)
                                                                .sort((a, b) => parseInt(a[0].substring(1)) - parseInt(b[0].substring(1))) // Ordina gli oggetti per chiave numerica
                                                                .map(([key, value], index) => (
                                                                    <span key={key} style={{marginLeft:"0.56%", marginTop:"8px"}} className={`badge badge-pill badge-success ${value ? 'Valid' : 'Invalid'}`}>
                                                                            {value ? <GiConfirmed /> : <AiFillExclamationCircle />}
                                                                    </span>
                                                                ))}
                                                        </div>

                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                    <button style={{ background: 'white', color: '#10ad73', fontSize: '14px', padding: '10px 10px', cursor: 'pointer', marginTop: '0.42cm' }}  onClick={downloadGMFile}>
                                        <GrDocumentCsv /><a style={{ marginRight: '0.5em', color: '#10ad73', marginLeft: '8px' }}>Download Good Modeling Practice report</a>
                                    </button>
                                </div>
                            </>
                        )}
                    </div>

                )}
               </div>

            <input style={{position: 'fixed', marginBottom:'20px', marginRight:'1%', backgroundColor: 'red', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer', right: '0', bottom: '0'}} onClick={deleteFiles} type="submit" value="Home"/>
            <button style={{position: 'fixed', marginLeft: "61%", marginTop: "-4.8%", zIndex: '9', fontSize: "17px", backgroundColor: 'white', color: '#10ad73', padding: '5px 13px', border: '2px solid #10ad73', borderRadius: '3px', cursor: 'pointer'}} onClick={downloadCompleteReport} type="submit">
                <GrDocumentCsv style={{fontStyle:"white",marginBottom: "2%"}}/><a style={{marginRight: '0.5em', color: "#10ad73", marginLeft: '8px', fontWeight: "bold"}}>Download complete report</a>
            </button>
        </div>
    );
}



