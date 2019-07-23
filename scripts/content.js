/*
 *  Coded by Sai Tanay Desaraju
 *	07/23/19
 */

let injection = document.createElement("script");
injection.src = chrome.runtime.getURL("scripts/script.js");
document.head.appendChild(injection);