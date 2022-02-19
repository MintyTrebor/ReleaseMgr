<style>
	.rMgrv-cardRelFiles {
		display: flex !important;
		flex-direction: column;
		height: calc(100vh - 300px);
	}
</style>
<template>
	<v-container fluid class="pa-0 ma-0" >
		<v-card flat width="100%" class="pa-0 ma-0" :key="1+bPageReload">
			<div width="100%" class="mb-3">
				<v-row dense width="100%" class="ma-0 pa-0">
					<v-col cols="6" justify="start">
						<span><strong>{{tmpLang.plugin.ReleaseMgr.title}}</strong></span>
					</v-col>
					<v-col cols="6">
						<span v-if="bShowRN || bShowRI"><strong>{{tmpLang.plugin.ReleaseMgr.headerDuet}}</strong></span>
						<span v-if="bShowGloomyRN || bShowGloomyRI"><strong>{{tmpLang.plugin.ReleaseMgr.headerGloomy}}</strong></span>
						<span v-if="bShowDuetSBCRN || bShowDuetSBCRI"><strong>{{tmpLang.plugin.ReleaseMgr.headerSBC}}</strong></span>
						<v-spacer></v-spacer>
					</v-col>
				</v-row>
				<v-row dense width="100%" class="ma-0 pa-0">
					<v-col cols="12">
						<v-card width="100%" class="pa-0 ma-0">
							<v-card-text class="pa-0 ma-1" style="overflow: hidden !important;">
								<v-row dense class="pa-0 ma-0" justify="center" align="center">
									<v-col cols="8">
										<v-row dense class="pa-0 ma-0" justify="center" align="center">
											<v-col cols="auto">
												<span><strong>{{tmpLang.plugin.ReleaseMgr.currFWVer}}</strong> {{ fwVer }}</span>
											</v-col>
											<v-spacer></v-spacer>
											<v-col cols="auto">
												<span><strong>{{tmpLang.plugin.ReleaseMgr.currFWSrc}}</strong> {{ fwSrcFriendlyName }}</span>
											</v-col>
											<v-spacer></v-spacer>
											<v-col cols="auto">
												<span><strong>{{tmpLang.plugin.ReleaseMgr.currCBoard}}</strong> {{ conBoard }}</span><span v-if="bIsSBC"> (+ SBC)</span>
											</v-col>
											<v-spacer></v-spacer>
										</v-row>
									</v-col>
									<v-col cols="4">
										<v-row dense class="pa-0 ma-0" justify="center" align="center">
											<v-col cols="auto">
												<span><v-switch :label="tmpLang.plugin.ReleaseMgr.lblSWBetaRel" align="center" v-model="bShowPreRelease" @change="checkShowAllRel()"></v-switch></span>
											</v-col>
											<v-spacer></v-spacer>
											<v-col cols="auto">
												<span><v-switch v-if="bShowPreRelease" :label="tmpLang.plugin.ReleaseMgr.lblSWAllRel" align="center" v-model="bShowAllReleases"></v-switch></span>
											</v-col>
										</v-row>
									</v-col>
								</v-row>
								<v-row dense class="pl-2 pt-0 ma-0" justify="start" align="center">
									<v-col>
										<v-row justify="start" align="center" v-if="fwSrc != 'gloomy'" >
											<v-col v-if="bShowGloomyReleases" cols="3">
												<v-row align="center">
													<v-select :label="tmpLang.plugin.ReleaseMgr.lblSelGloomyRel" :items="gloomyFilteredTags" item-text="text" item-value="value" v-model="selectedGloomyRelTag" @change="selectedGloomyTag(selectedGloomyRelTag)"></v-select>
												</v-row>
											</v-col>
											<v-spacer v-if="bShowGloomyReleases"></v-spacer>
											<v-col cols="3">
												<v-row align="center">
													<v-select :key="duetFilteredTags+bShowPreRelease" :label="tmpLang.plugin.ReleaseMgr.lblSelDuetRel" :items="duetFilteredTags" item-text="text" item-value="value" v-model="selectedDuetRelTag" @change="selectedDuetTag(selectedDuetRelTag)"></v-select>
												</v-row>
											</v-col>
											<v-spacer></v-spacer>
											<v-tooltip top>
												<template v-slot:activator="{ on, attrs }">
												<v-btn small v-bind="attrs" class="pa-2 ma-6" v-on="on" @click="bPageReload = !bPageReload"><v-icon>mdi-autorenew</v-icon></v-btn>
												</template>
												<span>{{tmpLang.plugin.ReleaseMgr.btnRefreshHover}}</span>
											</v-tooltip>
										</v-row>
									</v-col>
								</v-row>
							</v-card-text>
						</v-card>
					</v-col>	
				</v-row>
			</div>
			<!-- <v-row>
				sbcRNJSON:{{this.allGloomyReleasesJSON}}
			</v-row> -->
			<v-row class="pa-0 ma-0 ">
				<v-col cols="8">
					<v-container fluid class="pa-0 ma-0">
						<DispRN v-if="bGotDuetRN && bShowRN" :rnJSON="duetRNJSON" :key="selectedDuetRelTag" :selectedTag="selectedDuetRelTag"></DispRN>
						<DispRI v-if="bGotDuetRI && bShowRI" :riJSON="duetRIJSON" :key="selectedDuetRelTag" :selectedTag="selectedDuetRelTag"></DispRI>
						<DispRI v-if="bGotGloomyRN && bShowGloomyRN" :riJSON="gloomyRNJSON" :key="selectedGloomyRelTag" :selectedTag="selectedGloomyRelTag"></DispRI>
						<DispRI v-if="bGotGloomyRI && bShowGloomyRI" :riJSON="gloomyRIJSON" :key="selectedGloomyRelTag" :selectedTag="selectedGloomyRelTag"></DispRI>
						<DispRN v-if="bGotDuetSBCRN && bShowDuetSBCRN" :rnJSON="sbcRNJSON" :key="selectedDuetRelTag" :selectedTag="selectedDuetRelTag"></DispRN>
						<DispRI v-if="bGotDuetSBCRI && bShowDuetSBCRI" :riJSON="sbcRIJSON" :key="selectedDuetRelTag" :selectedTag="selectedDuetRelTag"></DispRI>
					</v-container>
				</v-col>
				<v-col cols="4">
					<v-row class="pa-0 ma-0 ">
						<v-container fluid class="pa-0 ma-0">
							<DispRNFiles v-if="bGotDuetRI && (bShowRN || bShowRI || bShowDuetSBCRN || bShowDuetSBCRI)" :riJSON="duetRIJSON" :key="selectedDuetRelTag" :selectedTag="selectedDuetRelTag"></DispRNFiles>
							<DispRNFiles v-if="bGotGloomyRI && (bShowGloomyRN || bShowGloomyRI)" :riJSON="gloomyRIJSON" :key="selectedGloomyRelTag" :selectedTag="selectedGloomyRelTag"></DispRNFiles>
						</v-container>	
					</v-row>
					<v-row class="pa-2 ma-2 ">
						<v-spacer></v-spacer>
					</v-row>
					<v-row class="pa-2 ma-2 ">
						<v-spacer></v-spacer>
						<v-btn v-if="bGotDuetRI" @click="bSwitchDuetDisp()">{{ !bShowRN ? tmpLang.plugin.ReleaseMgr.switchDuetRN : tmpLang.plugin.ReleaseMgr.switchDuetRI }}</v-btn>
						<v-spacer></v-spacer>
					</v-row>
					<v-row class="pa-2 ma-2 ">
						<v-spacer></v-spacer>
						<v-btn v-if="bGotGloomyRI" @click="bSwitchGloomyDisp()">{{ !bShowGloomyRN ? tmpLang.plugin.ReleaseMgr.switchGloomyRN : tmpLang.plugin.ReleaseMgr.switchGloomyRI }}</v-btn>
						<v-spacer></v-spacer>
					</v-row>
					<v-row class="pa-2 ma-2 ">
						<v-spacer></v-spacer>
						<v-btn v-if="bGotDuetSBCRI" @click="bSwitchDuetSBCDisp()">{{ !bShowDuetSBCRN ? tmpLang.plugin.ReleaseMgr.switchDuetSBCRN : tmpLang.plugin.ReleaseMgr.switchDuetSBCRI }}</v-btn>
						<v-spacer></v-spacer>
					</v-row>
				</v-col>
			</v-row>
			<v-card-text class="pa-0 ma-1" align="center" v-if="(!bShowRN && !bShowRI && !bShowGloomyRN && !bShowGloomyRI && !bShowDuetSBCRN && !bShowDuetSBCRI)">
				<div v-html="tmpLang.plugin.ReleaseMgr.notice" class="text-h6" ></div>
				<div v-html="tmpLang.plugin.ReleaseMgr.guide" class="text-h6" ></div>
				<div class="pa-2 ma-2"><v-spacer></v-spacer></div>
				<div style="color: red"  class="text-h4" v-if="!bGotRelMgrData" v-html="tmpLang.plugin.ReleaseMgr.connErr"></div>
			</v-card-text>
		</v-card>
	</v-container>
