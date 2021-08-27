/*Copyright (c) 2020 Citrix Systems, Inc.
The materials in this file are protected by copyright and other intellectual property laws.
Copying and use is permitted only by end users to enable use of Citrix server technology.
Any other reproduction or use of this file, or any portion of it, is unlicensed.
In no event may the file be reverse engineered or may copies be made in association with deobfuscation, decompilation or disassembly.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.*/

var RELATIVE_SOURCE_PATH;
var citrixHTML5Launcher_cdn = (function(){

	function addScriptWithSRI(filelist, onSuccessCallback, onErrorCallback) {
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
			var fileName = script.src.split("/");
			fileName = fileName[fileName.length-1];
			if(typeof SRIOfScripts !== "undefined" && SRIOfScripts[fileName]){
				script["integrity"] = SRIOfScripts[fileName];
				script["crossOrigin"] = "anonymous";
			}
			document.body.appendChild(script);
		}
}

if(typeof window != "undefined" )
{
		var engine;
		var eventArray = new Array(0);
		var version = "21.08.2.7"; // This should be updated during build.
		var CDN_BASE_URL = "https://html5cdn.cloud.com/ReceiverUpdates/Prod/Receiver/HTML5/";
		window.clientURL = CDN_BASE_URL+version+"/HTML5Out/";
  		window.configurationPath = window.clientURL; //We will always pick configuration from one location that is outer one
	RELATIVE_SOURCE_PATH = {
		'filepath' : "src/",                          // src folder path
		'imagepath' : "resources/",                   // resources folder path
		'localizationpath' : "locales/",              // locales folder path
		'thirdpartypath' : "ThirdPartyLibrary/",       // 3rd party lib path
		'workerpath' : "./HDXLauncher.js",  // main launcher path for worker
		'csspath' : "CascadingStyleSheet/"             // css folder path
	};

		var sessionId;
		var engineType = "HTML5Engine";
		var preferredLang;
		var selfDomain = window.location.origin ? window.location.origin : (window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : ''));
		var fallbackEnginePath="";

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
			engine = new HTML5Engine();
			engine.setConfigurationPath(window.configurationPath);
			engine.setSessionId(sessionId);
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

			engine.setParameter({'ui':{'root':"citrixuiElement"}});
			engine.setParameter({'ica':{'type':"unknown"}});

			//To translate based on the browser's langugage
			var lang = (!preferredLang)?navigator.language : preferredLang;
			if(lang==null || lang==undefined){
				lang = navigator.browserLanguage; //IE 10 returns navigator.language as undefined.
			}
			engine.setParameter({'preferences' : {'lang' : lang }});

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
									addScriptWithSRI([window.clientURL + "src/SessionWindow.js"], startHTMLSession, closeHTML5Session);
									break;
				case 'log':
									addScriptWithSRI([window.clientURL + "src/Business/log.js"], openLogPage, function(){
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

		//if CDN is inaccessible then falling back to locally installed engine path
		function loadScriptAndInitMainEngine(loadEngineCallback) {
			if ('undefined' === typeof SRIOfScripts) {
				window.clientURL = "../";
				window.configurationPath = window.clientURL; //configuration path is set to outer folder path, which will be used irrespective of legacy or non-legacy browser
			}
			//sets the 'clientURL' based on underlying browser. Loading engine, even if we fail to check browser
			addScriptWithSRI([window.clientURL + "src/LegacyBrowserCheck.js"], function () {
				LegacyBrowserCheck.isLegacyBrowser(window.clientURL, addScriptWithSRI, function (result) {
					if (result) {
						window.clientURL = window.clientURL + "legacy/";
						console.log("citrixHTML5Launcher_cdn :  Browser detected as Legacy");
					}
					loadEngineCallback();
				});
			}, function (err) {
				console.log("Unable to check if browser is legacy, assuming it's a modern browser", err);
				loadEngineCallback();
			});
		}

		loadScriptAndInitMainEngine(loadEngine);

	// To be used when posting ICA data via message to HTML5 Workspace app
		window.addEventListener("message", function(event) {
			if (engine) {
				engine.handleMessage(event);
			}else{
				eventArray[eventArray.length] = event;
			}		
		}, false);	
  
}else{
	HTML5LocationParam = new Array(0);
	(function() {
		var key_Values = location.href.split('?')[1].split('&');
		for (var i = 0; i < key_Values.length; i++) {
			var key_Value = key_Values[i].split("=");
			if (key_Value.length == 2)
				HTML5LocationParam[key_Value[0]] = key_Value[1];
		}
	})();
	importScripts(HTML5LocationParam["filepath"] + "workerhelper.js");
}

	
})();
