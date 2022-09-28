'use strict'

import { registerRoute } from '../../routes';
import ReleaseMgrMainPanel from './ReleaseMgrMainPanel.vue';
import store from '../../store'
import axios from 'axios';
import Vue from 'vue'


registerRoute(ReleaseMgrMainPanel, {
	Settings: {
		ReleaseMgr: {
			icon: 'mdi-application-cog',
			caption: 'ReleaseMgr',
			path: '/ReleaseMgr'
		}
	}
});

//putting a try and catch around this to stop it erroring if no internet or other unexpected problem
try{
	var tmpSession = {
			checkOnLoad: false,
			lastVersion: null,
			alertOnce: true
		};
	var bfwVersion = "";
	var bfwName = "";
	getFromCache()
	//timeout to allow the board details in the OM to be loaded
	setTimeout(runCheck, 10000)
	//runCheck();
}catch(e) {
	console.warn("ReleaseMgr: Unable to do version check - ", e)
}


function runCheck(){
	if(tmpSession.checkOnLoad){
		//console.log("model ", store._modulesNamespaceMap['machine/model/'].state.boards[0].firmwareName)
		//console.log("version ", store._modulesNamespaceMap['machine/model/'].state.boards[0].firmwareVersion)
		console.info("ReleaseMgr: Version Checking Enabled")
		bfwName = store._modulesNamespaceMap['machine/model/'].state.boards[0].firmwareName;
		bfwVersion = store._modulesNamespaceMap['machine/model/'].state.boards[0].firmwareVersion;
		//bfwVersion = '3.4.1'
		if(typeof bfwVersion !== "undefined" && typeof bfwName !== "undefined" && bfwName && bfwVersion){
			checkVerUpdate();
		}else(
			console.warn("ReleaseMgr: No board detected for Version Check")
		)
	}else{
		console.info("ReleaseMgr: Version Checking Disabled")
	}
}

async function checkVerUpdate(){
	if(fwSrc() == 'gloomyandy'){
		const relJSONcheckGet = await getByGitAPI('releases', 'gloomyandy', 'RepRapFirmware');
		const relJSONcheck = await relJSONcheckGet;
		if(relJSONcheck){
			//re-order by date release published
			var relJSONcheckFiltered = relJSONcheck.sort((a, b) => (a.published_at < b.published_at) ? 1 : -1)
			relJSONcheckFiltered = relJSONcheckFiltered.filter(item => (item.tag_name >= "v3.3"));
			if(tmpSession.lastVersion != relJSONcheckFiltered[0].tag_name){
				tmpSession.lastVersion = relJSONcheckFiltered[0].tag_name;
				console.info("ReleaseMgr: New Release Found")
				pushToCache();
			}else{
				if(tmpSession.alertOnce){
					console.info("ReleaseMgr: Duplicate Release")
					return;
				}
			}
			if(relJSONcheckFiltered[0].tag_name.substring(1) > bfwVersion){
				Vue.prototype.$makeNotification('info', 'ReleaseMgr', 'A new Team Gloomy firmware update has been released. Open ReleaseMgr to see details');
			}
		}else{
			console.warn("ReleaseMgr : Unable to retrieve git data");
		}
	}else {
		const relJSONcheckGet2 = await getByGitAPI('releases', 'Duet3D', 'RepRapFirmware');
		const relJSONcheck2 = await relJSONcheckGet2;
		if(relJSONcheck2){
			//re-order by date release published
			var relJSONcheckFiltered2 = relJSONcheck2.sort((a, b) => (a.published_at < b.published_at) ? 1 : -1)
			relJSONcheckFiltered2 = relJSONcheckFiltered2.filter(item => (item.tag_name >= "3.3" && !(item.tag_name.charAt(0)=='v')));
			if(tmpSession.lastVersion != relJSONcheckFiltered2[0].tag_name){
				tmpSession.lastVersion = relJSONcheckFiltered2[0].tag_name;
				console.info("ReleaseMgr: New Release Found")
				pushToCache();
			}else{
				if(tmpSession.alertOnce){
					console.info("ReleaseMgr: Duplicate Release")
					return;
				}
			}
			if(relJSONcheckFiltered2[0].tag_name > bfwVersion){
				Vue.prototype.$makeNotification('info', 'ReleaseMgr', 'A new RepRap firmware update has been released. Open ReleaseMgr to see details');
			}
		}else{
			console.warn("ReleaseMgr : Unable to retrieve git data");
		}
	}
}

async function getByGitAPI(apiURLSuffix, gitUName, gitRepoName){
	//use the gthub api to retrieve json data
	//apiURL suffix should be "releases/latest" for example
	//returns null for anything other than success unless connection error
	if(apiURLSuffix && gitUName && gitRepoName){
		const retJson = await axios.get(`https://api.github.com/repos/${gitUName}/${gitRepoName}/${apiURLSuffix}`)
		.then(res => res.data)
		.catch(function(error){
			console.warn("Git Raw File error : " + error);
			return {error: " getByGitAPI xhr error"};
		})
		const apiJson = await retJson
		if(apiJson.message) {
			console.warn("ReleaseMgr: GIT API error - " + apiJson.message);
			return null;
		}else{
			return apiJson;
		}
	}else{
		console.warn("ReleaseMgr: Required Values not Provided to use git API");
		return null;
	}
}

function getFromCache() {
	var tmpString = localStorage.getItem('releaseMgrSettings');
	if(tmpString) {
		tmpSession = JSON.parse(tmpString);
	} else {
		tmpSession = {
			checkOnLoad: false,
			lastVersion: null,
			alertOnce: true
		};
	}
}

function pushToCache() {
	//console.log("saving")
	localStorage.setItem('releaseMgrSettings', JSON.stringify(tmpSession));
}

function fwSrc(){
	if(typeof bfwName !== "undefined"){
		if(bfwName.toLowerCase().includes('duet') || bfwName == ""){
			console.info("ReleaseMgr: Duet Firmware Identified")
			return 'Duet3D'; 
		}else {
			console.info("ReleaseMgr: Gloomy Firmware Identified")
			return 'gloomyandy';
		}
	}else{
		console.info("ReleaseMgr: No Firmware Identified")
		return ""
	}
}