</template>

<script>


import { mapGetters, mapState, mapActions, mapMutations } from 'vuex';
import { DisconnectedError, OperationCancelledError } from '../../utils/errors.js';
import Path from '../../utils/path.js';
import { isPrinting } from '../../store/machine/modelEnums.js';
import tempENLang from './en.js';
import gitFunctions from './gitFunctions.js';
import DispRN from './DispRN.vue';
import DispRI from './DispRI.vue';
import DispRNFiles from './DispRNFiles.vue';
import { marked } from 'marked';


export default {
	components: {
        DispRN,
		DispRI,
		DispRNFiles
	},
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
		isPrinting() { return isPrinting(this.status); },
		bIsSBC(){
			if(this.systemDSFVerStr !== null && this.systemDSFVerStr !== ''){
				return true;
			}else{
				return false;
			}
		},
		fwSrc(){
			if(typeof this.model.boards[0] !== "undefined"){
				if(this.model.boards[0].firmwareName.toLowerCase().includes('duet') || this.model.boards[0].firmwareName == ""){
					return this.gitOwnerNameDuet; 
				}else {
					return this.gitOwnerNameGloomy;
				}
			}else{
				return "No Board Connected"
			}
		},
		fwSrcFriendlyName(){
			if(this.fwSrc == this.gitOwnerNameGloomy){
				return 'Team Gloomy';
			}else{
				return 'Official Duet 3D';
			}
		},
		fwVer(){
			let tmpVer = "";
			try{tmpVer = this.model.boards[0].firmwareVersion;}
			catch{tmpVer = "Not Connected"}
			return tmpVer;
		},
		conBoard(){
			let tmpCB = "";
			try{tmpCB = this.model.boards[0].name;}
			catch{tmpCB = "Not Connected"}
			return tmpCB;
		},
		backCol(){
			if(this.darkTheme){
					return "background-color: #515151 !important;";
				}else{
					return "background-color: #f5f5f5 !important;";
			}
		},
		tmpLang(){
			return this.tmpLangObj();
		},
		duetFilteredTags(){
			var j=0;
			var tmpArr = [];
			//filters out only the latest beta/rc if user chooses to show beta/rc has to interate cannot be filtered
			for(j in this.allDuetReleasesJSON){
				if(this.allDuetReleasesJSON[j].prerelease && this.bShowPreRelease && this.bShowAllReleases){
					tmpArr.push({text: this.allDuetReleasesJSON[j].tag_name, value: this.allDuetReleasesJSON[j].tag_name});
					continue
				}else if(this.allDuetReleasesJSON[j].prerelease && this.bShowPreRelease && !this.bShowAllReleases && j==0){
					tmpArr.push({text: this.allDuetReleasesJSON[j].tag_name, value: this.allDuetReleasesJSON[j].tag_name});
					continue
				}else if(this.allDuetReleasesJSON[j].prerelease && !this.bShowPreRelease){
					continue;
				}else if(!this.allDuetReleasesJSON[j].prerelease){
					tmpArr.push({text: this.allDuetReleasesJSON[j].tag_name, value: this.allDuetReleasesJSON[j].tag_name});
					continue
				}				
			}
			return tmpArr;
		},
		gloomyFilteredTags(){
			var j=0;
			var tmpArr = [];
			for(j in this.allGloomyReleasesJSON){
				if(this.allGloomyReleasesJSON[j].prerelease && !this.bShowPreRelease){
					continue;
				}else{
					tmpArr.push({text: this.allGloomyReleasesJSON[j].tag_name, value: this.allGloomyReleasesJSON[j].tag_name});
				}
				
			}
			return tmpArr;
		}

	},
	//temporary Lang Stuff to make it easier to replace later
	mixins: [
		tempENLang,
		gitFunctions
	],

	data: function () {
		return {
			bPageReload: false,
			allDuetReleasesJSON: null,
			allSBCReleasesJSON: null,
			allGloomyReleasesJSON: null,
			bGotAllSBCReleases: false,
			gitOwnerNameDuet: 'Duet3D',
			gitOwnerNameGloomy: 'gloomyandy',
			gitRepoNameDuet: "RepRapFirmware",
			gitSBCRepoNameDuet: "DuetSoftwareFramework", 
			gitRepoNameGloomy: "RepRapFirmware",
			gitRelMgrRepoName: "ReleaseMgr",
			gitRelMgrOwnName: "MintyTrebor",
			gitRelMgrDataURL: "main/RelMgrData/RelMgrData.json",
			relMgrData: {},
			duetRNJSON: {},
			duetRIJSON:{},
			gloomyRIJSON: {},
			gloomyRNJSON: {},
			sbcRIJSON: {},
			sbcRNJSON: {},
			bShowPreRelease: false,
			bShowAllReleases: false,
			gloomyRNFilters: [],
			gloomyRNSections: [],
			selectedDuetRelTag: null,
			selectedGloomyRelTag: null,
			bGotDuetRN: false,
			bGotDuetRI: false,
			bGotDuetSBCRI: false,
			bGotDuetSBCRN: false,
			bGotRelMgrData: false,
			bShowRN: false,
			bShowRI: false,
			bShowGloomyRN: false,
			bShowGloomyRI: false,
			bShowDuetSBCRN: false,
			bShowDuetSBCRI: false,
			bShowGloomyReleases: false,
			bGotGloomyRN: false,
			bGotGloomyRI: false,			
			currDSFTag: null,
		}
	},
	
	mounted(){
		//do an intial load
		this.startUp();
	},

	created() {
		window.document.getElementById("global-container").hidden = true;
	},

    methods: {
		...mapActions('machine', ['sendCode']),
		...mapActions('machine', {machineDownload: 'download', getFileList: 'getFileList'}),
        ...mapActions('machine', ['upload']),
		...mapMutations('machine/settings', ['addCode', 'removeCode']),

		async startUp(){
			this.bGotRelMgrData = false;
			//get the latest Duet releases from github			
			if(await this.getRelMgrData()){
				const getReleases = await this.getAllReleasesJSON(this.gitOwnerNameDuet, this.gitRepoNameDuet).then(response => response);
				this.allDuetReleasesJSON = await getReleases;
				if(this.fwSrc == this.gitOwnerNameGloomy){
					//get gloomy releases as this is a gloomy based board
					const getGloomyReleases = await this.getAllReleasesJSON(this.gitOwnerNameGloomy, this.gitRepoNameGloomy).then(response => response);
					this.allGloomyReleasesJSON = await getGloomyReleases;
				}
			}else{
				//probably do alert here
			}

		},

		async getRelMgrData(){
			//critical function - this is the data used to sort the release notes. If not retreived do not continue to process
			const getRelMgrData = await this.getByGitFileRaw(this.gitRelMgrDataURL, this.gitRelMgrOwnName, this.gitRelMgrRepoName).then(res => res);
			const tmpRelMgrData = await getRelMgrData;
			try{
				if(Array.isArray(tmpRelMgrData.boards)){
					this.relMgrData = tmpRelMgrData;
					this.bGotRelMgrData = true;
					return true;
				}else{
					this.relMgrData = {};
					this.bGotRelMgrData = false;
					return false;
				}
			}catch{
				this.relMgrData = {};
				this.bGotRelMgrData = false;
				return false;
			}
		},

		async selectedDuetTag(tmpTag){
			this.bGotDuetRN = false;
			this.bGotDuetRI = false;
			this.duetRNJSON = {};
			this.duetRIJSON = {body: ""};
			const getRelJSON  = await this.getReleaseNotes(this.gitOwnerNameDuet, this.gitRepoNameDuet, tmpTag).then(response => response);
			this.duetRNJSON = await getRelJSON;
			this.duetRIJSON = this.allDuetReleasesJSON.filter(item => item.tag_name == tmpTag)
			this.duetRIJSON = this.duetRIJSON[0];//don't need the array 
			this.bGotDuetRI = true;
			if(this.bIsSBC){
				//SBC is in use so get the SBC RI & RN info also ---- MUST GET RI FIRST!!
				this.bGotDuetSBCRN = false;
				this.bGotDuetSBCRI = false;
				this.sbcRNJSON = {};
				this.sbcRIJSON = {body: ""};
				this.sbcRIJSON = await this.getDuetSBCRI(tmpTag).then(res => res).then(res => res);
				this.sbcRIJSON = this.sbcRIJSON[0];//don't need the array 
				const getSBCRelJSON = await this.getReleaseNotes(this.gitOwnerNameDuet, this.gitSBCRepoNameDuet, tmpTag).then(response => response);
				this.sbcRNJSON = await getSBCRelJSON;
				
			}
		},

		async selectedGloomyTag(tmpTag){
			this.bShowGloomyRN = false;
			this.bShowGloomyRI = false;
			this.bGotGloomyRN = false;
			this.bGotGloomyRI = false;
			this.bShowRN = false;
			this.bShowRI = false;
			this.bShowDuetSBCRN = false;
			this.bShowDuetSBCRI= false;
			this.doGloomyRelease(tmpTag);
		},

		resetAll(){
			this.bGotDuetRN = false;
			this.bGotDuetRI = false;
			this.bGotDuetSBCRN = false;
			this.bGotDuetSBCRI = false;
			this.bShowGloomyRN = false;
			this.bShowGloomyRI = false;
			this.bGotGloomyRN = false;
			this.bGotGloomyRI = false;
			this.selectedDuetRelTag = null;
			this.selectedGloomyRelTag = null;
			this.bShowRN = false;
			this.bShowRI = false;
			this.bShowGloomyRN = false;
			this.bShowGloomyRI = false;
			this.bShowDuetSBCRN = false;
			this.bShowDuetSBCRI= false;
		},

		bSwitchDuetDisp(){
			this.bShowGloomyRN =  false;
			this.bShowGloomyRI = false;
			this.bShowDuetSBCRN = false;
			this.bShowDuetSBCRI =false;
			if(this.bShowRN){
				this.bShowRN = false;
				this.bShowRI = true;
			}else{
				this.bShowRN = true;
				this.bShowRI = false;
			}
		},

		bSwitchGloomyDisp(){
			this.bShowRN = false;
			this.bShowRI = false;
			this.bShowDuetSBCRN = false;
			this.bShowDuetSBCRI = false;
			if(this.bShowGloomyRN){
				this.bShowGloomyRN = false;
				this.bShowGloomyRI = true;
			}else{
				this.bShowGloomyRN = true;
				this.bShowGloomyRI = false;
			}
		},

		bSwitchDuetSBCDisp(){
			this.bShowRN = false;
			this.bShowRI = false;
			this.bShowGloomyRN = false;
			this.bShowGloomyRI = false;
			this.bShowDuetSBCRI =false;
			if(this.bShowDuetSBCRN){
				this.bShowDuetSBCRN = false;
				this.bShowDuetSBCRI = true;
			}else{
				this.bShowDuetSBCRN = true;
				this.bShowDuetSBCRI = false;
			}
		},

		checkShowAllRel(){
			if(!this.bShowPreRelease){this.bShowAllReleases = false}
		},

		async doGloomyRelease(tmpTag){
			this.gloomyRIJSON = {body: ""};
			this.gloomyRNJSON = {body: ""};
			this.gloomyRIJSON = this.allGloomyReleasesJSON.filter(item => (item.tag_name == tmpTag));
			this.gloomyRIJSON = this.gloomyRIJSON[0];
			//get the release notes links from the release body
			let hrefArr = this.gloomyRIJSON.body.match(/https:.*WHATS_NEW_UNIFIED.md/g);
			let tmpStr = hrefArr[0];
			tmpStr = tmpStr.replace("https://github.com/gloomyandy/RepRapFirmware/blob/", "");
			const relJSONGet = await this.getByGitFileRaw(tmpStr, this.gitOwnerNameGloomy, this.gitRepoNameGloomy).then(res => res);
			const tmpTxt = await relJSONGet;
			this.gloomyRNJSON = {body: tmpTxt};
			this.bShowGloomyRI = true;
			this.bGotGloomyRN = true;
			this.bGotGloomyRI = true;
		},

		async loadSDFile(fileName, sdDir) {
			//loads file as text from SD Card 
			//path should be taken from OM eg : state.directories.system
			//returns null for anything other than success
			if(fileName && sdDir){
				try {
					const setFileName = Path.combine(sdDir, fileName);
					const response = await this.machineDownload({ filename: setFileName, type: 'text', showSuccess: false });
					return await response;
				} catch (e) {
					if (!(e instanceof DisconnectedError) && !(e instanceof OperationCancelledError)) {
						console.warn("Unable to retrieve SD File : " + e);
					}
					return null;
				}
			}else{
				console.warn("Required Values not met to retrieve SD File");
				return null;
			}
		},		

		async getAllReleasesJSON(gitUName, gitRepoName){
			//Get the all releases in JSON object
			if(gitUName && gitRepoName){
				const relJSONGet = await this.getByGitAPI('releases', gitUName, gitRepoName);
				const relJSON = await relJSONGet;
				if(relJSON){
					//re-order by date release published
					var relJSONFiltered = relJSON.sort((a, b) => (a.published_at < b.published_at) ? 1 : -1)
					if(gitUName == this.gitOwnerNameDuet){
						//remove some allways unwanted items for Duet Releases (nothing pre 3.2 and anything beginning with 'v')
						relJSONFiltered = relJSON.filter(item => (item.tag_name >= "3.2" && !(item.tag_name.charAt(0)=='v')));
						//pruning based on release date and type of release eg if full release remove all ref's to betas & RC's before it was released etc
						var allFullReleasesJSON = relJSONFiltered.filter(item => (item.prerelease == false));
						relJSONFiltered = relJSONFiltered.filter(item => (item.published_at <= allFullReleasesJSON[0].published_at && item.prerelease == false) || (item.published_at >= allFullReleasesJSON[0].published_at));
					}else{
						//process gloomy releses if required
						this.bShowGloomyReleases = true;
					}
					return relJSONFiltered;
				}else{
					console.warn("getAllReleasesJSON unable to retrieve data");
					return null;
				}
			}else{
				console.warn("getAllReleasesJSON required values not met");
				return null;
			}
		},

		async getReleaseNotes(gitUName, gitRepoName, gitTagName){
			//retrieve the RN based on tag
			if(gitUName && gitRepoName && gitTagName){
				//const md = new markdownIt();
				let majorVNumStr = gitTagName.substr(0,1);
				var tmpFName = "";
				var rnType = "";
				if(gitUName == this.gitOwnerNameDuet){					
					if(gitRepoName == this.gitRepoNameDuet){
						//Standard Config
						if(gitTagName.toLowerCase().includes('beta')){
							tmpFName = `Changelog-RRF-${majorVNumStr}.x-Beta.md`;
							rnType = "Beta"
						}
						else if(gitTagName.toLowerCase().includes('rc')){
							tmpFName = `Changelog-RRF-${majorVNumStr}.x-RC.md`;
							rnType = "RC"
						}else{
							tmpFName = `Changelog-RRF-${majorVNumStr}.x.md`;
							rnType = "Full"
						}
						
					}else if(gitRepoName == this.gitSBCRepoNameDuet){
						//Duet SBC Mode
						if(gitTagName.toLowerCase().includes('beta')){
							tmpFName = `Changelog-DSF-${majorVNumStr}.x-Beta.md`;
							rnType = "Beta"
						}
						else if(gitTagName.toLowerCase().includes('rc')){
							tmpFName = `Changelog-DSF-${majorVNumStr}.x-RC.md`;
							rnType = "RC"
						}else{
							tmpFName = `Changelog-DSF-${majorVNumStr}.x.md`;
							rnType = "Full"
						}
					}
					const relJSONGet = await this.getByGitWikiRaw(tmpFName, gitUName, gitRepoName);
					const relText = await relJSONGet;
					if(await relText){
						if(gitRepoName == this.gitRepoNameDuet){
							let conv = this.convertRNtoJSON(relText, rnType, gitUName, gitTagName, gitRepoName);
							//always show the duet rn when fetched
							this.bGotDuetRN = true;
							this.bShowRN = false;
							this.bSwitchDuetDisp();
							return conv;
						}
						if(gitRepoName == this.gitSBCRepoNameDuet){
							let conv = this.convertRNtoJSON(relText, rnType, gitUName, this.currDSFTag, gitRepoName);
							this.bGotDuetSBCRN = true;
							return conv;
						}						
					}else{
						console.warn("getReleaseNotes unable to retrieve data");
						return null;
					}
				}			
			}else{
				console.warn("getReleaseNotes required values not met");
				return null;
			}
		},

		async getDuetSBCRI(tmpTag){
			//first we have to re-configure the tag to match DSF tagging structure
			let majorVNumStr = tmpTag.substr(0,1);
			let minorVNumStr = tmpTag.substr(2,1);
			let subVNumStr = "0";
			let prefix = "";
			let prefix2 = "";
			let suffix = "";
			let tmpBetaNumber = 0;
			if(tmpTag.length > 3){
				subVNumStr = tmpTag.substr(4,1);
				//console.log(tmpTag.substr(4,1))
			}
			prefix = `${majorVNumStr}.${minorVNumStr}`;
			prefix2 = `${majorVNumStr}.${minorVNumStr}.${subVNumStr}`;
			if(tmpTag.toLowerCase().includes('beta')){
				if(tmpTag.includes('-')){
					//checking for Addendum
					tmpBetaNumber = parseInt(tmpTag.slice(tmpTag.toLowerCase().indexOf('beta')+4, tmpTag.toLowerCase().indexOf('-')));
				}else{
					tmpBetaNumber = parseInt(tmpTag.slice(tmpTag.toLowerCase().indexOf('beta')+4));
				}
				suffix = `-b${tmpBetaNumber}`;				
			}
			else if(tmpTag.toLowerCase().includes('rc')){
				if(tmpTag.includes('-')){
					//checking for Addendum
					tmpBetaNumber = parseInt(tmpTag.slice(tmpTag.toLowerCase().indexOf('rc')+2, tmpTag.toLowerCase().indexOf('-')));
				}else{
					tmpBetaNumber = parseInt(tmpTag.slice(tmpTag.toLowerCase().indexOf('rc')+2));
				}
				suffix = `-rc${tmpBetaNumber}`;
			}else{
				suffix = "";
			}
			let dsfTag = `v${prefix}${suffix}`;
			if(!this.bGotAllSBCReleases){
				//only get the sbc release info if we have not already done so
				const riJSONGet = await this.getByGitAPI('releases', this.gitOwnerNameDuet, this.gitSBCRepoNameDuet);
				this.allSBCReleasesJSON = await riJSONGet;
				this.bGotAllSBCReleases = true;
			}			
			//check if the tag is there
			let currRISBC = this.allSBCReleasesJSON.filter(item => item.tag_name == dsfTag)
			if(currRISBC.length == 0){
				//this tag was not found try a different format because the formatting is variable
				let dsfTag = `v${prefix2}${suffix}`;
				currRISBC = this.allSBCReleasesJSON.filter(item => item.tag_name == dsfTag)
			}
			if(currRISBC.length > 0){
				this.bGotDuetSBCRI = true;
				//need this as apparently its not possible to be conistent across the release tags
				this.currDSFTag = dsfTag;
				return currRISBC;
			}else{
				return [];
			}

		},

		doFormatBold(str){
			//replace strings matching **some text** with <strong>some text</strong>
			var newstr = str.replace(/\*{2}(.*?)\*{2}/g, `<strong>$1</strong>`);
			if(newstr){
				return newstr;
			}else{
				return str;
			}
		},

		doFormatLink(str){
			//replace all the hyperlinks so they open in a new window
			var strArr = str.match(/(?<!!)\[{1}(.*?)\]{1}\(http(.*?)\)/g);
			var i=0;
			var newStr = "";
			var tmpRef = "";
			var tmpTxt = "";
			var tmpPos = 0;
			for(i in strArr){
				tmpPos = strArr[i].indexOf("(http");
				tmpRef = strArr[i].substring(tmpPos+1, strArr[i].length-1);
				tmpPos = strArr[i].indexOf("]");
				tmpTxt = strArr[i].substring(1, tmpPos);
				newStr = str.replace(strArr[i], `<a title="${tmpRef}" onclick="window.open(this.title, '_blank')"  style="color: green">${tmpTxt}</a>`);
			}
			if(newStr){
				return newStr;
			}else{
				return str;
			}
		},

		doReplaceGloomyWNLinks(str){
			//replaces a specific link -- might not be needed
			var newstr = str.replace(/https:\/\/github.com\/gloomyandy\/RepRapFirmware\/blob\/WHATS_NEW_UNIFIED.md/g, `https://raw.githubusercontent.com/gloomyandy/RepRapFirmware/WHATS_NEW_UNIFIED.md`);
			return newstr;
		},

		convertRNtoJSON(rnRawMD, strType, gitUName, gitTagName, gitRepoName){
			//convert the release notes md file to structured json
			//strType = Beta, RC, Full
			if(rnRawMD && strType && gitUName && gitTagName){
				//first do some non conditional formatting as its easier to do here
				rnRawMD = this.doFormatBold(rnRawMD);
				rnRawMD = this.doFormatLink(rnRawMD);
				//second breakup md by new line in JSON
				var rnArray = rnRawMD.split(/\r?\n/);
				var i=0;
				var rnJSON = {lines: []};
				for(i in rnArray){
					rnJSON.lines.push({line: rnArray[i]});
				}
				rnJSON.lines = rnJSON.lines.filter(item => (item.line !== "")); //allways remove empty lines
				//filter out unwanted Duet stuff
				var t=0;
				for(t in this.relMgrData.duetRNFilters){
					rnJSON.lines = rnJSON.lines.filter(item => (!item.line.toLowerCase().includes(this.relMgrData.duetRNFilters[t])));
				}
				//filter out any remaining ==== lines
				rnJSON.lines = rnJSON.lines.filter(item => (!item.line.toLowerCase().includes("====")));
				const newRNJSON = {releases: [], relType: strType, selTag: gitTagName, gUName: gitUName, class: "rn", gRName: gitRepoName};
				var currSecStr = "";
				var currRelStr = "";
				i=0;
				//now create the final rn JSON
				//we can process sequentially here as the RN's are in linear sections
				let strIndex = "";
				if(gitRepoName == this.gitRepoNameDuet){
					strIndex = "reprapfirmware "
				}else{
					strIndex = "version "
				}
				//process Duet rn's
				for(i in rnJSON.lines){
					if(rnJSON.lines[i].line.toLowerCase().indexOf(strIndex) == 0){
						//this is a release
						newRNJSON.releases.push({release: rnJSON.lines[i].line, sections:[], color: "", hover: "", hwMatch: false, confGMatch: false, fileMatch: false})
						currRelStr = rnJSON.lines[i].line;
						// console.log("currRelStr")
						// console.log(currRelStr)
					}else if(rnJSON.lines[i].line.slice(-1) === ":" && rnJSON.lines[i].line.charAt(0) !== "-"){
						//this is a section
						var c=0;
						for(c in newRNJSON.releases){
							if(newRNJSON.releases[c].release == currRelStr){
								newRNJSON.releases[c].sections.push({section: rnJSON.lines[i].line, lines: [], color: "", hover: "", hwMatch: false, confGMatch: false, fileMatch: false});
								currSecStr = rnJSON.lines[i].line;
							}
						}
						// console.log("currSecStr")
						// console.log(currSecStr)						
					}else{
						//this is section content
						var d=0;
						var e=0;
						for(d in newRNJSON.releases){
							if(newRNJSON.releases[d].release == currRelStr){
								e=0;
								for(e in newRNJSON.releases[d].sections){
									if(newRNJSON.releases[d].sections[e].section == currSecStr){
										let tmpRelIMup = marked.parse(rnJSON.lines[i].line, {gfm : true});
										newRNJSON.releases[d].sections[e].lines.push({line:{text: tmpRelIMup, color: "", hover: "", hwMatch: false, hwHover: "", confGMatch: false, fileMatch: false, fileHover:""}});
									}
								}
							}
						}
					}
				}
				//re-order to put the first item in this.relMgrData.duetRNSections as the first section in the rn - remainder will follow the source order
				i=0;
				var f=0;
				for(i in newRNJSON.releases){
					for(f in newRNJSON.releases[i].sections){
						if(newRNJSON.releases[i].sections[f].section == this.relMgrData.duetRNSection){
							let tmpSec = newRNJSON.releases[i].sections[f];
							newRNJSON.releases[i].sections.splice(f,1);
							newRNJSON.releases[i].sections.unshift(tmpSec);
						}
					}
				}
				//console.log(newRNJSON)
				return newRNJSON;
			}else{
				console.warn("convertDuetRN required values not met");
				return null;
			}

		},

	},
	watch: {
		darkTheme(to) {
			this.$vuetify.theme.dark = to;
		},
		bShowPreRelease(){
			this.resetAll();
		},
		bShowAllReleases(){
			this.resetAll();
		},
		bPageReload(){
			this.resetAll();
			this.bShowGloomyReleases = false;
			this.startUp();
		},
		$route(to, from){
			if(to.path === "/ReleaseMgr"){
				window.document.getElementById("global-container").hidden = true;
			}
			if(from.path === "/ReleaseMgr"){
				window.document.getElementById("global-container").hidden = false;
			}
		},
	}
}
</script>