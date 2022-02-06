<style>
	.main-container {
		max-height: calc(100vh - 64px);
		height:auto;
		overflow-y: auto;
		overflow-x: hidden;
	}

	.divcontent {
		min-height:1000px; 
	}
</style>
<template>
	<div>
		<v-card flat width="100%">
			<div width="100%" class="mb-3">
				<v-row dense width="100%" class="ma-0 pa-0">
					<v-col cols="12">
						<v-card width="100%" :style="backCol">
							<v-card-text class="pa-0 ma-1" style="overflow: hidden !important;">
								<v-row dense class="pa-0 ma-0" justify="start" align="center">
									<v-col cols="2" justify="start">
										<span><v-icon small class="mr-1">mdi-information</v-icon><span><strong>Firmware Info</strong></span></span>
									</v-col>
									<v-col cols="9">
										<v-row dense class="pa-0 ma-0" justify="center" align="center">
											<span><strong>Current Firmware Version :</strong> {{ fwVer }}</span>
											<v-spacer></v-spacer>
											<span><strong>Firmware Source :</strong> {{ fwSrcFriendlyName }}</span>
											<v-spacer></v-spacer>
											<span><strong>Control Board :</strong> {{ conBoard }}</span><span v-if="systemDSFVer"> (+ SBC)</span>
											<v-spacer></v-spacer>
											<span><v-switch label="Check For Beta Releases" align="center" v-model="bfetchPreRelease" @change="getCurrDuetRelease()"></v-switch></span>
										</v-row>
									</v-col>
								</v-row>
								<v-row dense class="pl-2 pt-0 ma-0" justify="start" align="center">
									<v-col cols="6">
										<v-row justify="start" align="center" v-if="fwSrc != 'gloomy'" >
											<v-col cols="4">
												<v-row justify="start" align="center">
													<v-select label="Select Duet Release" :items="fetchedTagsList" v-model="selectedRelTag" @change="selectedTag(selectedRelTag)"></v-select>
												</v-row>
											</v-col>
											<v-col cols="2">
												<v-tooltip top>
													<template v-slot:activator="{ on, attrs }">
													<v-btn small v-bind="attrs" v-on="on" @click="getCurrDuetRelease()"><v-icon>mdi-autorenew</v-icon></v-btn>
													</template>
													<span>Refresh Release List</span>
												</v-tooltip>
											</v-col>
											<v-spacer></v-spacer>
										</v-row>
										<v-row justify="start" align="center" v-if="fwSrc == 'gloomy'" >
											<v-col cols="8">
												<v-row justify="start" align="center">
													<v-col cols="6">
														<v-select v-if="fwSrc == 'gloomy'" label="Select Team Gloomy Release" :items="fetchedGloomyTagsList" v-model="selectedGloomyRelTag" @change="selectedGloomyTag(selectedGloomyRelTag)"></v-select>
													</v-col>
													<v-spacer></v-spacer>
													<v-col cols="6">
														<v-select label="Select Duet Release" :items="fetchedTagsList" v-model="selectedRelTag" @change="selectedTag(selectedRelTag)"></v-select>
													</v-col>
												</v-row>
											</v-col>
											<v-col cols="2">
												<v-tooltip top>
													<template v-slot:activator="{ on, attrs }">
													<v-btn small v-bind="attrs" v-on="on" @click="getCurrDuetRelease()"><v-icon>mdi-autorenew</v-icon></v-btn>
													</template>
													<span>Refresh Release List</span>
												</v-tooltip>
											</v-col>
											<v-spacer></v-spacer>
										</v-row>
									</v-col>
									<v-col cols="2">
										<v-row justify="start" align="center">
											<span v-if="fwSrc == 'gloomy'"><strong>{{gloomyRelLabel}}</strong><a :title="`${currGloomyRelease} on github`" :onclick="`window.open('${currGloomyReleaseURL}', '_blank');`" style="color: green">{{ currGloomyRelease }}</a></span><v-spacer></v-spacer>
											<span><strong>{{ duetRelLabel }}</strong><a :title="`${currRelease} on github`" :onclick="`window.open('${currReleaseURL}', '_blank');`" style="color: green">{{ currRelease }}</a></span>
										</v-row>
									</v-col>
									<v-col cols="3">
										<v-row justify="end" align="center" v-if="bGotReleaseNotes">
											<span class="ma-1"><strong>Validation Actions:</strong></span>
											<span class="ma-1"><v-tooltip top>
												<template v-slot:activator="{ on, attrs }">
													<v-icon v-bind="attrs" v-on="on" @click="dispConfgCheck()">mdi-code-tags-check</v-icon>
												</template>
												<span>Check Config.g</span>
											</v-tooltip></span>
											<span class="ma-1"><v-tooltip top>
												<template v-slot:activator="{ on, attrs }">
													<v-icon v-bind="attrs" v-on="on" @click="dispFilesCheck()">mdi-file-search</v-icon>
												</template>
												<span>Check Files</span>
											</v-tooltip></span>
											<span class="ma-1"><v-tooltip top>
												<template v-slot:activator="{ on, attrs }">
													<v-icon v-bind="attrs" v-on="on" @click="dispRelNotes()">mdi-book-open</v-icon>
												</template>
												<span>Review Duet Release Notes</span>
											</v-tooltip></span>
											<span class="ma-1" v-if="fwSrc == 'gloomy' && bGotGloomyReleaseNotes"><v-tooltip top>
												<template v-slot:activator="{ on, attrs }">
													<v-icon v-bind="attrs" v-on="on" @click="dispGloomyRelNotes()">mdi-weather-rainy</v-icon>
												</template>
												<span>Review Team Gloomy Release Info</span>
											</v-tooltip></span>
										</v-row>
										<v-row justify="end" align="center" v-if="fwSrc == 'gloomy' && bGotGloomyReleaseNotes && !bGotReleaseNotes">
											<span class="ma-1"><strong>Actions:</strong></span>
											<span class="ma-1" v-if="fwSrc == 'gloomy'"><v-tooltip top>
												<template v-slot:activator="{ on, attrs }">
													<v-icon v-bind="attrs" v-on="on" @click="dispGloomyRelNotes()">mdi-weather-rainy</v-icon>
												</template>
												<span>Review Team Gloomy Release Info</span>
											</v-tooltip></span>
										</v-row>
									</v-col>
								</v-row>
							</v-card-text>
						</v-card>
					</v-col>	
				</v-row>
			</div>
			<v-flex class="main-container">
				<div class="divcontent">
					<v-card flat>
						<v-row width="100%">					
							<v-col cols="11" v-if="bGotReleaseNotes && bDispConfgCheck">
								<v-row class="ma-1" justify="center" align="center">
									<span justify="center" align="center">{{tmpLang.plugin.ReleaseMgr.configAssTitle}}</span>
								</v-row>
								<v-row justify="center" align="center">
									<v-card flat>
										<v-card class="overflow-auto" flat width="100%" justify="center" align="center" :style="`${backCol}`">
											<v-card-text class="content text-xs-center">
												<v-list :style="`${backCol}; max-height: 370px`" flat dense v-if="!matchedGCodes === undefined || matchedGCodes.length >= 0">
													<v-list-item v-for="(item, i) in matchedGCodes" :key="i">
														<v-list-item-content>
															<v-list-item-title v-text="item"></v-list-item-title>
														</v-list-item-content>
													</v-list-item>
												</v-list>
											</v-card-text>
										</v-card>
										<span v-if="!matchedGCodes === undefined || matchedGCodes.length > 0" justify="center">{{tmpLang.plugin.ReleaseMgr.configAssGcodeMatchState}} {{selectedRelTag}}.</span>
										<span v-if="matchedGCodes === undefined || matchedGCodes.length == 0" justify="center">{{tmpLang.plugin.ReleaseMgr.configAssGcodeNoMatchState}}</span>
									</v-card>
								</v-row>
							</v-col>
							<v-col cols="11" v-if="bGotReleaseNotes && bDispFilesCheck">
								<v-row dense width="100%" justify="center" align="center">
									<v-col cols="1"></v-col>
									<v-col cols="5">
										<v-row justify="center" align="center" class="ma-2">
											<v-spacer></v-spacer>
												<v-btn @click="macroMode = !macroMode">{{ macroMode ? tmpLang.plugin.ReleaseMgr.fileBrowserMacroMode : tmpLang.plugin.ReleaseMgr.fileBrowserSysMode }}</v-btn>
											<v-spacer></v-spacer>
										</v-row>
									</v-col>
									<v-col cols="6">
										<v-row justify="center" align="center">
											<v-spacer v-if="!bFileClicked"></v-spacer>
											<span v-if="bFileClicked" justify="center" align="center">{{tmpLang.plugin.ReleaseMgr.fileBrowserFileClickedP1}}<strong>{{fileClicked}}</strong>{{tmpLang.plugin.ReleaseMgr.fileBrowserFileClickedP2}}<strong>{{selectedRelTag}}</strong>.</span>
										</v-row>
									</v-col>
								</v-row>
								<v-row dense width="100%" class="ma-2" :style="`max-height: 370px;`">
									<v-col cols="1"></v-col>
									<v-col cols="5">
										<FileCheckList  class="content overflow-auto" @fileClcked="usrClickedFile" @currDir="SetCurrMacroDir" :impactedFiles="impactedMacros" :macroMode="macroMode" :key="macroMode"></FileCheckList>							
										<span justify="center" align="center">{{tmpLang.plugin.ReleaseMgr.fileBrowserFootor1}}{{tmpLang.plugin.ReleaseMgr.fileBrowserFootor2}}</span>
									</v-col>
									<v-col cols="6">
										<v-card flat width="100%" justify="center" align="center" :style="`${backCol} max-height: 370px`">
											<v-card-text v-if="bFileClicked" class="content text-xs-center">
												<v-list :style="`${backCol}; max-height: 345px; overflow-y: auto`" flat dense v-if="!matchedGCodes === undefined || matchedGCodes.length >= 0">
													<v-list-item v-for="(item, i) in matchedGCodes" :key="i">
														<v-list-item-content>
															<v-list-item-title v-text="item"></v-list-item-title>
														</v-list-item-content>
													</v-list-item>
												</v-list>
											</v-card-text>
										</v-card>
									</v-col>
								</v-row>
							</v-col>
							<v-col cols="11" v-if="bGotReleaseNotes && bDispRelNotes">
								<v-row class="ma-1" justify="center" align="center">
									<v-spacer></v-spacer>
										<v-btn @click="bSwitchDuetNotes = !bSwitchDuetNotes">{{ bSwitchDuetNotes ? tmpLang.plugin.ReleaseMgr.switchDuetRN : tmpLang.plugin.ReleaseMgr.switchDuetRI }}</v-btn>
									<v-spacer></v-spacer>
								</v-row>								
								<v-row dense width="100%" class="ma-2" justify="center" align="center">
									<v-col cols="1"></v-col>
									<v-col cols="11" justify="center" align="center">
										<v-row v-if="!bSwitchDuetNotes" class="ma-1">
											<v-spacer></v-spacer>
											<v-card flat width="100%" :style="`${backCol} max-height: 450px;`" class="overflow-auto">
												<div v-html="renderedRN" style="text-align: left; !important"></div>
											</v-card>
											<v-spacer></v-spacer>
										</v-row>
										<v-row v-if="bSwitchDuetNotes">
											<v-col cols="9">
												<v-card flat width="100%" :style="`${backCol} max-height: 450px;`" class="overflow-auto">
													<div v-html="renderedRI" style="text-align: left; !important"></div>
												</v-card>
											</v-col>
											<v-col cols="3">
												<v-row justify="center" align="center" class="ma-0">
													<v-card flat width="100%" justify="center" align="center" :style="`${backCol}; max-height: 370px`" class="overflow-auto">
														<v-card-text class="content text-xs-center">
															<span><strong>{{tmpLang.plugin.ReleaseMgr.releaseAssetsHeader}}</strong></span>
															<v-list :style="`${backCol}; max-height: 370px`" flat dense v-if="!matchedGCodes === undefined || matchedGCodes.length >= 0">
																<v-list-item v-for="(item, i) in duetRelAssets" :key="i">
																	<v-list-item-content>
																		<v-list-item-title v-text="item.name" @click="assetClick(item.browser_download_url)"  style="color: green; cursor: pointer"></v-list-item-title>
																	</v-list-item-content>
																</v-list-item>
															</v-list>
														</v-card-text>
														<!-- <span v-if="systemDSFVer">Run the CMD: <strong>###</strong> to update your SBC's dsf to the latest version</span> -->
													</v-card>
												</v-row>
											</v-col>
										</v-row>
									</v-col>
								</v-row>
							</v-col>
							<v-col cols="11" v-if="bGotGloomyReleaseNotes && bDispGloomyRelNotes">
								<v-row class="mb-2" justify="center" align="center">
									<v-spacer></v-spacer>
										<v-row class="ma-2" justify="center" align="center">
											<v-spacer></v-spacer>
												<v-btn @click="bSwitchTGNotes = !bSwitchTGNotes">{{ bSwitchTGNotes ? tmpLang.plugin.ReleaseMgr.switchGloomyRI : tmpLang.plugin.ReleaseMgr.switchGloomyRN }}</v-btn>
											<v-spacer></v-spacer>
										</v-row>	
									<v-spacer></v-spacer>
								</v-row>
								<v-row dense width="100%" class="ma-3" justify="center" align="center">
									<v-col cols="1"></v-col>
									<v-col cols="11" justify="center" align="center">
										<v-row v-if="bSwitchTGNotes">
											<v-spacer></v-spacer>
											<v-card flat width="100%" :style="`${backCol} max-height: 450px;`" class="overflow-auto">
												<div v-html="renderedGloomyUnRN" style="text-align: left; !important"></div>
											</v-card>
											<v-spacer></v-spacer>
										</v-row>
										<v-row v-if="!bSwitchTGNotes">
											<v-col cols="9">
												<v-card flat width="100%" :style="`${backCol} max-height: 450px;`" class="overflow-auto">
													<div v-if="!bSwitchTGNotes" v-html="renderedGloomyRN" style="text-align: left; !important"></div>
												</v-card>
											</v-col>
											<v-col cols="3">
												<v-row justify="center" align="center" class="ma-0">
													<v-card flat width="100%" justify="center" align="center" :style="`${backCol}`" class="overflow-auto">
														<v-card-text class="content text-xs-center">
															<span><strong>{{tmpLang.plugin.ReleaseMgr.releaseAssetsHeader}}</strong></span>
															<v-list :style="`${backCol}; max-height: 370px`" flat dense v-if="!matchedGCodes === undefined || matchedGCodes.length >= 0">
																<v-list-item v-for="(item, i) in gloomyRelAssets" :key="i">
																	<v-list-item-content>
																		<v-list-item-title v-text="item.name" @click="assetClick(item.browser_download_url)"  style="color: green; cursor: pointer"></v-list-item-title>
																	</v-list-item-content>
																</v-list-item>
															</v-list>
														</v-card-text>
														<!-- <span v-if="systemDSFVer">Run the CMD: <strong>###</strong> to update your SBC's dsf to the latest version</span> -->
													</v-card>
												</v-row>
											</v-col>
										</v-row>
									</v-col>
								</v-row>
							</v-col>
						</v-row>
					</v-card>
				</div>
			</v-flex>
		</v-card>
	</div>
