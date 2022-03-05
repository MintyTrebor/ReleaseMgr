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
			<v-card-text outlined class="rMgrv-cardRLM__text">
				<v-expansion-panels v-for="(rel, i) in panelJSON.releases" :key="i" accordion multiple focusable v-model="bExpRel[i]">
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

<script>
'use strict'

import { mapGetters, mapState, mapActions, mapMutations } from 'vuex';

import { DisconnectedError, OperationCancelledError } from '../../utils/errors.js';
// import Events from '../../utils/events.js'
// import { isPrinting } from '../../store/machine/modelEnums.js';
import Path from '../../utils/path.js'
import tempENLang from './en.js';

export default {
	props: {
		rnJSON: {
			type: Object
		},
		rMgrData:{
			type: Object
		},
		selectedTag: String
    },
	mixins: [
		tempENLang
	],
	computed: {
		...mapState('machine/model', {
			status: state => state.state.status,
			systemDirectory: state => state.directories.system,
			systemCurrIP: state => state.network.interfaces[0].actualIP,
			systemDSFVerStr: state => state.state.dsfVersion
		}),
		...mapGetters('machine/model', ['jobProgress']),
		...mapState('machine/settings', ['codes']),
		...mapState('machine', ['model']),
		...mapState({
			darkTheme: state => state.settings.darkTheme
		}),
		tmpLang(){
			return this.tmpLangObj().plugin.ReleaseMgr;
		},
		rnHWLookup(){
			return this.rMgrData.boards;
		},
		systemBoardSNames(){
			if(this.bHiddenTestData){
				return this.rMgrData.testData;
			}else{
				return this.model.boards;
			}		
		},
		bHiddenTestData(){
			try{
				let tmpOMKey = this.model.global.releaseMgrTestData;
				if(tmpOMKey){
					return true;
				}else{
					return false;
				}
			}catch{
				return false;
			}
		},
		bIsSBC(){
			if(this.systemDSFVerStr !== null && this.systemDSFVerStr !== ''){
				return true;
			}else{
				return false;
			}
		},
		confGLineMatchCol(){
			if(!this.darkTheme){
				return "red lighten-3 black--text";
			}else{
				return "red lighten-3 black--text"
			}
		},
		confGCodeMatchCol(){
			if(!this.darkTheme){
				return "pink accent-3 black--text";
			}else{
				return "pink accent-3 black--text";
			}
		},
		shortNLineMatchCol(){
			if(!this.darkTheme){
				return "blue lighten-4";
			}else{
				return "blue lighten-4 black--text";
			}
		},
		shortNMatchHWCol(){
			if(!this.darkTheme){
				return "blue darken-4";
			}else{
				return "blue darken-4";
			}
		},
		dualHWGCMatchLineColor(){
			if(!this.darkTheme){
				return "purple lighten-4";
			}else{
				return "purple darken-4";
			}
		}


		
	},

	data () {
		return {
			bExpRel: [[0]],
			bExpSec: [[0]],
			currBSN: null,
			panelJSON: {releases:[]},
			gitOwnerNameDuet: 'Duet3D',
			gitOwnerNameGloomy: 'gloomyandy',
			gitRepoNameDuet: "RepRapFirmware",
			gitSBCRepoNameDuet: "DuetSoftwareFramework", 
			gitRepoNameGloomy: "RepRapFirmware",
			gitDWCRepoNameDuet: "DuetWebControl",
			confGText: null,
			duetDocsURL: 'https://docs.duet3d.com/en/User_manual/Reference/Gcodes/'
			
		}
	},

	mounted(){
		this.startUp();
	},

	methods: {
		...mapActions('machine', ['sendCode']),
		...mapActions('machine', {machineDownload: 'download', getFileList: 'getFileList'}),
        ...mapActions('machine', ['upload']),
		...mapMutations('machine/settings', ['addCode', 'removeCode']),
		
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
				}
				if(this.rnJSON.gUName == this.gitOwnerNameDuet && this.rnJSON.gRName == this.gitDWCRepoNameDuet){
					this.panelJSON = this.filterDuetSBCRNJSON();
					this.reFormatCodeBlockLine();
				}
			}
		}, 

		reFormatCodeBlockLine(){
			let rel =0;
			for(rel in this.panelJSON.releases){
				let currRel = this.panelJSON.releases[rel];
				let sec = 0;
				for(sec in currRel.sections){
					//sections
					let currSec = currRel.sections[sec]
					let lin = 0;
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

		getTagSubNumber(type, releaseTag){
			let tmpType = type.toLowerCase();
			let tmpRTag = releaseTag.toLowerCase();
			let tmpBetaNumber = 0;
			if(tmpRTag.includes('-')){
				//checking for Addendum
				tmpBetaNumber = parseInt(tmpRTag.slice(tmpRTag.toLowerCase().indexOf(tmpType)+tmpType.length, tmpRTag.toLowerCase().indexOf('-')));
			}else{
				tmpBetaNumber = parseInt(tmpRTag.slice(tmpRTag.toLowerCase().indexOf(tmpType)+tmpType.length));
			}
			return tmpBetaNumber;
		},

		getSBCTagSubNumber(type, releaseTag){
			let tmpType = type.toLowerCase();
			let tmpRTag = releaseTag.toLowerCase();
			let tmpBetaNumber = 0;
			if(tmpType=="beta"){tmpType = "-b"}
			if(tmpType=="rc"){tmpType = "-rc"}
			tmpBetaNumber = parseInt(tmpRTag.slice(tmpRTag.toLowerCase().indexOf(tmpType)+tmpType.length));
			return tmpBetaNumber;
		},

		getSBCTag(type, releaseTag){
			let tmpType = type.toLowerCase();
			let tmpRTag = releaseTag.toLowerCase();
			//let tmpBetaNumber = 0;
			if(tmpType=="beta"){tmpType = "-b"}
			if(tmpType=="rc"){tmpType = "-rc"}
			return tmpRTag.substring(0, tmpRTag.toLowerCase().indexOf(tmpType)+tmpType.length);
		},

		filterDuetSBCRNJSON(){
			if(this.rnJSON.class == "rn" && this.rnJSON.releases.length > 0){
				//Filtering for Duet ReleaseNotes
				let tmpJSON = {releases: [], relType: this.rnJSON.relType, selTag: this.rnJSON.selTag, gUName: this.rnJSON.gUName, class: this.rnJSON.class};
				if(this.rnJSON.relType == "Beta" || this.rnJSON.relType == "RC"){
					//filter the notes to the relevant sections (cumlative so if beta3 then include beta2 & beta1) based on selected release tag
					let trmTag = this.rnJSON.selTag.substring(1);
					let tmpBetaNumber = this.getSBCTagSubNumber(this.rnJSON.relType, trmTag);
					let tP1 = {releases: []};
					let rnc = 0;
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
					//filter to selected release tag
					let tStr1 = `Version ${this.rnJSON.selTag.substring(1)}`;
					let tO1 = this.rnJSON.releases.filter(item => (item.release.includes(tStr1)));
					tmpJSON.releases = tO1;
					return tmpJSON;
				}
			}
		},

		filterDuetRNJSON(){
			if(this.rnJSON.class == "rn" && this.rnJSON.releases.length > 0){
				//Filtering for Duet ReleaseNotes
				let tmpJSON = {releases: [], relType: this.rnJSON.relType, selTag: this.rnJSON.selTag, gUName: this.rnJSON.gUName, class: this.rnJSON.class};
				if(this.rnJSON.relType == "Beta" || this.rnJSON.relType == "RC"){
					//filter the notes to the relevant sections (cumlative so if beta3 then include beta2 & beta1) based on selected release tag
					let trmTag = this.rnJSON.selTag.slice(0, this.rnJSON.selTag.toLowerCase().indexOf(this.rnJSON.relType.toLowerCase())+this.rnJSON.relType.length);
					let tmpBetaNumber = this.getTagSubNumber(this.rnJSON.relType, this.rnJSON.selTag);
					let tP1 = {releases: []};
					let rnc = 0;
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
					let tO1 = this.rnJSON.releases.filter(item => (item.release.includes(tStr1)));
					tmpJSON.releases = tO1;
					return tmpJSON;
				}
			}
		},

		opnDocs(gcode){
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
				let rel = 0;
				let sec = 0;
				let lin = 0;
				let mgc = 0;
				this.currBSN = JSON.stringify(this.systemBoardSNames);
				let statSNArr = JSON.parse(this.currBSN);
				let currRel = null;
				let currSec = null;
				let currLine = null;
				let usn = 0;
				let rnhw = 0;
				let rnhws = 0;
				let hwStr = "";
				let bHWMatch = false;
				let bHWLine = false;
				let hwSNMatchArr = null;
				let bSkipped = false;
				//add sbc to the shortName array if SBC is detected
				if(this.bIsSBC){
					statSNArr.push({shortName: "SBC"});
				}
				//loop through the json (nested to allow reverse traversal)
				for(rel in this.panelJSON.releases){
					currRel = this.panelJSON.releases[rel];
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
										//loop through each board shortName in the OM
										for(usn in statSNArr){
											//get the array of shortNames groups from the data maintained on github
											hwSNMatchArr = this.rnHWLookup.filter(item => item.shortName == statSNArr[usn].shortName);
											if(hwSNMatchArr.length !== 0){
												//we have found a match of short name now check each group name against the combination elelement
												let isMatchArr = hwSNMatchArr[0].rnNames.filter(item => item.toLowerCase() == rnHWArr[rnhws].toLowerCase())
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
								let ip = 0;
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
				const response = await this.machineDownload({ filename: setFileName, type: 'text', showSuccess: false }).then(res => res);
				return response;
			} catch (e) {
				if (!(e instanceof DisconnectedError) && !(e instanceof OperationCancelledError)) {
					console.warn(e);
					return null;
				}
			}
		},

		makeArrayUniq(a) {
			//Remove Duplicates from the array
			return a.sort().filter(function(item, pos, ary) {
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
}
</script>
