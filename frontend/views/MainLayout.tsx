import { AppLayout } from '@hilla/react-components/AppLayout.js';
import { DrawerToggle } from '@hilla/react-components/DrawerToggle.js';
import { Item } from '@hilla/react-components/Item.js';
import { Scroller } from '@hilla/react-components/Scroller.js';
import Placeholder from 'Frontend/components/placeholder/Placeholder.js';
import { MenuProps, routes, useViewMatches, ViewRouteObject } from 'Frontend/routes.js';
import React, {Suspense, useEffect, useState} from 'react';
import {NavLink, Outlet, useLocation} from 'react-router-dom';
import css from './MainLayout.module.css';
import logo from "./../img/logo.png"
import {MdAlternateEmail} from "react-icons/all";
import {CiCircleQuestion} from "react-icons/ci";
import { FaBug } from "react-icons/fa";
import {loader} from "react-global-loader";
import axios from "axios";
import PieChart from "Frontend/components/charts/PieChart";
import {Pie} from "react-chartjs-2";
import {HiAcademicCap} from "react-icons/hi";
import Modal from 'react-modal';
interface filesInfo {
    modelType: string;
    name: string;
    size: number;
    isValid: boolean;
    isEnglish: string;
    isDuplicated: boolean;
    elementMap: Map<string, number>;
}

type MenuRoute = ViewRouteObject &
  Readonly<{
    path: string;
    handle: Required<MenuProps>;
  }>;


