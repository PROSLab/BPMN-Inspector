import HelloReactView from 'Frontend/views/helloreact/HelloReactView.js';
import MainLayout from 'Frontend/views/MainLayout.js';
import { lazy } from 'react';
import { createBrowserRouter, IndexRouteObject, NonIndexRouteObject, useMatches } from 'react-router-dom';
import DocView from "Frontend/views/documentation/DocView";
import GithubView from "Frontend/views/github/GithubView";
import PostProcessingView from "Frontend/views/postProcessing/PostProcessingView";

const AboutView = lazy(async () => import('Frontend/views/about/AboutView.js'));
export type MenuProps = Readonly<{
  icon?: string;
  title?: string;
}>;

export type ViewMeta = Readonly<{ handle?: MenuProps }>;

type Override<T, E> = Omit<T, keyof E> & E;

export type IndexViewRouteObject = Override<IndexRouteObject, ViewMeta>;
export type NonIndexViewRouteObject = Override<
  Override<NonIndexRouteObject, ViewMeta>,
  {
    children?: ViewRouteObject[];
  }
>;
export type ViewRouteObject = IndexViewRouteObject | NonIndexViewRouteObject;

type RouteMatch = ReturnType<typeof useMatches> extends (infer T)[] ? T : never;

export type ViewRouteMatch = Readonly<Override<RouteMatch, ViewMeta>>;

export const useViewMatches = useMatches as () => readonly ViewRouteMatch[];


export const routes: readonly ViewRouteObject[] = [
  {
    element: <MainLayout />,
    handle: { icon: 'null', title: 'Main' },
    children: [
      { path: '/', element: <HelloReactView/>, handle: { icon: 'la la-globe', title: 'Home' } },
      { path: '/documentation', element: <DocView />, handle: { icon: 'la la-file', title: 'Documentation' } },
      { path: '/about', element: <AboutView />, handle: { icon: 'la la-info-circle', title: 'About' } },
      { path: '/github', element: <GithubView />, handle: { icon: 'la la-github', title: 'Github' } },
      { path: '/inspect', element: <PostProcessingView />, handle: {  title: 'BPMN Models Inspection Dashboard' } },
    ],
  },
];

const router = createBrowserRouter([...routes]);
export default router;
