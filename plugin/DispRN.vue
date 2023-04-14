<style>
	.rMgrv-cardRLM {
		display: flex !important;
		flex-direction: column;
		height: calc(100vh - 300px);
	}

	.rMgrv-mainCardRLM {
		height: calc(100vh - 340px) !important;
	}

	.rMgrv-cardRLM__text {
		flex-grow: 1;
		overflow-y: auto;
		overflow-x: hidden;
	}

	.probe-span {
		border-radius: 5px;
	}
	.probe-span:not(:last-child) {
		margin-right: 8px;
	}
	.rlMgrVchip {
		white-space: normal !important;
		height: auto !important;
		text-align: center !important; 
		min-height: 35px !important;
	}
</style>
<template>
	<v-card flat outlined class="pa-0 ma-0 rMgrv-mainCardRLM">
		<v-card elevation="3" class="pa-0 ma-0 rMgrv-cardRLM">
			<v-card-title>
				<v-row class="pa-0 ma-0 ">
					<v-chip class="rlMgrVchip" color="info">Release Notes</v-chip><v-spacer></v-spacer>
					<v-chip v-if="rnJSON.gRName == gitRepoNameDuet" class="rlMgrVchip" :color="confGLineMatchCol">G Code</v-chip>
					<v-chip v-if="rnJSON.gRName == gitRepoNameDuet" class="rlMgrVchip" :color="shortNLineMatchCol">HW</v-chip>
					<v-chip v-if="rnJSON.gRName == gitRepoNameDuet" class="rlMgrVchip" :color="dualHWGCMatchLineColor">Both</v-chip>
				</v-row>
			</v-card-title>
			<v-card-text outlined class="rMgrv-cardRLM__text" v-if="currReleaseJSON">
				<v-expansion-panels v-for="(rel, i) in currReleaseJSON.releases" :key="i" accordion multiple focusable v-model="bExpRel[i]">
					<v-expansion-panel expand  :key="i">
						<v-expansion-panel-header expand-icon="mdi-sort-ascending" :color="rel.color" :title="rel.hover">{{ rel.release }}</v-expansion-panel-header>
						<v-expansion-panel-content>
							<v-expansion-panels v-for="(sec, j) in rel.sections" :key="j" multiple focusable v-model="bExpSec[j]">
								<v-expansion-panel :key="j" inset>
									<v-expansion-panel-header expand-icon="mdi-sort-ascending" :color="sec.color" :title="sec.hover" >{{ sec.section }}</v-expansion-panel-header>
									<v-expansion-panel-content>
										<span v-for="(content, k) in sec.lines" :key="k">
											<span :title="content.line.hover" :key="k"><div v-html="content.line.text" :class="`${content.line.colour} pa-1`"></div></span>
											<!-- <span v-if="sec.section == 'Object model changes:'">{{content.line.text}}</span> -->
										</span>
									</v-expansion-panel-content>
								</v-expansion-panel>
							</v-expansion-panels>
						</v-expansion-panel-content>
					</v-expansion-panel>
				</v-expansion-panels>
			</v-card-text>
		</v-card>
	</v-card>
</template>

<script lang="ts">

import Vue from "vue";
import store from "@/store";
import * as tempENLang from './en';
import { DisconnectedError, OperationCancelledError } from '@/utils/errors';
import Path from '@/utils/path'
//import { marked } from 'marked';