export default function MenuOnLeftLayout() {
  const matches = useViewMatches();
  const [filesInfo, setFilesInfo] = useState<Array<filesInfo>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hideNavigation, setHideNavigation] = useState(false);
  const currentTitle = matches[matches.length - 1]?.handle?.title ?? 'Unknown';
  const menuRoutes = (routes[0]?.children || []).filter(
    (route) => route.path && route.handle && route.handle.icon && route.handle.title
  ) as readonly MenuRoute[];

    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

  const location = useLocation()
    const { data } = location.state || {};
  const uniqueData = Array.from(new Set(data));

    useEffect(() => {
        setIsLoading(true);
        axios({
            method: "post",
            url: "/files",
            data: data,
        }).then((response) => {
            setFilesInfo(response.data);
            setIsLoading(false);
        });
    }, [data]);

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

    const {valid, invalid} = filesInfo.reduce((counts, file) => {
        if (file.isValid) {
            counts.valid++;
        } else {
            counts.invalid++;
        }
        return counts;
    }, {valid: 0, invalid: 0});

    let total = totalProcess+totalChoreography+totalConversation;

    const types = ["Process Collaboration", "Choreography", "Conversation"];

    const typeCounts = types.map((type) =>
        filesInfo.reduce((count, file) => {
            if (file.modelType === type) {
                count++;
            }
            return count;
        }, 0)
    );

    const dataModels = {
        labels: types,
        datasets: [
            {
                backgroundColor: [
                    'rgba(8,59,12, 0.2)',
                    'rgba(75, 192, 126, 0.2)',
                    'rgba(44, 147, 40, 0.2)',
                ],
                borderColor: [
                    'rgb(8,59,12, 1)',
                ],
                data: typeCounts,
                color: "rgb(8,59,12)",
            },
        ],
    };

    const options = {
        responsive:true,
        maintainAspectRatio:false,
        plugins: {
            legend: {
                display: false,
                position: 'top' as const,
            },
            title: {
                display: false,
                text: 'Chart.js Bar Chart',
            },
        }
    };

    useEffect(() => {
        const isTitleHidden = menuRoutes.some(({ handle: { title } }) => title === 'BPMN Models Inspection Dashboard');
        setHideNavigation(isTitleHidden);
    }, [menuRoutes]);

    return (
    <AppLayout className="block h-full" primarySection="drawer">
      <header slot="drawer">
        <h1 className="text-l m-0 center"><img style={{marginLeft:"4%", marginTop:"4%"}} src={logo} alt="" width="200"/></h1>
      </header>
      <Scroller slot="drawer" scroll-direction="vertical">
          <nav>
              {menuRoutes.map(({ path, handle: { icon, title } }) => (
                  currentTitle === 'BPMN Models Inspection Dashboard' ? null : (
                      <NavLink
                          className={({ isActive }) => `${css.navlink} ${isActive ? css.navlink_active : ''}`}
                          key={path}
                          to={path}
                      >
                          {({ isActive }) => (
                              <Item key={path} selected={isActive}>
                                  <span className={`${icon} ${css.navicon}`} aria-hidden="true"></span>
                                  {title}
                              </Item>
                          )}
                      </NavLink>
                  )
              ))}
          </nav>

          {data && (

              <div style={{position: 'absolute', top:"130px", height:"64%", width: "93%", backgroundColor: "#f6f6f6", border: "2px solid black", borderRadius: "10px", textAlign: "left", margin: "auto" }}>
                  <a style={{marginLeft:'5%',fontWeight:"bold"}}>Model Dashboard </a><CiCircleQuestion style={{fontSize:'18px',marginBottom:"3%",cursor:"help"}} title={"These are information about the collection of models inspected"}/>
                  <br/>
                  <a style={{color:'green',fontWeight:"bold", marginLeft:"5%"}}>{total}</a><a style={{marginLeft:"8%"}}>Total models inspected</a>
                  <br/>
                  <a style={{color:'green',fontWeight:"bold",marginLeft:"5%"}}>{totalProcess}</a><a style={{marginLeft:"8%"}}># Process Collaboration</a>
                  <br/>
                  <a style={{color:'green',fontWeight:"bold",marginLeft:"5%"}}>{totalChoreography}</a><a style={{marginLeft:"8%"}}># Choreography</a>
                  <br/>
                  <a style={{color:'green',fontWeight:"bold",marginLeft:"5%"}}>{totalConversation}</a><a style={{marginLeft:"8%"}}># Conversation</a>
                  <br/>
                  <br/>
                  <div style={{marginLeft:""}}>
                    <Pie options={options} data={dataModels}></Pie>
                  </div>
                  <br/>
                  <a style={{ marginLeft: '6%',fontWeight: "bold" }}>Active Filters </a>
                  <CiCircleQuestion style={{ fontSize: '18px', marginBottom: "3%", cursor: "help" }} title={"These are the filters activated for the inspection"} />
                  <br />
                  {
                      (uniqueData.length > 0) ? (
                          <>
                              <div style={{ marginTop: '1%',marginLeft: '1%'}}>
                                  {uniqueData.includes("english") && <span style={{ marginLeft: '10px' }} className='badge bg-success'>{"   english"}</span>}
                                  {uniqueData.includes("duplicated") && (uniqueData.includes("english") || uniqueData.includes(0) || uniqueData.includes(1) || uniqueData.includes(2) || uniqueData.includes(3) || uniqueData.includes(4) || uniqueData.includes(5) || uniqueData.includes(6)) && " "}
                                  {uniqueData.includes("duplicated") && <span style={{ marginLeft: '10px' }} className='badge bg-success'>{"   duplicated"}</span>}
                                  {(uniqueData.includes("english") || uniqueData.includes("duplicated")) && uniqueData.includes("invalid") && " "}
                                  {uniqueData.includes("invalid") && <span style={{ marginLeft: '10px' }} className='badge bg-success'>{"   invalid"}</span>}
                              </div>
                              <a style={{ marginLeft: '6%', fontWeight: "bold"}}>Models type excluded: </a>
                              <CiCircleQuestion style={{ fontSize: '18px', marginBottom: "3%", cursor: "help" }} title={"These type of models are excluded from the analysis"} />
                              <div style={{ marginTop: '1%',marginLeft: '1%'}}>
                                   {uniqueData.includes("process") && <span style={{ marginLeft: '10px' }} className='badge bg-warning'>{"   process"}</span>}
                                  {uniqueData.includes("choreography") && (uniqueData.includes("process") || uniqueData.includes(0) || uniqueData.includes(1) || uniqueData.includes(2) || uniqueData.includes(3) || uniqueData.includes(4) || uniqueData.includes(5) || uniqueData.includes(6) || uniqueData.includes("english") || uniqueData.includes("duplicated") || uniqueData.includes("invalid")) && " "}
                                  {uniqueData.includes("choreography") && <span style={{ marginLeft: '10px' }} className='badge bg-warning'>{"   choreography"}</span>}
                                  {uniqueData.includes("conversation") && (uniqueData.includes("process") || uniqueData.includes("choreography") || uniqueData.includes(0) || uniqueData.includes(1) || uniqueData.includes(2) || uniqueData.includes(3) || uniqueData.includes(4) || uniqueData.includes(5) || uniqueData.includes(6) || uniqueData.includes("english") || uniqueData.includes("duplicated") || uniqueData.includes("invalid")) && " "}
                                  {uniqueData.includes("conversation") && <span style={{ marginLeft: '10px' }} className='badge bg-warning'>{"   conversation"}</span>}
                              </div>
                          </>
                      ) : <span style={{ marginLeft: '10px' }} className='badge bg-secondary'>No filter</span>
                  }

              </div>
          )}

          <div style={{position: 'absolute', bottom: '5px', left: '0', width: '100%', margin: '0 auto'}}>
              <hr style={{color: 'red', backgroundColor:'#5b5b65', border:'none', height: '1px', margin: '5px 5%', width: '90%'}} />
              <div style={{textAlign: 'center'}}>
                  <p style={{fontSize:"15px", color: '#eae9e9"', margin: '0'}}>Version: 1.0.0</p>
                  <p style={{ fontSize: '16px', marginBottom: '2%', marginTop: '0' }}>
                      <HiAcademicCap style={{ marginBottom: '0.1cm', fontSize: '18px' }} />
                      <a
                          style={{ marginLeft: '1%', fontSize: '14px', marginRight: '10%',  color: "#005fdb", cursor: "pointer"}}
                          onClick={openModal}
                      >
                          References
                      </a>
                      <FaBug style={{ marginBottom: '0.1cm' }} />
                      <a style={{ marginLeft: '1%', fontSize: '14px' }} href="mailto:ivan.compagnucci@gmail.com">
                          Report a Bug
                      </a>
                      <br/>
                      <MdAlternateEmail style={{ marginBottom: '0.1cm' }} />
                      <a style={{ marginLeft: '1%', fontSize: '14px' }} href="mailto:ivan.compagnucci@gmail.com">
                          Contact
                      </a>
                  </p>

                  <Modal
                      style={{
                          overlay: {
                              backgroundColor: 'rgba(255, 255, 255, 0.67)', // Sfondo trasparente
                              zIndex: 2 // Imposta un valore di z-index superiore rispetto al bottone
                          },
                          content: {
                              width: '750px',
                              height: '550px',
                              margin: 'auto',
                              borderRadius: '8px',
                              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
                              zIndex: 2 // Imposta un valore di z-index superiore rispetto al bottone
                          }
                      }}
                      isOpen={isModalOpen}
                      onRequestClose={closeModal}
                  >
                      <h2 style={{top:"10px"}}><HiAcademicCap style={{marginBottom: '0.13cm', marginRight:"2%"}}/>References</h2>

                      <p>Tool's paper:</p>

                      <ul>
                          <li>Compagnucci, I., Corradini, F., Fornari, F., & Re, B. (2023). <strong>Inspector: A Tool for Extracting Features from BPMN Models.</strong> In <em>BPM (Demos / Resources Forum) 2023: 122-126.</em>
                            <pre>
                              <strong style={{color:"#c5a81e"}}>BPM 2023 Best Paper Award of the Demonstrations and Resources Forum</strong>
                            </pre>
                          </li>
                      </ul>

                      <p>Tool's use case:</p>
                      <ul>
                          <li>Compagnucci, I., Corradini, F., Fornari, F., & Re, B. (2024). <strong>A Study on the Usage of the BPMN Notation for Designing
                              Process Collaboration, Choreography, and Conversation Models.</strong> (Vol. 66, pp. 43-66). Springer. In <em>Business & Information Systems Engineering</em> on the special issue <em>"The Impact of the Business Process Model and Notation."</em></li>
                          <li style={{marginTop:"10px"}}>Compagnucci, I., Corradini, F., Fornari, F., & Re, B. (2021). <strong>Trends on the Usage of BPMN 2.0
                              from Publicly Available Repositories.</strong> In <em>International Conference on Perspectives in Business
                              Informatics Research</em>, LNBIP (Vol. 430, pp. 84–99). Springer </li>
                      </ul>
                      <button style={{color: 'white',backgroundColor:"#10ad73", fontSize: '15px', padding: '10px 10px', cursor: 'pointer', marginTop: '0.42cm'}} onClick={closeModal}>Close</button>
                  </Modal>

              </div>
          </div>
          </Scroller>
      <footer slot="drawer" />

      <DrawerToggle slot="navbar" aria-label="Menu toggle" ></DrawerToggle>
      <h2 slot="navbar" className="text-l m-0" >
        {currentTitle}
      </h2>


      <Suspense fallback={<Placeholder />}>
        <Outlet />
      </Suspense>

    </AppLayout>
  );
}