</template>

<script>


import { mapGetters, mapState, mapActions, mapMutations } from 'vuex';
import { DisconnectedError, OperationCancelledError } from '../../utils/errors.js';
import Path from '../../utils/path.js';
import { isPrinting } from '../../store/machine/modelEnums.js';
import FileCheckList from './FileCheckList.vue';
import { marked } from 'marked';
import tempENLang from './en.js';
import axios from 'axios';



export default {
	components: {
        FileCheckList
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
		systemDSFVer(){
			if(this.systemDSFVerStr !== null && this.systemDSFVerStr !== ''){
				return true;
			}else{
				return false;
			}
		},
		fwSrc(){
			if(this.model.boards[0].firmwareName.toLowerCase().includes('duet') || this.model.boards[0].firmwareName == ""){
				return 'duet';
			}else {
				return 'gloomy'
			}
		},
		fwSrcFriendlyName(){
			if(this.fwSrc == "gloomy"){
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
		}
	},
	//temporary Lang Stuff to make it easier to replace later
	mixins: [
		tempENLang
	],

	data: function () {
		//Changes to btnCmd:{} structure must also be made in BtnCmdDataFunctions.js
		return {
			bTemp: false,
			bGotReleaseNotes: false,
			bGotGloomyReleaseNotes: false,
			bSwitchTGNotes: false,
			bSwitchDuetNotes: false,
			currRelease: null,
			currGloomyRelease: null,
			currReleaseURL: null,
			currGloomyReleaseURL: null,
			fetchedReleases: null,
			fetchedTagsList: [],
			fetchedGloomyTagsList: [],
			selectedGloomyRelTag: null,
			fethcedReleaseNotes: null,
			fethcedReleaseInfo: null,
			fethcedGloomyReleaseNotes: null,
			fetchedRelNotesGCodes: null,
			uniqueRelNotesGCodes: null,
			bfetchPreRelease: false,
			selectedRelTag: null,
			tempURL: 'https://raw.githubusercontent.com/wiki/Duet3D/RepRapFirmware/',
			configG: null,
			matchedGCodes: [],
			files: null,
			gitOwnerName: 'Duet3D',
			gitGloomyOwnerName: 'gloomyandy',
			gitRepoName: "RepRapFirmware",
			impactedFiles: [],
			macroDir: null,
			impactedMacros: [],
			macroMode: false,
			bDispConfgCheck: false,
			bDispFilesCheck: false,
			bDispRelNotes: false,
			bDispGloomyRelNotes: false,
			fileClicked: null,
			bFileClicked: false,
			renderedRN: "",
			renderedRI: "",
			renderedGloomyRN:"",
			duetRelLabel: "",
			gloomyRelLabel: "",
			renderedGloomyUnRN: "",
			duetRelAssets: [],
			gloomyRelAssets: [],
		}
	},
	
	mounted(){
		//do an intial load
		this.getCurrDuetRelease()
	},

    methods: {
		...mapActions('machine', ['sendCode']),
		...mapActions('machine', {machineDownload: 'download', getFileList: 'getFileList'}),
        ...mapActions('machine', ['upload']),
		...mapMutations('machine/settings', ['addCode', 'removeCode']),

		assetClick(tmpURL){
			window.open(tmpURL);
		},

		SetCurrMacroDir(e){
			this.macroDir = e;
		},

		usrClickedFile(e){
			this.fileClicked = e;
		},

		rmAvailHeight () {
			//get available screen height (not sure if need this)
			if(!this.$vuetify.breakpoint.mobile){
				return window.innerHeight - 140;
			}else{
				return window.innerHeight;
			}
		},

		async dispConfgCheck(){
			this.bDispFilesCheck = false;
			this.bDispRelNotes = false;
			this.bDispGloomyRelNotes = false;
			if(!this.configG){this.configG = await this.loadConfGFile();}
			this.bDispConfgCheck = true;
			this.bFileClicked = false;
			this.fileClicked = null;
			this.crossCheckGcodes(this.uniqueRelNotesGCodes, this.configG);
		},

		async dispFilesCheck(){
			this.bDispRelNotes = false;
			this.bDispGloomyRelNotes = false;
			this.bDispConfgCheck = false;
			this.bDispFilesCheck = true;
			this.bFileClicked = false;
			this.fileClicked = null;
			if(!this.macroMode){
				await this.checkSysGFiles();
			}else{
				await this.checkMacroFiles();
			}
		},

		dispRelNotes(){
			this.bDispConfgCheck = false;
			this.bDispFilesCheck = false;
			this.bDispGloomyRelNotes = false;
			this.bDispRelNotes = true;
			this.bFileClicked = false;
			this.fileClicked = null;
		},

		dispGloomyRelNotes(){
			this.bDispConfgCheck = false;
			this.bDispFilesCheck = false;
			this.bDispRelNotes = false;
			this.bFileClicked = false;
			this.bDispGloomyRelNotes = true;
			this.fileClicked = null;
		},

		async getCurrDuetRelease() {
			this.matchedGCodes = [];
			this.currRelease = null;
			this.currReleaseURL = null;
			this.currGloomyRelease = null;
			this.currGloomyReleaseURL = null;
			this.bDispGloomyRelNotes = false;
			this.bDispRelNotes = false;
			this.bDispGloomyRelNotes = false;
			this.bGotGloomyReleaseNotes = false;
			this.impactedFiles = [];
			this.impactedMacros = [];
			this.renderedGloomyRN = "";
			this.renderedRN = "";
			this.fileClicked = null;
			if(this.fwSrc == 'duet'){
				await this.getReleasesList();
			}else{
				await this.getReleasesList();
				await this.getGloomyReleasesList();
			}
		},

		async fecthLatestFullRelease(username, repository){
			//Get the latest full release
			let retjson = await axios.get(`https://api.github.com/repos/${username}/${repository}/releases/latest`).then(res => res.data);
			if(retjson.message) throw new TypeError("Cannot Find Latest Release");
			return retjson;
		},

		async fetchAllReleases(username, repository) {
			//Get a full list of all the releases to find the latest pre-release version
			let retjson = await axios.get(`https://api.github.com/repos/${username}/${repository}/releases`).then(res => res.data);
			if(retjson.message) throw new TypeError("Cannot Find Latest PreRelease");
			return retjson;
		},

		async getReleasesList(){
			//Get the list of releases and create the selection list in ui
			this.fetchedTagsList = [];
			this.selectedRelTag = null;
			this.bGotReleaseNotes = false;
			//get the rawlist
			const reList1 = await this.fetchAllReleases(this.gitOwnerName, this.gitRepoName)
			let reList = await reList1;
			//filter array based on prerelease switch
			reList = reList.filter(item => (item.prerelease == this.bfetchPreRelease));
			//re-order 
			reList.sort((a, b) => (a.published_at < b.published_at) ? 1 : -1)
			//remove any tags pre 3.2 or beginning with v
			reList = reList.filter(item => (item.tag_name >= "3.2" && !(item.tag_name.charAt(0)=='v')));
			let rn = 0
			for(rn in reList){
				this.fetchedTagsList.push(reList[rn].tag_name)
			}
			this.currRelease = reList[0].tag_name;
			this.currReleaseURL = reList[0].html_url;
			//store the full list object incase we need it later
			this.fetchedReleases = reList;
			this.duetRelLabel = "Latest Duet Release = "
		},

		async getGloomyReleasesList(){
			//Get the list of releases and create the selection list in ui
			this.fetchedGloomyTagsList = [];
			this.selectedGloomyRelTag = null;
			this.bGotGloomyReleaseNotes = false;
			//get the rawlist
			const reList1 = await this.fetchAllReleases(this.gitGloomyOwnerName, this.gitRepoName)
			let reList = await reList1;
			//filter array based on prerelease switch
			reList = reList.filter(item => (item.prerelease == this.bfetchPreRelease));
			//re-order 
			reList.sort((a, b) => (a.published_at < b.published_at) ? 1 : -1)
			let rn = 0
			for(rn in reList){
				this.fetchedGloomyTagsList.push(reList[rn].tag_name)
			}
			this.currGloomyRelease = reList[0].tag_name;
			this.currGloomyReleaseURL = reList[0].html_url;
			//store the full list object incase we need it later
			this.fetchedGloomyReleases = reList;
			this.gloomyRelLabel = "Latest Gloomy Release = "
		},

		async fetchReleaseNotes(tmpTag) {f
			this.bGotReleaseNotes = false;
			//get the raw release notes file from the wiki directly (This avoids CORS errors)
			//need to make sure it handles betas, RC's, and stable releases + Gloomy's stuff too
			this.fethcedReleaseNotes = "";
			this.fethcedReleaseInfo = "";
			//extract the release info
			let tmpRelObj = this.fetchedReleases.find(t=>t.tag_name === tmpTag).body;
			const tmpRelInfo = marked.parse(tmpRelObj, {gfm : true});
			this.duetRelAssets = this.fetchedReleases.find(t=>t.tag_name === tmpTag).assets;
			let hrefArr = tmpRelInfo.match(/<\s*a[^>]*/g);
			this.renderedRI = tmpRelInfo;
			let cn=0;
			for(cn in hrefArr){
				let tmpTxt = hrefArr[cn].replace("href", "title");
				this.renderedRI = this.renderedRI.replace(hrefArr[cn], tmpTxt + ` onclick="window.open(this.title, '_blank')"  style="color: green"`);
			}
			this.fethcedReleaseInfo = tmpRelInfo;
			//Check If Beta
			if(tmpTag.toLowerCase().includes('beta') || tmpTag.includes('RC')){
				//Changelog-RRF-3.x-Beta-&-RC.md
				//the code to get releases relies on the tab starting with the major version number
				//pattern expected = RepRapFirmware [ReleaseTag]
				//[ReleaseTag] is normally [MajorVerNum].[MinorVerNum].[SubVerNum]{[ReleaseType][IncrementNum]-[Addendum]}
				//{[ReleaseType][IncrementNum]-[Addendum]} is optional
				//[Addendum] must seperated with '-' for this code to work consistently
				let majorVNumStr = tmpTag.substr(0,1);
				const tmpResponse = await axios.get(`${this.tempURL}Changelog-RRF-${majorVNumStr}.x-Beta-&-RC.md`).then(res => res.data);
				if(tmpResponse.message) throw new TypeError("Could not get release notes");
				const tmpTxt = await tmpResponse;
				let rg = new RegExp("\nRepRapFirmware " + majorVNumStr + ".")
				let rnArray = tmpTxt.split(rg);
				//remove the toc from array
				rnArray.shift();
				//re-add removed text from splice
				let rnc = 0;
				for(rnc in rnArray){
					rnArray[rnc] = `RepRapFirmware ${majorVNumStr}.` + rnArray[rnc]; 
				}
				//Beta & RC release notes are cumlative so we need to get each seperate release note and combine them together
				let trmTag = "";
				let tmpBetaNumber = 0;
				if(tmpTag.toLowerCase().includes('beta')){
					trmTag = tmpTag.slice(0, tmpTag.toLowerCase().indexOf('beta')+4);
					if(tmpTag.includes('-')){
						//checking for Addendum
						tmpBetaNumber = parseInt(tmpTag.slice(tmpTag.toLowerCase().indexOf('beta')+4, tmpTag.toLowerCase().indexOf('-')));
					}else{
						tmpBetaNumber = parseInt(tmpTag.slice(tmpTag.toLowerCase().indexOf('beta')+4));
					}					
				}else{
					//must be an RC
					trmTag = tmpTag.slice(0, tmpTag.toLowerCase().indexOf('rc')+2)
					if(tmpTag.includes('-')){
						//checking for Addendum
						tmpBetaNumber = parseInt(tmpTag.slice(tmpTag.toLowerCase().indexOf('rc')+2, tmpTag.toLowerCase().indexOf('-')));
					}else{
						tmpBetaNumber = parseInt(tmpTag.slice(tmpTag.toLowerCase().indexOf('rc')+2));
					}
				}
				//Concatonate the releae notes together
				for (let i = tmpBetaNumber; i > 0; i--) {
					rnc = 0;
					for(rnc in rnArray){
						if(rnArray[rnc].search(`RepRapFirmware ${trmTag}${i}`) == 0){
							this.fethcedReleaseNotes = this.fethcedReleaseNotes + '\n' + rnArray[rnc];
						}							 
					}
				}
				this.fetchedRelNotesGCodes = this.fethcedReleaseNotes.match( /\b[a-zA-Z]{1}\d{3}\b/g );
				this.uniqueRelNotesGCodes = this.makeArrayUniq(this.fetchedRelNotesGCodes);
				this.bGotReleaseNotes = true;
			}
			else{
				//normal release
				let majorVNumStr = tmpTag.substr(0,1);
				const tmpResponse = await axios.get(`${this.tempURL}Changelog-RRF-${majorVNumStr}.x.md`).then(res => res.data);
				if(tmpResponse.message) throw new TypeError("Could not get release notes");
				const tmpTxt = await tmpResponse;
				let rg = new RegExp("\nRepRapFirmware " + majorVNumStr + ".")
				let rnArray = tmpTxt.split(rg);
				//remove the toc from array
				rnArray.shift();
				//re-add removed text from splice
				let rnc = 0;
				for(rnc in rnArray){
					rnArray[rnc] = `RepRapFirmware ${majorVNumStr}.` + rnArray[rnc]; 
				}
				for(rnc in rnArray){
					if(rnArray[rnc].search(`RepRapFirmware ${tmpTag}\n`) == 0){
						this.fethcedReleaseNotes = this.fethcedReleaseNotes + '\n' + rnArray[rnc];
					}							 
				}
				this.fetchedRelNotesGCodes = this.fethcedReleaseNotes.match( /\b[a-zA-Z]{1}\d{3}\b/g );
				this.uniqueRelNotesGCodes = this.makeArrayUniq(this.fetchedRelNotesGCodes);
				this.bGotReleaseNotes = true;
			}
			//console.log(this.fethcedReleaseNotes)
			const mdt = marked.parse(this.fethcedReleaseNotes, {gfm : true})
			//fix links to open in new window
			hrefArr = mdt.match(/<\s*a[^>]*/g);
			this.renderedRN = mdt;
			cn=0;
			for(cn in hrefArr){
				let tmpTxt = hrefArr[cn].replace("href", "title");
				this.renderedRN = this.renderedRN.replace(hrefArr[cn], tmpTxt + ` onclick="window.open(this.title, '_blank')"  style="color: green"`);
			}
			this.crossCheckDuetRelNotes();
		},

		async crossCheckDuetRelNotes(){
			this.configG = await this.loadConfGFile();
			//get matching gcodes
			this.crossCheckGcodes(this.uniqueRelNotesGCodes, this.configG);
			let cn = 0;
			let ln = 0;
			let tmpRE = null;
			let linesWithGcode = [];
			//using the already matched gcodes to highlight lines in release notes
			for(cn in this.matchedGCodes){
				tmpRE = new RegExp(this.matchedGCodes[cn],"g")
				linesWithGcode = this.renderedRN.split("\n").filter(function(a){return tmpRE.test(a); });
				for(ln in linesWithGcode){
					this.renderedRN = this.renderedRN.replace(linesWithGcode[ln], '<span class="red--text">' + linesWithGcode[ln] +'</span>');
				}
				//console.log(linesWithGcode)
			}
			//console.log(this.renderedRN)
		},

		async selectedTag(tmpTag){
			await this.fetchReleaseNotes(tmpTag);
			this.bSwitchDuetNotes = false;
			this.duetRelLabel = "Duet Release = "
			this.currRelease = tmpTag;
			this.currReleaseURL = this.fetchedReleases.find(t=>t.tag_name === tmpTag).html_url;
			this.dispRelNotes();
			//store the full list object incase we need it later
			//console.log(this.tmpLang)
		},

		async selectedGloomyTag(tmpTag){
			let reList = this.fetchedGloomyReleases.filter(item => (item.tag_name == tmpTag));
			const mdt = marked.parse(reList[0].body, {gfm : true});
			this.gloomyRelAssets = reList[0].assets;
			if(this.systemDSFVer){
				this.gloomyRelAssets = this.gloomyRelAssets.filter(t=>t.name.includes("-sbc-"));
			}else{
				this.gloomyRelAssets = this.gloomyRelAssets.filter(t=>!t.name.includes("-sbc-"));
			}
			//fix links to open in new window
			let hrefArr = mdt.match(/<\s*a[^>]*/g);
			this.renderedGloomyRN = mdt;
			let cn=0;
			let glrnURL =""
			for(cn in hrefArr){
				let tmpTxt = hrefArr[cn].replace("href", "title");
				this.renderedGloomyRN = this.renderedGloomyRN.replace(hrefArr[cn], tmpTxt + ` onclick="window.open(this.title, '_blank')"  style="color: green"`);
				//lets get the Gloomy release notes url
				let glrnArr = hrefArr[cn].search("WHATS_NEW_UNIFIED.md")
				if(glrnArr > 0){
					glrnURL = hrefArr[cn].slice(9);
					glrnURL = glrnURL.substring(0, glrnURL.length -1);
					//change to raw to avoid CORS issues
					glrnURL = glrnURL.replace("https://github.com/gloomyandy/RepRapFirmware/blob", "https://raw.githubusercontent.com/gloomyandy/RepRapFirmware")
				}
			}
			//Now process the unified release notes
			if(glrnURL.length > 0){
				this.renderedGloomyUnRN = "";
				const retMD = await axios.get(glrnURL).then(res => res.data);
				if(retMD.message) throw new TypeError("Could not get release notes");
				const retMD2 = await retMD;
				const mdt2 = marked.parse(retMD2, {gfm : true});
				this.renderedGloomyUnRN	= mdt2;
				let hrefArr = mdt.match(/<\s*a[^>]*/g);
				let cn=0;
				for(cn in hrefArr){
					let tmpTxt = hrefArr[cn].replace("href", "title");
					this.renderedGloomyUnRN = this.renderedGloomyUnRN.replace(hrefArr[cn], tmpTxt + ` onclick="window.open(this.title, '_blank')"  style="color: green"`);
				}
			}
			this.bGotGloomyReleaseNotes = true;
			this.bSwitchTGNotes = false;
			this.gloomyRelLabel = "Gloomy Release = "
			this.currGloomyRelease = tmpTag;
			this.currGloomyReleaseURL = reList[0].html_url;
			this.dispGloomyRelNotes();
		},

		makeArrayUniq(a) {
			//Remove Duplicates from the array
			return a.sort().filter(function(item, pos, ary) {
				return !pos || item != ary[pos - 1];
			});
		},

		async loadConfGFile() {
			try {
				const setFileName = Path.combine(this.systemDirectory, `config.g`);
				const response = await this.machineDownload({ filename: setFileName, type: 'text', showSuccess: false });
				return await response;
			} catch (e) {
				if (!(e instanceof DisconnectedError) && !(e instanceof OperationCancelledError)) {
					console.warn(e);
				}
			}
		},

		async loadSysGFile(fName) {
			try {
				const setFileName = Path.combine(this.systemDirectory, fName);
				const response = await this.machineDownload({ filename: setFileName, type: 'text', showSuccess: false });
				return await response;
			} catch (e) {
				if (!(e instanceof DisconnectedError) && !(e instanceof OperationCancelledError)) {
					console.warn(e);
				}
				return null;
			}
		},

		async checkClickedFile(){
			//check the file the user selects for matching gcodes
			const fileTxt = await this.loadMacroFile(this.fileClicked);
			const fileTxt2 = await fileTxt;
			this.crossCheckGcodes(this.uniqueRelNotesGCodes, fileTxt2);
			this.bFileClicked = true;
		},

		async loadMacroFile(fName) {
			try {
				const setFileName = Path.combine(this.macroDir, fName);
				const response = await this.machineDownload({ filename: setFileName, type: 'text', showSuccess: false });
				return await response;
			} catch (e) {
				if (!(e instanceof DisconnectedError) && !(e instanceof OperationCancelledError)) {
					console.warn(e);
				}
				return null;
			}
		},

		crossCheckGcodes(srcArray, txt4Checking){
			this.matchedGCodes = [];
			var arrID = 0;
			for(arrID in srcArray){
				if(txt4Checking.toLowerCase().includes(srcArray[arrID].toLowerCase())){
					this.matchedGCodes.push(srcArray[arrID])
				}
			}
		},

		async checkSysGFiles(){
			this.files = await this.getFileList(this.systemDirectory);
			let fc = 0;
			this.impactedMacros = [];
			for(fc in this.files){
				//Only check .g files excluding config.g as we have already tested this
				if(!this.files[fc].isDirectory && this.files[fc].name.toLowerCase().includes('.g') && !this.files[fc].name.toLowerCase().includes('.bak')){
					//identified a .g file so load it and check contents for 
					let tmpFile = await this.loadSysGFile(this.files[fc].name)
					let gc = 0;
					for(gc in this.uniqueRelNotesGCodes){
						if(tmpFile.toLowerCase().includes(this.uniqueRelNotesGCodes[gc].toLowerCase())){
							this.impactedMacros.push(this.files[fc].name.replace(/\.[^/.]+$/, ""))
							break;
						}
					}
				}
			}
			return null;
		},

		async checkMacroFiles(){
			const mfiles = await this.getFileList(this.macroDir);
			this.impactedMacros = [];
			let fc = 0;
			for(fc in mfiles){
				//Only check .g files excluding config.g as we have already tested this
				if(!mfiles[fc].isDirectory && !mfiles[fc].name.toLowerCase().includes('.bak')){
					//identified a .g file so load it and check contents for 
					let tmpFile = await this.loadMacroFile(mfiles[fc].name)
					let gc = 0;
					for(gc in this.uniqueRelNotesGCodes){
						if(tmpFile.toLowerCase().includes(this.uniqueRelNotesGCodes[gc].toLowerCase())){
							this.impactedMacros.push(mfiles[fc].name.replace(/\.[^/.]+$/, ""))
							break;
						}
					}
				}
			}
			return null;
		},
		
	},
	watch: {
		darkTheme(to) {
			this.$vuetify.theme.dark = to;
		},
		async macroDir() {
			this.impactedMacros = [];
			this.bFileClicked = false;
			if(!this.macroMode){
				await this.checkSysGFiles();
			}else{
				await this.checkMacroFiles();
			}
		},
		fileClicked(){
			if(this.fileClicked){this.checkClickedFile();}
		},
		macroMode(){
			this.fileClicked = null;
		}
	}
}
</script>