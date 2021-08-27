/*Copyright (c) 2020 Citrix Systems, Inc.
The materials in this file are protected by copyright and other intellectual property laws.
Copying and use is permitted only by end users to enable use of Citrix server technology.
Any other reproduction or use of this file, or any portion of it, is unlicensed.
In no event may the file be reverse engineered or may copies be made in association with deobfuscation, decompilation or disassembly.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.*/

function getQueryParams(){
	var queryParams = [];
	var temp = location.href.split('?');
	if(temp && temp[1]){
		var key_Values = temp[1].split('&');
		for (var i = 0; i < key_Values.length; i++) {
			var key_Value = key_Values[i].split("=");
			if (key_Value.length == 2)
				queryParams[key_Value[0]] = key_Value[1];
		}
	}
	return queryParams;
}

function getHashParams(){
	var hashParams = [];
	var temp = location.href.split('?');
	if(temp && temp[1]){
		var key_Values = temp[1].split('#');
		if(key_Values){
			for (var i = 0; i < key_Values.length; i++) {
				var key_Value = key_Values[i].split("=");
				if (key_Value.length == 2)
					hashParams[key_Value[0]] = key_Value[1];
			}
		}
	}
	return hashParams;
}

function addScriptToLauncher(filelist, onSuccessCallback, onErrorCallback) {
	var loadedFileCount = 0;
	var totalFileCount = filelist.length;
	var errorStatus = false;

	function onload() {
		loadedFileCount ++;
		if(totalFileCount === loadedFileCount) {
			errorStatus ? onErrorCallback() : onSuccessCallback();
		}
	}
	function onLoadSuccess() {
		onload();
	}

	function onLoadError() {
		errorStatus = true;
		onload();
	}

	for(var i = 0; i < totalFileCount; i++) {
		var script = document.createElement('script');
		script.src = filelist[i];
		script.async = false;
		script.onload = onLoadSuccess;
		script.onerror = onLoadError;
		document.body.appendChild(script);
	}
}

