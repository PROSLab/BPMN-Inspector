import React, {useState} from "react";
import axios from "axios";
import { useLocation } from 'react-router-dom';
import "./postCss.css";

// @ts-ignore
export default function PostProcessingView() {
    const [activeTab, setActiveTab] = useState('bpmn-element-usage');
    const location = useLocation()
    const {data} = location.state
    console.log(data)
    return (
        <div className="flex flex-col h-full items-left justify-left p-l text-left box-border">
            <a style={{fontSize:'25px',color:'black',alignSelf:'left',fontWeight:"bold"}}>BPMN models inspected</a>
            <a style={{fontSize:'20px',color:'black',alignSelf:'left',marginBottom:'0.5cm'}}>
                <a style={{color:'green',fontWeight:"bold"}}>{data[3]}</a> models have been inspected. Models discarded:
                {data[0] || data[1] ? (
                    <>
                        {data[0] && <a style={{fontWeight:"bold"}}>{ data[0]}</a>}
                        {data[0] && data[1] && " "}
                        {data[1] && <a style={{fontWeight:"bold"}}>{ data[1]}</a>}
                    </>
                ) : (
                    " none"
                )}
            </a>

            <ul className="nav nav-tabs nav-fill">
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

            <div className="tab-content">
                {activeTab === 'bpmn-element-usage' && (
                    <div>
                        <h1>BPMN Element Usage</h1>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam iaculis libero sit amet velit interdum rhoncus. Donec luctus, sapien nec bibendum pretium, lorem purus fringilla metus, a laoreet nulla est ac justo. Sed sit amet posuere ante.</p>
                    </div>
                )}
                {activeTab === 'bpmn-element-combined-use' && (
                    <div>
                        <h1>BPMN Element Combined use</h1>
                        <p>Ut sit amet est ut est imperdiet ullamcorper. Aliquam gravida consequat mauris nec feugiat. Nulla facilisi. Curabitur bibendum eget felis vitae rhoncus.</p>
                    </div>
                )}
                {activeTab === 'bpmn-syntactic-validation' && (
                    <div>
                        <h1>BPMN Syntactic Validation</h1>
                        <p>Mauris venenatis quam id urna sagittis, ac ultricies purus porttitor. Sed ut aliquet velit, vitae tristique elit. Vivamus ut elit laoreet, interdum purus sit amet, facilisis lorem.</p>
                    </div>
                )}
                {activeTab === 'bpmn-good-modeling-practices' && (
                    <div>
                        <h1>BPMN Good Modeling Practices</h1>
                        <p>Suspendisse sit amet nulla est. Aliquam grav</p>
                    </div>
                )}
               </div>

            <ul>
                {data.map((item: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal | null | undefined) => (
                    <li>{item}</li>
                ))}
            </ul>


        </div>
    );
}

async function getServerSideProps() {
    const response = await axios.post("/process-filtered-models", ["dato1", "dato2"]);

    return {
        props: {
            data: response.data,
        },
    };
}