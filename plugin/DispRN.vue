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
</style>
<template>
	<v-card flat outlined class="pa-0 ma-0 rMgrv-mainCardRLM">
		<v-card elevation="3" class="pa-0 ma-0 rMgrv-cardRLM">
			<v-card-title>
				Release Notes
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
			return this.model.boards;
		},
		confGLineMatchCol(){
			if(!this.darkTheme){
				return "red lighten-4";
			}else{
				return "red accent-1"
			}
		},
		confGCodeMatchCol(){
			if(!this.darkTheme){
				return "red lighten-1";
			}else{
				return "red accent-4";
			}
		},
		shortNLineMatchCol(){
			if(!this.darkTheme){
				return "blue lighten-4";
			}else{
				return "blue darken-4";
			}
		},
		shortNMatchHWCol(){
			if(!this.darkTheme){
				return "blue darken-4";
			}else{
				return "blue lighten-4";
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
			confGText: null
			
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
				}else if(this.rnJSON.gUName == this.gitOwnerNameDuet && this.rnJSON.gRName == this.gitSBCRepoNameDuet){
					this.panelJSON = this.filterDuetSBCRNJSON();
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

		highlightRN(){
			//parses the release notes and applies colors/highlights according to the mactching criteria 
			if(this.confGText){
				//get the unique gcode in config.g
				let arrAllConfGcodes = this.confGText.match( /\b[a-zA-Z]{1}\d{3}\b/g );
				arrAllConfGcodes = this.makeArrayUniq(arrAllConfGcodes);
				let rel = 0;
				let sec = 0;
				let lin = 0;
				let mgc = 0;
				this.currBSN = JSON.stringify(this.systemBoardSNames);
				let statSNArr = JSON.parse(this.currBSN);
				let currRel = null;
				let currSec = null;
				let currLine = null;
				let tmpRE = null;
				let ubn = 0;
				let usn = 0;
				let matchStr = "";
				let hwStr = "";
				let newHwStr = "";
				//let tmpRE2 = null;
				let hwSNMatchArr = null;
				//loop through the json (nested to allow reverse traversal)
				for(rel in this.panelJSON.releases){
					currRel = this.panelJSON.releases[rel];
					for(sec in currRel.sections){
						currSec = currRel.sections[sec]
						for(lin in currSec.lines){
							currLine = currSec.lines[lin].line;
							//check line for matching gcodes
							mgc = 0;
							for(mgc in arrAllConfGcodes){
								if(currLine.text.includes(arrAllConfGcodes[mgc])){
									//match gcodes
									tmpRE = new RegExp(arrAllConfGcodes[mgc],"g")
									currLine.text = currLine.text.replace(tmpRE, `<span title="${this.tmpLang.gcodeMatchConfG}" class="${this.confGCodeMatchCol}--text">${arrAllConfGcodes[mgc]}</span>`);
									currLine.colour = `${this.confGLineMatchCol}`;
									currLine.confGMatch = true;
									currLine.fileHover = this.tmpLang.gcodeMatchConfG;
									currLine.hover = "";
									currSec.confGMatch = true;
								}
							}
							//HW matching
							usn = 0;
							for(usn in statSNArr){
								hwSNMatchArr = this.rnHWLookup.filter(item => item.shortName == statSNArr[usn].shortName);
								if(hwSNMatchArr !== [] && typeof hwSNMatchArr !== 'undefined' && hwSNMatchArr.length !== 0){
									ubn = 0;
									hwStr = "";
									newHwStr = "";
									//match within [] as it could contain more than 1 hardware name - rest of line is ignored
									hwStr = currLine.text.match(/\[.*\]/g)
									if(hwStr){
										for(ubn in hwSNMatchArr[0].rnNames){
											matchStr = hwSNMatchArr[0].rnNames[ubn];
											if(hwStr[0].includes(matchStr)){
												hwStr[0] = hwStr[0].replace(matchStr, `<span title="${this.tmpLang.shortNMatchedHW}" class="${this.shortNMatchHWCol}--text">${matchStr}</span>`)
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
											}
											if(currLine.hwMatch){
												newHwStr = currLine.text.match(/\[.*\]/g),
												currLine.text = currLine.text.replace(newHwStr, hwStr[0]);
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
