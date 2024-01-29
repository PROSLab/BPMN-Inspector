/**
 * This module is generated from HelloReactEndpoint.java
 * All changes to this file are overridden. Please consider to make changes in the corresponding Java file if necessary.
 * @see {@link file:///C:/Users/User/Desktop/Software/BPMN-Inspector/src/main/java/com/example/application/endpoints/helloreact/HelloReactEndpoint.java}
 * @module HelloReactEndpoint
 */

// @ts-ignore
import client from './connect-client.default';
// @ts-ignore
import { EndpointRequestInit, Subscription } from '@hilla/frontend';


function _Duplicate(
 duplicate: string,
 __init?: EndpointRequestInit
): Promise<string>
{
 return client.call('HelloReactEndpoint', 'Duplicate', {duplicate}, __init);
}

function _Invalid(
 invalid: string,
 __init?: EndpointRequestInit
): Promise<string | undefined>
{
 return client.call('HelloReactEndpoint', 'Invalid', {invalid}, __init);
}

function _nonEnglish(
 nonEnglish: string,
 __init?: EndpointRequestInit
): Promise<string | undefined>
{
 return client.call('HelloReactEndpoint', 'nonEnglish', {nonEnglish}, __init);
}
export {
  _Duplicate as Duplicate,
  _Invalid as Invalid,
  _nonEnglish as nonEnglish,
};
