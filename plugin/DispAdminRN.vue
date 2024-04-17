<style scoped>
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
					<v-chip class="rlMgrVchip" color="info">RN Assessment</v-chip><v-spacer></v-spacer>
					<v-chip class="rlMgrVchip" color="red black--text">Will Never Match</v-chip>
					<v-chip class="rlMgrVchip" color="green black--text">Will Match</v-chip>
				</v-row>
			</v-card-title>
			<v-card-text outlined class="rMgrv-cardRLM__text">
				<v-expansion-panels v-for="(rel, i) in panelJSON2.releases" :key="i" accordion multiple focusable v-model="bExpRel[i]">
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

<script lang="ts">

import Vue from "vue";
import store from "@/store";
import * as tempENLang from './en';

export default Vue.extend({
	props: {
		rnAdminJSON: {
			type: Object
		},
		rMgrData:{
			type: Object
		},
		selectedTag: String,
		sRNOvrRd: String
    },
	
	computed: {
		systemDirectory(): string {
			return store.state.machine.model.directories.system;
		},
		systemCurrIP(): any {
			return store.state.machine.model.network.interfaces[0].actualIP;
		},
		systemDSFVerStr(): any {
			//return store.state.machine.model.state.dsfVersion;
			try{return store.state.machine.model.sbc;}catch{return null}
		},
		darkTheme(): any {
			return store.state.settings.darkTheme;
		}, 
		tmpLang(): any {
			return tempENLang.tmpLangObj().plugin.ReleaseMgr;
		},
		rnHWLookup(): any{
			return this.rMgrData.boards;
		},
		bIsSBC(): boolean{
			if(this.systemDSFVerStr !== null && this.systemDSFVerStr !== ''){
				return true;
			}else{
				return false;
			}
		},
		confGLineMatchCol(): string{
			if(!this.darkTheme){
				return "red lighten-3";
			}else{
				return "red lighten-3 black--text"
			}
		}		
	},

	data () {
		return {
			bExpRel: [[0]] as any,
			bExpSec: [[0]] as any,
			currBSN: null as any,
			panelJSON2: {releases:[]} as any,
			gitOwnerNameDuet: 'Duet3D',
			gitOwnerNameGloomy: 'gloomyandy',
			gitRepoNameDuet: "RepRapFirmware",
			gitSBCRepoNameDuet: "DuetSoftwareFramework", 
			gitRepoNameGloomy: "RepRapFirmware",
			gitDWCRepoNameDuet: "DuetWebControl",
			confGText: null as any			
		}
	},

	mounted(){
		this.startUp();
	},

	methods: {
		async startUp(){
			if(this.rnAdminJSON){
				if(this.rnAdminJSON.gUName == this.gitOwnerNameDuet && this.rnAdminJSON.gRName == this.gitRepoNameDuet){
					this.panelJSON2 = this.filterDuetRNJSON();
					this.highlightRN2();
				}
			}
		}, 

		reFormatCodeBlockLine(){
			let rel: any = 0;
			for(rel in this.panelJSON2.releases){
				let currRel = this.panelJSON2.releases[rel];
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

		filterDuetRNJSON(){
			if(this.rnAdminJSON.class == "rn" && this.rnAdminJSON.releases.length > 0){
				//Filtering for Duet ReleaseNotes
				let tmpJSON: any = {releases: [], relType: this.rnAdminJSON.relType, selTag: this.rnAdminJSON.selTag, gUName: this.rnAdminJSON.gUName, class: this.rnAdminJSON.class};
				if(this.rnAdminJSON.relType == "Beta" || this.rnAdminJSON.relType == "RC"){
					//filter the notes to the relevant sections (cumlative so if beta3 then include beta2 & beta1) based on selected release tag
					let trmTag = this.rnAdminJSON.selTag.slice(0, this.rnAdminJSON.selTag.toLowerCase().indexOf(this.rnAdminJSON.relType.toLowerCase())+this.rnAdminJSON.relType.length);
					trmTag = trmTag.toLowerCase().replace('rc', '')
					trmTag = trmTag.toLowerCase().replace('beta', '')
					let tP1: any = {releases: []};
					let rnc: any = 0;
					for(rnc in this.rnAdminJSON.releases){
						if(this.rnAdminJSON.releases[rnc].release.toLowerCase().includes(`reprapfirmware ${trmTag}`)){				
								tP1.releases.push(this.rnAdminJSON.releases[rnc]);
						}							 
					}
					tmpJSON.releases = tP1.releases;
					return tmpJSON
				}else{
					//filter to selected release tag
					let tStr1 = `RepRapFirmware ${this.rnAdminJSON.selTag}`
					if(this.sRNOvrRd) {
						tStr1 = `RepRapFirmware ${this.sRNOvrRd}`
					}
					let tO1 = this.rnAdminJSON.releases.filter((item: { release: string; }) => (item.release.includes(tStr1)));
					tmpJSON.releases = tO1;
					return tmpJSON;
				}
			}
		},

		highlightRN2(){
			//parses the release notes and applies colors/highlights according to the mactching criteria 
				let rel: any = 0;
				let sec: any = 0;
				let lin: any = 0;
				let statSNArr = this.rnHWLookup;
				let currRel = null;
				let currSec = null;
				let currLine = null;
				let usn: any = 0;
				let rnhw: any = 0;
				let rnhws: any = 0;
				let hwStr: any = "";
				let bHWMatch = false;
				let hwSNMatchArr = null;
				let bSkipped = false;
				//loop through the json (nested to allow reverse traversal)
				for(rel in this.panelJSON2.releases){
					currRel = this.panelJSON2.releases[rel];
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
							//Look for instances of '[xxx]' in the RN (returns null if no matches)
							hwStr = currLine.text.match(/\[[^\]]*]/g)
							if(hwStr){
								//this is HW line process each instance of [x][y][z]
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
												let isMatchArr = hwSNMatchArr[0].rnNames.filter((item: any) => item.toLowerCase() == rnHWArr[rnhws].toLowerCase())
												if(isMatchArr.length !== 0){
													bHWMatch = true;
												}												
											}
											//if we have already found a match we can move on else end as its an AND check condition
											if(bHWMatch){break;}
										}
										//if we have already found a match we can move on else end as its an AND check condition
										if(!bHWMatch){break}
									}
									if(bHWMatch && !bSkipped){
										currLine.text = currLine.text.replace(hwStr[rnhw], `<span class="green--text">${hwStr[rnhw]}</span>`)
										currLine.hwMatch = true;
										bSkipped = false;
										currLine.hwHover = "";										
									}else if (!bHWMatch && !bSkipped){
										currLine.text = currLine.text.replace(hwStr[rnhw], `<span class="red--text">${hwStr[rnhw]}</span>`)
										currSec.color = `${this.confGLineMatchCol}`;
										currRel.color = `${this.confGLineMatchCol}`;
										currLine.hwMatch = false;
										bSkipped = false;
										currLine.hwHover = "";									
									}									
								}
							}
						}
					}
				}	
		}		
	},
	watch: {
		selectedTag() {
			this.startUp();
		},
		rnAdminJSON(){
			this.startUp();
		},
		darkTheme(){
			this.startUp();
		}
	}
});
</script>