export default Vue.extend({
	props: {
		rnJSON: {
			type: Object
		},
		rMgrData:{
			type: Object
		},
		selectedTag: String
    },
	
	computed: {
		systemDirectory(): string {
			return store.state.machine.model.directories.system;
		},
		systemCurrIP(): any {
			return store.state.machine.model.network.interfaces[0].actualIP;
		},
		systemDSFVerStr(): any {
			return store.state.machine.model.state.dsfVersion;
		},
		darkTheme(): any {
			return store.state.settings.darkTheme;
		}, 
		tmpLang(): any {
			return tempENLang.tmpLangObj().plugin.ReleaseMgr;
		},
		rnHWLookup(): any {
			return this.rMgrData.boards;
		},
		systemBoardSNames(): any {
			if(this.bHiddenTestData){
				return this.rMgrData.testData;
			}else{
				return store.state.machine.model.boards
			}		
		},
		bHiddenTestData(): boolean {
			try{
				if(store.state.machine.model.global.has("releaseMgrTestData")){
					if(store.state.machine.model.global.get("releaseMgrTestData")){
						return true;
					}else{
						return false;
					}
				}else{
					return false;
				}
			}catch(e){
				console.log("err", e)
				return false;
			}
		},
		bIsSBC(): boolean {
			if(this.systemDSFVerStr !== null && this.systemDSFVerStr !== ''){
				return true;
			}else{
				return false;
			}
		},
		confGLineMatchCol(): string {
			if(!this.darkTheme){
				return "red lighten-3 black--text";
			}else{
				return "red lighten-3 black--text"
			}
		},
		confGCodeMatchCol(): string {
			if(!this.darkTheme){
				return "pink accent-3 black--text";
			}else{
				return "pink accent-3 black--text";
			}
		},
		shortNLineMatchCol(): string {
			if(!this.darkTheme){
				return "blue lighten-4";
			}else{
				return "blue lighten-4 black--text";
			}
		},
		shortNMatchHWCol(): string {
			if(!this.darkTheme){
				return "blue darken-4";
			}else{
				return "blue darken-4";
			}
		},
		dualHWGCMatchLineColor(): string {
			if(!this.darkTheme){
				return "purple lighten-4";
			}else{
				return "purple darken-4";
			}
		}		
	},

	data () {
		return {
			bExpRel: [[0]] as any,
			bExpSec: [[0]] as any,
			currBSN: null as any,
			panelJSON: {releases:[]} as any,
			gitOwnerNameDuet: 'Duet3D',
			gitOwnerNameGloomy: 'gloomyandy',
			gitRepoNameDuet: "RepRapFirmware",
			gitSBCRepoNameDuet: "DuetSoftwareFramework", 
			gitRepoNameGloomy: "RepRapFirmware",
			gitDWCRepoNameDuet: "DuetWebControl",
			confGText: null as any,
			duetDocsURL: 'https://docs.duet3d.com/en/User_manual/Reference/Gcodes/',
			currReleaseJSON: null as any
			
		}
	},

	mounted(){
		this.startUp();
	},

	methods: {
	
		async startUp(){
			if(this.rnJSON){
				if(this.rnJSON.gUName == this.gitOwnerNameDuet && this.rnJSON.gRName == this.gitRepoNameDuet){
					this.panelJSON = this.filterDuetRNJSON();
					this.confGText = await this.loadConfGFile().then(res => res);
					this.highlightRN();
				}
				if(this.rnJSON.gUName == this.gitOwnerNameDuet && this.rnJSON.gRName == this.gitSBCRepoNameDuet){
					this.panelJSON = this.filterDuetSBCRNJSON();
					this.reFormatCodeBlockLine();
					this.currReleaseJSON = null;
					this.currReleaseJSON = JSON.stringify(this.panelJSON);
					this.currReleaseJSON = JSON.parse(this.currReleaseJSON);
				}
				if(this.rnJSON.gUName == this.gitOwnerNameDuet && this.rnJSON.gRName == this.gitDWCRepoNameDuet){
					this.panelJSON = this.filterDuetSBCRNJSON();
					this.reFormatCodeBlockLine();
					this.currReleaseJSON = null;
					this.currReleaseJSON = JSON.stringify(this.panelJSON);
					this.currReleaseJSON = JSON.parse(this.currReleaseJSON);
				}
			}
		}, 

		reFormatCodeBlockLine(){
			let rel: any = 0;
			for(rel in this.panelJSON.releases){
				let currRel = this.panelJSON.releases[rel];
				let sec: any = 0;
				for(sec in currRel.sections){
					//sections
					let currSec = currRel.sections[sec]
					let lin: any = 0;
					for(lin in currSec.lines){
						//lines
						let currLine = currSec.lines[lin].line;
						if(currLine.text.includes("<pre><code>")){
							//fix word wrapping
							currLine.text = currLine.text.replace('<pre><code>', '<ul><li><code>');
							currLine.text = currLine.text.replace('</code></pre>', '</code></li></ul>')
						}
					}
				}
			}
		},

		getTagSubNumber(type: string, releaseTag: string){
			let tmpType = type.toLowerCase();
			let tmpRTag = releaseTag.toLowerCase();
			let tmpBetaNumber = "";
			//console.log("tmpType", tmpType)
			//console.log("tmpRTag", tmpRTag)
			if(tmpType == 'beta'){
				if(tmpRTag < '3.5.0-beta.3'){
					tmpBetaNumber = tmpRTag.slice(tmpRTag.toLowerCase().indexOf('beta')+4);
				}else{
					tmpBetaNumber = tmpRTag.slice(tmpRTag.toLowerCase().indexOf('beta')+5);
				}
			}else if(tmpType == 'rc'){
				tmpBetaNumber = tmpRTag.slice(tmpRTag.toLowerCase().indexOf('rc')+2);
			}
			if(tmpBetaNumber.includes("+")){
				tmpBetaNumber = tmpBetaNumber.slice(0, tmpBetaNumber.length-1)
			}
			//console.log("tmpBetaNumber", parseInt(tmpBetaNumber))
			return parseInt(tmpBetaNumber);
		},

		getSBCTagSubNumber(type: string, releaseTag: string){
			let tmpType = type.toLowerCase();
			let tmpRTag: any  = releaseTag.toLowerCase();
			let tmpBetaNumber = 0;
			//reformat if beta/rc version 3.5-b1 or lower by checking for old style release syntax
			const betaRex: RegExp = new RegExp('beta.[0-9]+');
			const rcRex: RegExp = new RegExp('rc.[0-9]+');
			if(!betaRex.test(tmpRTag)){
				if(tmpType=="beta"){tmpType = "-b"};
			}else{
				if(tmpType=="beta"){tmpType = "-beta."};
			}
			if(!rcRex.test(tmpRTag)){
				if(tmpType=="rc"){tmpType = "-rc"};
			}else{
				if(tmpType=="rc"){tmpType = "-rc."};
			}
			tmpBetaNumber = parseInt(tmpRTag.slice(tmpRTag.toLowerCase().indexOf(tmpType)+tmpType.length));
			//console.log("getSBCTagSubNumber", tmpBetaNumber)
			return tmpBetaNumber;
		},

		getSBCTag(type: string, releaseTag: string){
			let tmpType = type.toLowerCase();
			let tmpRTag: any = releaseTag.toLowerCase();
			//reformat if beta/rc version 3.5-b1 or lower by checking for old style release syntax
			const betaRex: RegExp = new RegExp('beta.[0-9]+');
			const rcRex: RegExp = new RegExp('rc.[0-9]+');
			if(!betaRex.test(tmpRTag)){
				if(tmpType=="beta"){tmpType = "-b"};
			}else{
				if(tmpType=="beta"){tmpType = "-beta."};
			}
			if(!rcRex.test(tmpRTag)){
				if(tmpType=="rc"){tmpType = "-rc"};
			}else{
				if(tmpType=="rc"){tmpType = "-rc."};
			}
			//console.log("getSBCTag", tmpRTag.substring(0, tmpRTag.toLowerCase().indexOf(tmpType)+tmpType.length))
			return tmpRTag.substring(0, tmpRTag.toLowerCase().indexOf(tmpType)+tmpType.length);
		},

		filterDuetSBCRNJSON(){
			if(this.rnJSON.class == "rn" && this.rnJSON.releases.length > 0){
				//console.log("rnJSON", this.rnJSON)
				//Filtering for Duet ReleaseNotes
				let tmpJSON: any = {releases: [], relType: this.rnJSON.relType, selTag: this.rnJSON.selTag, gUName: this.rnJSON.gUName, class: this.rnJSON.class};
				if(this.rnJSON.relType.toLowerCase() == "beta" || this.rnJSON.relType.toLowerCase() == "rc"){
					//filter the notes to the relevant sections (cumlative so if beta3 then include beta2 & beta1) based on selected release tag
					//trim the v at the begining if it exits
					let trmTag: string = '';
					if(this.rnJSON.selTag.substring(0,1) === 'v'){
						trmTag = this.rnJSON.selTag.substring(1);
					}else{
						trmTag = this.rnJSON.selTag;
					}
					let tmpBetaNumber = this.getSBCTagSubNumber(this.rnJSON.relType, trmTag);
					let tP1: any = {releases: []};
					let rnc: any = 0;
					let tmpChkVer = 0;
					for(rnc in this.rnJSON.releases){
						if(this.rnJSON.releases[rnc].release.toLowerCase().includes(`version ${this.getSBCTag(this.rnJSON.relType, trmTag)}`)){
							tmpChkVer = this.getSBCTagSubNumber(this.rnJSON.relType, this.rnJSON.releases[rnc].release);
							if(tmpChkVer <= tmpBetaNumber){		
								tP1.releases.push(this.rnJSON.releases[rnc]);
							}
						}							 
					}
					tmpJSON.releases = tP1.releases;
					return tmpJSON
				}else{
					//filter to selected release tag (trim the beginning 'v' if it exists)
					let trmTag2: string = '';
					if(this.rnJSON.selTag.substring(0,1) === 'v'){
						trmTag2 = this.rnJSON.selTag.substring(1);
					}else{
						trmTag2 = this.rnJSON.selTag;
					}
					let tStr1 = `Version ${trmTag2}`;
					let tO1 = this.rnJSON.releases.filter((item: { release: string; }) => (item.release.includes(tStr1)));
					tmpJSON.releases = tO1;
					return tmpJSON;
				}
			}
		},

		filterDuetRNJSON(){
			if(this.rnJSON.class == "rn" && this.rnJSON.releases.length > 0){
				//Filtering for Duet ReleaseNotes
				let tmpJSON: any = {releases: [], relType: this.rnJSON.relType, selTag: this.rnJSON.selTag, gUName: this.rnJSON.gUName, class: this.rnJSON.class};
				if(this.rnJSON.relType == "Beta" || this.rnJSON.relType == "RC"){
					//filter the notes to the relevant sections (cumlative so if beta3 then include beta2 & beta1) based on selected release tag
					let trmTag = this.rnJSON.selTag.slice(0, this.rnJSON.selTag.toLowerCase().indexOf(this.rnJSON.relType.toLowerCase())+this.rnJSON.relType.length);
					let tmpBetaNumber = this.getTagSubNumber(this.rnJSON.relType, this.rnJSON.selTag);
					let tP1: any = {releases: []};
					let rnc: any = 0;
					let tmpChkVer = 0;
					for(rnc in this.rnJSON.releases){
						if(this.rnJSON.releases[rnc].release.toLowerCase().includes(`reprapfirmware ${trmTag}`)){
							tmpChkVer = this.getTagSubNumber(this.rnJSON.relType, this.rnJSON.releases[rnc].release);
							if(tmpChkVer <= tmpBetaNumber){		
								tP1.releases.push(this.rnJSON.releases[rnc]);
							}
						}							 
					}
					tmpJSON.releases = tP1.releases;
					return tmpJSON
				}else{
					//filter to selected release tag
					let tStr1 = `RepRapFirmware ${this.rnJSON.selTag}`
					let tO1 = this.rnJSON.releases.filter((item: { release: string; }) => (item.release.includes(tStr1)));
					tmpJSON.releases = tO1;
					return tmpJSON;
				}
			}
		},

		opnDocs(gcode: string){
			window.open(this.duetDocsURL+gcode, '_blank');
		},

		highlightRN(){
			//parses the release notes and applies colors/highlights according to the mactching criteria 
			if(this.confGText){
				//remove all comments
				this.confGText = this.confGText.replace(/;.*/g, '')
				//get the unique gcode in config.g excludes subgcodes
				let arrAllConfGcodes = this.confGText.match( /\b[(g|G|m|M]{1}\d{1,3}\b(?!\.)/g );
				arrAllConfGcodes = this.makeArrayUniq(arrAllConfGcodes);
				let arrAllConfSubGcodes = this.confGText.match( /\b[(g|G|m|M]{1}\d{1,3}\.\d{1,3}\b/g );
				if(arrAllConfSubGcodes){arrAllConfSubGcodes = this.makeArrayUniq(arrAllConfSubGcodes);}
				let rel:any  = 0;
				let sec:any  = 0;
				let lin:any  = 0;
				let mgc:any  = 0;
				this.currBSN = JSON.stringify(this.systemBoardSNames);
				let statSNArr = JSON.parse(this.currBSN);
				let currRel = null;
				let currSec = null;
				let currLine = null;
				let usn:any  = 0;
				let rnhw:any  = 0;
				let rnhws:any  = 0;
				let hwStr:any = "";
				let bHWMatch = false;
				let bHWLine = false;
				let hwSNMatchArr = null;
				let bSkipped = false;
				this.currReleaseJSON = null;
				this.currReleaseJSON = JSON.stringify(this.panelJSON);
				this.currReleaseJSON = JSON.parse(this.currReleaseJSON);
				//add sbc to the shortName array if SBC is detected
				if(this.bIsSBC && this.currReleaseJSON){
					statSNArr.push({shortName: "SBC"});
				}
				//loop through the json (nested to allow reverse traversal)
				for(rel in this.currReleaseJSON.releases){
					currRel = this.currReleaseJSON.releases[rel];
					for(sec in currRel.sections){
						//sections
						currSec = currRel.sections[sec]
						for(lin in currSec.lines){
							//lines
							currLine = currSec.lines[lin].line;
							if(currLine.text.includes("<pre><code>")){
								//fix word wrapping
								currLine.text = currLine.text.replace('<pre><code>', '<ul><li><code>');
								currLine.text = currLine.text.replace('</code></pre>', '</code></li></ul>')
							}
							//HW matching
							usn = 0;
							//check if this is a hw line in the RN defined by '[xxx]'
							hwStr = "";
							bHWLine = false;
							//Look for instances of '[xxx]' in the RN (returns null if no matches)
							hwStr = currLine.text.match(/\[[^\]]*]/g)
							if(hwStr){
								//this is HW line process each instance of [x][y][z]
								bHWLine = true;
								rnhw = 0;
								for(rnhw in hwStr){
									//check for empty brackets and skip
									if(hwStr[rnhw].length <= 3 ){
										bSkipped = true; 
										continue;
									}else{
										bSkipped = false;
									}
									//add checks for combination hw [x + y + z] (allways returns an array)
									//never match a rnName that contains 'standalone' and SBC is true
									if(hwStr[rnhw].toLowerCase().includes("in standalone mode") && this.bIsSBC){
										continue;
									}
									//strip "[]"
									let tmpHWStr = hwStr[rnhw].replace('[', '');
									tmpHWStr = tmpHWStr.replace(']', '');
									if(tmpHWStr.toLowerCase().includes("in standalone mode") && !this.bIsSBC){
										//strip 'in standalone mode' so matching still works
										tmpHWStr = tmpHWStr.toLowerCase().replaceAll(' in standalone mode', '');
									}
									let rnHWArr = tmpHWStr.split(" + ")
									rnhws = 0
									//loop though each combination element
									for(rnhws in rnHWArr){
										//when this look exits if bHWMatch is true then the whole '[xxx]' is a match, partial matches will return false
										bHWMatch = false;
										usn=0;
										//check if string contains ' - ' and remove ' - ' + all strip other right characters
										if(rnHWArr[rnhws].toLowerCase().includes(" - ")){
											let tmpInx: number = (rnHWArr[rnhws].indexOf(" - "));
											rnHWArr[rnhws] = rnHWArr[rnhws].substring(0, tmpInx)
										}
										//loop through each board shortName in the OM
										for(usn in statSNArr){
											//get the array of shortNames groups from the data maintained on github
											hwSNMatchArr = this.rnHWLookup.filter((item: { shortName: string; }) => item.shortName == statSNArr[usn].shortName);
											if(hwSNMatchArr.length !== 0){
												//we have found a match of short name now check each group name against the combination elelement
												let isMatchArr = hwSNMatchArr[0].rnNames.filter((item: string) => item.toLowerCase() == rnHWArr[rnhws].toLowerCase())
												if(isMatchArr.length !== 0){
													bHWMatch = true;
												}												
											}
											//if we have already found a match we can move on else end as its an AND check condition
											if(bHWMatch){break;}
										}
										//if we have already found a match we can move on else end as its an AND check condition
										if(!bHWMatch){
											break;
										}
									}
									if(bHWMatch){
										currLine.text = currLine.text.replace(hwStr[rnhw], `<span title="${this.tmpLang.shortNMatchedHW}" class="${this.shortNMatchHWCol}--text">${hwStr[rnhw]}</span>`)
									}
									
								}
								//after the iteration of each [] color the line if req
								if(bHWMatch && !bSkipped){
									currLine.hwMatch = true;
									if(currLine.confGMatch) {
										currLine.colour = `${this.dualHWGCMatchLineColor}`;
										currSec.hwMatch = true;
									}else{
										currLine.colour = `${this.shortNLineMatchCol}`;
										currSec.hwMatch = true;
									}
									currLine.hwHover = this.tmpLang.shortNMatchedHW;
									currLine.hover = "";										
									continue;
								}

							}
							//check line for matching gcodes -  only if not a HW line
							if(!currLine.hwMatch && !bHWLine){
								//match normal gcodes
								let ip: any = 0;
								let clTxtArr = currLine.text.match( /\b[(g|G|m|M]{1}\d{1,3}\b(?!\.)/g )
								let clTxtArr2 = currLine.text.match( /\b[(g|G|m|M]{1}\d{1,3}\.\d{1,3}\b/g )
								if(clTxtArr){
									clTxtArr = this.makeArrayUniq(clTxtArr);
									for(ip in clTxtArr){
										mgc = 0;
										let repTxt = `<a onclick="window.open('${this.duetDocsURL}${clTxtArr[ip]}', '_blank')"><span title="${this.tmpLang.gcodeLink2Doc}" class="green--text">${clTxtArr[ip]}</span></a>`
										currLine.text = currLine.text.replaceAll(clTxtArr[ip], repTxt);
										for(mgc in arrAllConfGcodes){										
											if(clTxtArr[ip] == arrAllConfGcodes[mgc]){
												currLine.text = currLine.text.replaceAll(repTxt, `<a onclick="window.open('${this.duetDocsURL}${arrAllConfGcodes[mgc]}', '_blank')"><span title="${this.tmpLang.gcodeMatchConfG}" class="${this.confGCodeMatchCol}">${arrAllConfGcodes[mgc]}</span></a>`);
												currLine.colour = `${this.confGLineMatchCol}`;
												currLine.confGMatch = true;
												currLine.fileHover = this.tmpLang.gcodeMatchConfG;
												currLine.hover = "";
												currSec.confGMatch = true;
											}
										}
									}
								}
								
								//match sub gcodes
								ip = 0;
								if(clTxtArr2){
									clTxtArr2 = this.makeArrayUniq(clTxtArr2);
									for(ip in clTxtArr2){
										mgc = 0;
										let tmpURLCode = clTxtArr2[ip].replace(/\b\.\d{1,3}\b/g, '')
										let repTxt = `<a onclick="window.open('${this.duetDocsURL}${tmpURLCode}', '_blank')"><span title="${this.tmpLang.gcodeLink2Doc}" class="green--text">${clTxtArr2[ip]}</span></a>`
										currLine.text = currLine.text.replaceAll(clTxtArr2[ip], repTxt);
										if(arrAllConfSubGcodes){
											for(mgc in arrAllConfSubGcodes){										
												if(clTxtArr2[ip] == arrAllConfSubGcodes[mgc]){
													currLine.text = currLine.text.replaceAll(repTxt, `<a onclick="window.open('${this.duetDocsURL}${tmpURLCode}', '_blank')"><span title="${this.tmpLang.gcodeMatchConfG}" class="${this.confGCodeMatchCol}">${clTxtArr2[ip]}</span></a>`);
													currLine.colour = `${this.confGLineMatchCol}`;
													currLine.confGMatch = true;
													currLine.fileHover = this.tmpLang.gcodeMatchConfG;
													currLine.hover = "";
													currSec.confGMatch = true;
												}
											}
										}
									}
								}
							}
						}
						//color the section header according to matches
						if(currSec.hwMatch && currSec.confGMatch) {
							//both hw & config.g matches
							currSec.hover = this.tmpLang.BothMatchSection;
							currSec.color = `${this.dualHWGCMatchLineColor}`;
							currRel.hwMatch = true;
							currRel.confGMatch = true;
						}else if(currSec.hwMatch && !currSec.confGMatch){
							//just hw matches
							currSec.hover = this.tmpLang.HWMatchHWSection;
							currSec.color = `${this.shortNLineMatchCol}`;
							currRel.hwMatch = true;
						}
						else if(!currSec.hwMatch && currSec.confGMatch){
							//just config.g gcode matches
							currSec.hover = this.tmpLang.gcodeMatchConfGSection;
							currSec.color = `${this.confGLineMatchCol}`;
							currRel.confGMatch = true;
						}
					}
					//color the rn header according to matches
					if(currRel.hwMatch && currRel.confGMatch) {
						//both hw & config.g matches
						currRel.hover = this.tmpLang.BothMatchRN;
						currRel.color = `${this.dualHWGCMatchLineColor}`;
					}else if(currRel.hwMatch && !currRel.confGMatch){
						//just hw matches
						currRel.hover = this.tmpLang.HWMatchHWRN;
						currRel.color = `${this.shortNLineMatchCol}`;
					}
					else if(!currRel.hwMatch && currRel.confGMatch){
						//just config.g gcode matches
						currRel.hover = this.tmpLang.gcodeMatchConfGRN;
						currRel.color = `${this.confGLineMatchCol}`;
					}
				}	
			}
		},

		async loadConfGFile() {
			//load the Config.g file from SD
			try {
				const setFileName = Path.combine(this.systemDirectory, `config.g`);
				const response = await store.dispatch("machine/download", { filename: setFileName, type: 'text', showSuccess: false }).then(res => res);
				return response;
			} catch (e) {
				if (!(e instanceof DisconnectedError) && !(e instanceof OperationCancelledError)) {
					console.warn(e);
					return null;
				}
			}
		},

		makeArrayUniq(a: any) {
			//Remove Duplicates from the array
			return a.sort().filter(function(item: any, pos: any, ary: any) {
				return !pos || item != ary[pos - 1];
			});
		},

		
	},
	watch: {
		selectedTag() {
			this.startUp();
		},
		rnJSON(){
			this.startUp();
		},
		darkTheme(){
			this.startUp();
		}
	}
});
</script>