if(typeof window != "undefined" )
{		
		var engine;
		var sessionId;
		var SRIOfScripts = {};//TODO when CDN implemented for On Prem. Declaring this to avoid errors in code.
		/*
		* Will be relative path for session launch via Storefront.
		* In case of session launch via SDK then we need client path. This will be set in HDXLauncher.js for SDK.
		*/
		var clientURL = "../";
		var RELATIVE_SOURCE_PATH = {
			'filepath' : "src/",                          // src folder path
			'imagepath' : "resources/",                   // resources folder path
			'localizationpath' : "locales/",              // locales folder path
			'thirdpartypath' : "ThirdPartyLibrary/",       // 3rd party lib path
			'workerpath' : "./citrixHTML5Launcher.js",  // main launcher path for worker
			'csspath' : "CascadingStyleSheet/"             // css folder path
		};
		var eventArray = new Array(0);
		var appViewMode = false;// used in session window
		window.isSDK = false;
				
		//Chrome HDX SDK - To get the launch id to set the session id		
		var hashParams = getHashParams();
		sessionId = (hashParams && hashParams["launchid"])? hashParams["launchid"] : null;
		
		//Chrome HDX SDK - To check if the session is embedded using appview
		var queryParams = getQueryParams();
		appViewMode = (queryParams && queryParams["appView"]) ? queryParams["appView"] : false;
		var engineType = "HTML5Engine";
		var selfDomain = window.location.origin ? window.location.origin : (window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : ''));
	
		//Engine type to load log or multimonitor page
		function fetchEngineType(){
			var key_Values = location.href.split('#');								
				
			if(key_Values[1]){
				//Fetching the engineType
				var key_Value = key_Values[1].split("=");
				if (key_Value.length == 2 && key_Value[0] === "engineType"){					
					engineType = key_Value[1];												
				}									
			}
}
		function startHTMLSession( ){
			engine = new HTML5Engine( );
			engine.setSessionId(sessionId);
			engine.setParameter({'ui':{'root':"citrixuiElement"}});
			engine.setParameter({'ica':{'type':"unknown"}});
			engine.setParameter({
				'sourcecode' : {
					'filepath' : clientURL+ RELATIVE_SOURCE_PATH['filepath'],                          // src folder path
					'imagepath' : clientURL+RELATIVE_SOURCE_PATH['imagepath'],                   // resources folder path
					'localizationpath' : clientURL+RELATIVE_SOURCE_PATH['localizationpath'],              // locales folder path
					'thirdpartypath' : clientURL+RELATIVE_SOURCE_PATH['thirdpartypath'],       // 3rd party lib path
					'workerpath' : RELATIVE_SOURCE_PATH['workerpath'],  // main launcher path for worker
					'csspath' : clientURL+RELATIVE_SOURCE_PATH['csspath']             // css folder path
				}
			});
			//Setting configuration path to null, sets it to default path - HTML5Client/Configuration.js
			engine.setConfigurationPath(null);
			engine.initEngine( );
			if(eventArray.length > 0){
				engine.handleMessage(eventArray, eventArray.length);
				eventArray = new Array(0);
			}			
		}
		
		//If SessionWindow.js file is not reachable then throw onConnectionClosed event
		function closeHTML5Session(){
			var parentWindow = (window.opener || window.parent);
			if(parentWindow){
				parentWindow.postMessage({"type":"onConnectionClosed","sessionId": sessionId,"data":"UNREACHABLE_CLIENT","source":"HTML5Client"},selfDomain);				
			}			
			window.close();
		}
		
		//Loads the log dependent files 
		function openLogPage(){
			var uiElement = document.getElementById("citrixuiElement");
			uiElement.parentElement.removeChild(uiElement);			
			
			loadDependentFiles({
								'sourcecode' : {                                     
                                    'localizationpath' : clientURL+RELATIVE_SOURCE_PATH['localizationpath'],              // locales folder path
                                    'thirdpartypath' : clientURL+RELATIVE_SOURCE_PATH['thirdpartypath'],       // 3rd party lib path
                                    'csspath' : clientURL+RELATIVE_SOURCE_PATH['csspath']             // css folder path
                                }
            });
		}
		
		//Loads appropriate engine
		function loadEngine(){
			
			fetchEngineType();
			
			switch(engineType){
				case 'HTML5Engine' :
									addScriptToLauncher([clientURL + "src/SessionWindow.js"], startHTMLSession, closeHTML5Session);
									break;
				case 'log':			
									addScriptToLauncher([clientURL + "src/Business/log.js"], openLogPage, function(){
										window.close();										
									});
									break;
				case 'displayWindow' : //Do nothing added as placeholder to handle anything in future if required
											break;
				default : 
						console.log("Unrecognized engine type");
						break;
			}
		}

		function loadScriptAndInitMainEngine() {

			addScriptToLauncher([window.clientURL + "src/LegacyBrowserCheck.js"], function () {
				LegacyBrowserCheck.isLegacyBrowser(window.clientURL, addScriptToLauncher,function (result) {
					if (result) {
						clientURL = "../legacy/";
						console.log("citrixHTML5Launcher :  Browser detected as Legacy");
					}
					loadEngine();
				});
			}, function (err) {
				console.log("Unable to check if browser is legacy, assuming it's a modern browser", err);
				loadEngine();
			});
		}

		loadScriptAndInitMainEngine();

		// To be used when posting ICA data via message to HTML5 Workspace app
		window.addEventListener("message", function(event) {
			if (engine) {
				engine.handleMessage(event);
			}else{
				eventArray[eventArray.length] = event;
			}		
		}, false);		
}else{
	var HTML5LocationParam = new Array(0);
	(function() {	
		HTML5LocationParam = getQueryParams();
	})();
	importScripts(HTML5LocationParam["filepath"] + "workerhelper.js");
}
