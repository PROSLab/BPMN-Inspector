import { AppLayout } from '@hilla/react-components/AppLayout.js';
import { DrawerToggle } from '@hilla/react-components/DrawerToggle.js';
import { Item } from '@hilla/react-components/Item.js';
import { Scroller } from '@hilla/react-components/Scroller.js';
import Placeholder from 'Frontend/components/placeholder/Placeholder.js';
import { MenuProps, routes, useViewMatches, ViewRouteObject } from 'Frontend/routes.js';
import React, { Suspense } from 'react';
import {NavLink, Outlet, useLocation} from 'react-router-dom';
import css from './MainLayout.module.css';
import logo from "./../img/logo.png"
import {MdAlternateEmail, MdOutlineMarkEmailUnread} from "react-icons/all";
import {CiCircleQuestion} from "react-icons/ci";

type MenuRoute = ViewRouteObject &
  Readonly<{
    path: string;
    handle: Required<MenuProps>;
  }>;

export default function MenuOnLeftLayout() {
  const matches = useViewMatches();
  const currentTitle = matches[matches.length - 1]?.handle?.title ?? 'Unknown';
  const menuRoutes = (routes[0]?.children || []).filter(
    (route) => route.path && route.handle && route.handle.icon && route.handle.title
  ) as readonly MenuRoute[];

  const location = useLocation()
    const { data } = location.state || {};
  const uniqueData = Array.from(new Set(data));

  return (
    <AppLayout className="block h-full" primarySection="drawer">
      <header slot="drawer">
        <h1 className="text-l m-0"><img src={logo} alt="" width="200"/></h1>
      </header>
      <Scroller slot="drawer" scroll-direction="vertical">
        <nav>
          {menuRoutes.map(({ path, handle: { icon, title } }) => (
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
          ))}
        </nav>

          {data && (
              <div style={{position: 'absolute', bottom: '100px',height: "10%", width: "93%", backgroundColor: "#f6f6f6", border: "2px solid black", borderRadius: "10px", textAlign: "left", margin: "auto" }}>

                  <a style={{marginLeft:'27%',fontWeight:"bold"}}>Active filters </a><CiCircleQuestion style={{fontSize:'18px',marginBottom:"3%",cursor:"help"}} title={"These are the filters activated for the inspection"}/>
                  <br/>
                  {uniqueData[0] || uniqueData[1] || uniqueData[2] ? (
                      <>
                          {uniqueData[0] && <span style={{marginLeft:'10px'}} className='badge bg-success'>{"   "+uniqueData[0]}</span>}
                          {uniqueData[0] && uniqueData[1] && " "}
                          {uniqueData[1] && <span style={{marginLeft:'0px'}} className='badge bg-success'>{"   "+uniqueData[1]}</span>}
                          {(uniqueData[0] || uniqueData[1]) && uniqueData[2] && " "}
                          {uniqueData[2] && <span style={{marginLeft:'0px'}} className='badge bg-success'>{"   "+uniqueData[2]}</span>}
                      </>
                  ) : <span style={{marginLeft:'38%'}} className='badge bg-secondary'>No filter</span>}
              </div>
          )}

          <div style={{position: 'absolute', bottom: '20px', left: '0', width: '100%', margin: '0 auto'}}>

              <hr style={{color: 'red', backgroundColor:'#5b5b65', border:'none', height: '1px', margin: '10px 5%', width: '90%'}} />
              <div style={{textAlign: 'center'}}>
                  <p style={{fontSize:"15px", color: '#eae9e9"', margin: '0'}}>Version: 0.5.0</p>
                  <p style={{fontSize:'14px', margin: '5px 0'}}> <MdAlternateEmail style={{marginBottom:"0.1cm"}}/> <a style={{marginLeft:"1%", fontSize:"14px"}} href="mailto:ivan.compagnucci@unicam.it"> Contact</a></p>
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
