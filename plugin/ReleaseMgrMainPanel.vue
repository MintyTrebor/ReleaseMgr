<style>
	.rlMgrVchip {
		white-space: normal !important;
		height: auto !important;
		text-align: center !important; 
		min-height: 35px !important;
	}
	.rMgrv-mainCardRLM {
		height: calc(100vh - 340px) !important;
	}
</style>
<template>
	<v-container fluid class=" pa-0 ma-0" >
		<v-card flat width="100%" class=" pa-0 ma-0">
			<div width="100%" class="mb-3">
				<v-row dense width="100%" :class="`${labelClass} ma-0 pa-0 pb-1`">
					<v-col cols="12" justify="start">
						<v-row dense width="100%" class=" pa-0 ma-0" justify="start">
							<v-chip color="info">{{tmpLang.plugin.ReleaseMgr.title}}</v-chip>
							<v-chip v-if="bHiddenTestData" color="red">Test Data Enabled</v-chip>
							<v-chip v-if="bHiddenDuetMenu" color="red">Duet Admin Enabled</v-chip>						
							<v-spacer></v-spacer>
							<v-chip class="rlMgrVchip" color="info" v-if="currView == 'duetRRFRN' || currView == 'duetRRFRI'">{{tmpLang.plugin.ReleaseMgr.headerDuet}}</v-chip>
							<v-chip class="rlMgrVchip" color="info" v-if="currView == 'gloomyRN' || currView == 'gloomyRI' || currView == 'gloomyESPRI'">{{tmpLang.plugin.ReleaseMgr.headerGloomy}}</v-chip>
							<v-chip class="rlMgrVchip" color="info" v-if="currView == 'duetSBCRN' || currView == 'duetSBCRI'">{{tmpLang.plugin.ReleaseMgr.headerSBC}}</v-chip>
							<v-chip class="rlMgrVchip" color="info" v-if="currView == 'duetDWCRN' || currView == 'duetDWCRI'">{{tmpLang.plugin.ReleaseMgr.headerDWC}}</v-chip>
							<v-spacer></v-spacer>
						</v-row>
					</v-col>
				</v-row>
				<v-row dense width="100%" class="ma-0 pa-0">
					<v-card width="100%" class="pa-0 ma-0">
						<v-card-text class="pa-0 ma-1" style="overflow: hidden !important;">
							<v-row dense class="pa-0 ma-0 mt-2" justify="center" align="start">
								<v-col dense class="pa-0 ma-0" justify="center" align="start" ccols="12"  xl="8" lg="8" md="12" sm="12" xs="12">
									<v-row dense class="pa-0 ma-0" justify="center" align="start">
										<v-col cols="4">
											<span><strong :class="labelClass">{{tmpLang.plugin.ReleaseMgr.currFWVer}}</strong> {{ fwVer }}</span>
										</v-col>
										<v-spacer></v-spacer>
										<v-col cols="4">
											<span><strong :class="labelClass">{{tmpLang.plugin.ReleaseMgr.currFWSrc}}</strong> {{ fwSrcFriendlyName }}</span>
										</v-col>
										<v-spacer></v-spacer>
										<v-col cols="2">
											<span><strong :class="labelClass">{{tmpLang.plugin.ReleaseMgr.currCBoard}}</strong></span>
										</v-col>
										<v-col cols="2" v-if="!bHiddenTestData">
											<span v-for="(boards, k) in conBoards" :key="k">{{ boards.name }}<span v-if="bIsSBC && k==0"> (+ SBC)</span><br></span>
										</v-col>
										<v-col cols="2" v-if="bHiddenTestData">
											<span v-for="(boards, k) in systemBoardSNames" :key="k">{{ boards.shortName }}<span v-if="bIsSBC && k==0"> (+ SBC)</span><br></span>
										</v-col>
										<v-spacer></v-spacer>
									</v-row>
								</v-col>
								<v-col dense class="pa-0 ma-0" justify="center" align="start" cols="12"  xl="4" lg="4" md="12" sm="12" xs="12">
									<v-row dense class="pa-0 ma-0" justify="start" align="start">
										<v-col cols="6" md="6" sm="6" xs="12">
											<span><v-switch class="pl-5 mt-n1" :label="tmpLang.plugin.ReleaseMgr.lblSWBetaRel" align="left" v-model="bShowPreRelease" @change="checkShowAllRel()"></v-switch></span>
										</v-col>
										<v-col cols="6" md="6" sm="6" xs="12">
											<span><v-switch class="mt-n1" v-if="bShowPreRelease" :label="tmpLang.plugin.ReleaseMgr.lblSWAllRel" align="left" v-model="bShowAllReleases"></v-switch></span>
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
										<v-col align="right">
											<v-tooltip top>
												<template v-slot:activator="{ on, attrs }">
												<v-btn small v-bind="attrs" color="info" class="pl-2 pr-1 ml-6" v-on="on" @click="bPageReload = !bPageReload"><v-icon>mdi-autorenew</v-icon></v-btn>
												</template>
												<span>{{tmpLang.plugin.ReleaseMgr.btnRefreshHover}}</span>
											</v-tooltip>
											<v-tooltip top>
												<template v-slot:activator="{ on, attrs }">
												<v-btn small v-bind="attrs" color="info" class="pr-2 ma-1 mr-6" v-on="on" @click="bShowEditGlobalSettingsDialog = true"><v-icon>mdi-cog</v-icon></v-btn>
												</template>
												<span>{{tmpLang.plugin.ReleaseMgr.btnSettingsHover}}</span>
											</v-tooltip>
										</v-col>
									</v-row>
								</v-col>
							</v-row>
						</v-card-text>
					</v-card>
				</v-row>
			</div>
			<!-- <v-row>
				JSON:{{allDuetReleasesJSON}}
			</v-row> -->
			<v-row class="pa-0 ma-0 " v-if="currView">
				<v-col cols="12" lg="8" md="8" class="mb-6">
					<v-container v-if="currView != 'duetAdmin'" fluid class="pa-0 ma-0">
						<DispRN v-if="currView == 'duetRRFRN'" :rnJSON="duetRNJSON" :rMgrData="relMgrData" :key="selectedDuetRelTag" :selectedTag="selectedDuetRelTag"></DispRN>
						<DispRI v-if="currView == 'duetRRFRI'" :riJSON="duetRIJSON" :key="selectedDuetRelTag" :selectedTag="selectedDuetRelTag" srcType="RRFRI"></DispRI>
						<DispRN v-if="currView == 'duetDWCRN'" :rnJSON="dwcRNJSON" :rMgrData="relMgrData" :key="selectedDuetRelTag" :selectedTag="selectedDuetRelTag"></DispRN>
						<DispRI v-if="currView == 'duetDWCRI'" :riJSON="dwcRIJSON" :key="selectedDuetRelTag" :selectedTag="selectedDuetRelTag" srcType="DWCRI"></DispRI>
						<DispRI v-if="currView == 'gloomyRN'" :riJSON="gloomyRNJSON" :key="selectedGloomyRelTag" :selectedTag="selectedGloomyRelTag" srcType="gloomyRN"></DispRI>
						<DispRI v-if="currView == 'gloomyRI'" :riJSON="gloomyRIJSON" :key="selectedGloomyRelTag" :selectedTag="selectedGloomyRelTag" srcType="gloomyRI"></DispRI>
						<DispRI v-if="currView == 'gloomyESPRI'" :riJSON="gloomyESPRIJSON" :key="selectedGloomyRelTag" :selectedTag="selectedGloomyRelTag" srcType="gloomyRI"></DispRI>
						<DispRN v-if="currView == 'duetSBCRN'" :rMgrData="relMgrData" :rnJSON="sbcRNJSON" :key="selectedDuetRelTag" :selectedTag="selectedDuetRelTag"></DispRN>
						<DispRI v-if="currView == 'duetSBCRI'" :riJSON="sbcRIJSON" :key="selectedDuetRelTag" :selectedTag="selectedDuetRelTag" srcType="DSFRI"></DispRI>
					</v-container>
					<v-container v-if="currView =='duetAdmin'" fluid class="pa-0 ma-0">
						<DispAdminRN :rnAdminJSON="duetAdminRNJSON" :rMgrData="relMgrData" :key="selectedDuetRelTag" :selectedTag="selectedDuetRelTag"></DispAdminRN>
					</v-container>
				</v-col>
				<v-col cols="12" lg="4" md="4">
					<v-row class="pa-0 ma-0 ">
						<v-container fluid class="pa-0 ma-0" v-if="!bIsSBC">
							<DispRNFiles v-if="currView == 'duetRRFRN' || currView == 'duetRRFRI' || currView == 'duetAdmin'" :riJSON="duetRIJSON" :key="selectedDuetRelTag" :selectedTag="selectedDuetRelTag" :bShowOverlay="bShowOverlay"></DispRNFiles>
							<DispRNFiles v-if="currView == 'duetDWCRN' || currView == 'duetDWCRI'" :riJSON="dwcRIJSON" :key="selectedDuetRelTag" :selectedTag="selectedDuetRelTag" :bShowOverlay="bShowOverlay"></DispRNFiles>
							<DispRNFiles v-if="currView == 'gloomyRN' || currView == 'gloomyRI'" :riJSON="gloomyRIJSON" :key="selectedGloomyRelTag" :selectedTag="selectedGloomyRelTag" :bShowOverlay="bShowOverlay"></DispRNFiles>
							<DispRNFiles v-if="currView == 'gloomyESPRI'" :riJSON="gloomyESPRIJSON" :key="selectedGloomyRelTag" :selectedTag="selectedGloomyRelTag" :bShowOverlay="bShowOverlay"></DispRNFiles>
						</v-container>
						<v-container fluid class="pa-0 ma-0" v-if="bIsSBC">
							<v-card outlined elevation="3" class="pa-0 ma-0">
								<v-card-text> 
									<v-row class="pa-2 ma-2 " justify="center" align="center" v-if="fwSrc == gitOwnerNameDuet">
										<span><a :title="dsfUpdateInsURL" @click="hlpLinkClick(dsfUpdateInsURL)"  style="color: green">{{tmpLang.plugin.ReleaseMgr.dsfUpdateInstructions}}</a></span>
									</v-row>
									<v-row class="pa-2 ma-2 " justify="center" align="center" v-if="fwSrc == gitOwnerNameGloomy">
										<span><a :title="gloomyUpdateInsURL1" @click="hlpLinkClick(gloomyUpdateInsURL1)"  style="color: green">{{tmpLang.plugin.ReleaseMgr.gloomyUpdateIns1}}</a></span>
									</v-row>
									<v-row class="pa-2 ma-2 " justify="center" align="center" v-if="fwSrc == gitOwnerNameGloomy">
										<span><a :title="gloomyUpdateInsURL2" @click="hlpLinkClick(gloomyUpdateInsURL2)"  style="color: green">{{tmpLang.plugin.ReleaseMgr.gloomyUpdateIns2}}</a></span>
									</v-row>
								</v-card-text>
							</v-card>
						</v-container>	
					</v-row>
					<v-row class="pa-2 ma-2 " justify="center" align="center" v-if="!bIsSBC">
						<v-chip large class="rlMgrVchip" color="info">{{ tmpLang.plugin.ReleaseMgr.fileDLNotice }}</v-chip>
					</v-row>
					<v-row class="pa-1 ma-1" v-if="bGotDuetRI" align="center">
						<v-col cols="1" md="1" lg="1" xl="1" sm="0" xs="0">
							<v-spacer></v-spacer>
						</v-col>
						<v-col cols="10" md="10" lg="10" xl="10" sm="12" xs="12">
							<v-row class="pa-0 ma-0" align="center">
								<v-chip large class="rlMgrVchip" color="info">{{ tmpLang.plugin.ReleaseMgr.switchDuetRN }}</v-chip>
								<v-spacer></v-spacer>
								<v-btn-toggle v-model="duetBtnGrp" shaped v-on:change="bSwitchDuetDisp()">
									<v-tooltip top>
										<template v-slot:activator="{ on, attrs }">
											<v-btn v-bind="attrs" v-on="on" :value="0" color="info">
												<v-icon>mdi-notebook</v-icon>
											</v-btn>
										</template>
										<span>{{ tmpLang.plugin.ReleaseMgr.switchDuetRNHover }}</span>
									</v-tooltip>
									<v-tooltip top>
										<template v-slot:activator="{ on, attrs }">
											<v-btn v-bind="attrs" v-on="on" :value="1" color="info">
												<v-icon>mdi-information</v-icon>
											</v-btn>
										</template>
										<span>{{ tmpLang.plugin.ReleaseMgr.switchDuetRIHover }}</span>
									</v-tooltip>
								</v-btn-toggle>
							</v-row>
						</v-col>
						<v-col cols="1" md="1" lg="1" xl="1" sm="0" xs="0">
							<v-spacer></v-spacer>
						</v-col>
					</v-row>
					<v-row class="pa-1 ma-1 " v-if="bGotDuetDWCRI" align="center">
						<v-col cols="1" md="1" lg="1" xl="1" sm="0" xs="0">
							<v-spacer></v-spacer>
						</v-col>
						<v-col cols="10" md="10" lg="10" xl="10" sm="12" xs="12">
							<v-row class="pa-0 ma-0" align="center">
								<v-chip large class="rlMgrVchip" color="info">{{ tmpLang.plugin.ReleaseMgr.switchDuetDWCRN }}</v-chip>
								<v-spacer></v-spacer>
								<v-btn-toggle v-model="DWCBtnGrp" shaped v-on:change="bSwitchDWCDisp()">
									<v-tooltip top>
										<template v-slot:activator="{ on, attrs }">
											<v-btn v-bind="attrs" v-on="on" :value="0" color="info">
												<v-icon>mdi-notebook</v-icon>
											</v-btn>
										</template>
										<span>{{ tmpLang.plugin.ReleaseMgr.switchDuetDWCRNHover }}</span>
									</v-tooltip>
									<v-tooltip top>
										<template v-slot:activator="{ on, attrs }">
											<v-btn v-bind="attrs" v-on="on" :value="1" color="info">
												<v-icon>mdi-information</v-icon>
											</v-btn>
										</template>
										<span>{{ tmpLang.plugin.ReleaseMgr.switchDuetDWCRIHover }}</span>
									</v-tooltip>
								</v-btn-toggle>
							</v-row>
						</v-col>
						<v-col cols="1" md="1" lg="1" xl="1" sm="0" xs="0">
							<v-spacer></v-spacer>
						</v-col>
					</v-row>
					<v-row class="pa-1 ma-1 " v-if="bGotGloomyRI" align="center">
						<v-col cols="1" md="0" lg="1" xl="1" sm="0" xs="0">
							<v-spacer></v-spacer>
						</v-col>
						<v-col cols="10" md="12" lg="10" xl="10" sm="12" xs="12">
							<v-row class="pa-0 ma-0" align="center">
								<v-chip large class="rlMgrVchip" color="info">{{ tmpLang.plugin.ReleaseMgr.switchGloomyRN }}</v-chip>
								<v-spacer></v-spacer>
								<v-btn-toggle v-model="gloomyBtnGrp" shaped v-on:change="bSwitchGloomyDisp()">
									<v-tooltip top>
										<template v-slot:activator="{ on, attrs }">
											<v-btn v-bind="attrs" v-on="on" :value="0" color="info">
												<v-icon>mdi-notebook</v-icon>
											</v-btn>
										</template>
										<span>{{ tmpLang.plugin.ReleaseMgr.switchGloomyRNHover }}</span>
									</v-tooltip>
									<v-tooltip top>
										<template v-slot:activator="{ on, attrs }">
											<v-btn v-bind="attrs" v-on="on" :value="1" color="info">
												<v-icon>mdi-information</v-icon>
											</v-btn>
										</template>
										<span>{{ tmpLang.plugin.ReleaseMgr.switchGloomyRIHover }}</span>
									</v-tooltip>
									<v-tooltip top>
										<template v-slot:activator="{ on, attrs }">
											<v-btn v-bind="attrs" v-on="on" :value="2" color="info">
												<v-icon>mdi-wifi</v-icon>
											</v-btn>
										</template>
										<span>{{ tmpLang.plugin.ReleaseMgr.switchGloomyESPRIHover }}</span>
									</v-tooltip>
								</v-btn-toggle>
							</v-row>
						</v-col>
						<v-col cols="1" md="0" lg="1" xl="1" sm="0" xs="0">
							<v-spacer></v-spacer>
						</v-col>
					</v-row>
					<v-row class="pa-1 ma-1 " v-if="bGotDuetSBCRI" align="center">
						<v-col cols="1" md="1" lg="1" xl="1" sm="0" xs="0">
							<v-spacer></v-spacer>
						</v-col>
						<v-col cols="10" md="10" lg="10" xl="10" sm="12" xs="12">
							<v-row class="pa-0 ma-0" align="center">
								<v-chip large class="rlMgrVchip" color="info">{{ tmpLang.plugin.ReleaseMgr.switchDuetSBCRN }}</v-chip>
								<v-spacer></v-spacer>
								<v-btn-toggle v-model="SBCBtnGrp" shaped v-on:change="bSwitchDuetSBCDisp()">
									<v-tooltip top>
										<template v-slot:activator="{ on, attrs }">
											<v-btn v-bind="attrs" v-on="on" :value="0" color="info">
												<v-icon>mdi-notebook</v-icon>
											</v-btn>
										</template>
										<span>{{ tmpLang.plugin.ReleaseMgr.switchDuetSBCRNHover }}</span>
									</v-tooltip>
									<v-tooltip top>
										<template v-slot:activator="{ on, attrs }">
											<v-btn v-bind="attrs" v-on="on" :value="1" color="info">
												<v-icon>mdi-information</v-icon>
											</v-btn>
										</template>
										<span>{{ tmpLang.plugin.ReleaseMgr.switchDuetSBCRIHover }}</span>
									</v-tooltip>
								</v-btn-toggle>
							</v-row>
						</v-col>
						<v-col cols="1" md="1" lg="1" xl="1" sm="0" xs="0">
							<v-spacer></v-spacer>
						</v-col>
					</v-row>
					<v-row class="pa-1 ma-1 " v-if="bHiddenDuetMenu && bGotDuetRI" align="center">
						<v-col cols="1" md="1" lg="1" xl="1" sm="0" xs="0">
							<v-spacer></v-spacer>
						</v-col>
						<v-col cols="10" md="10" lg="10" xl="10" sm="12" xs="12">
							<v-row class="pa-0 ma-0" align="center">
								<v-chip large class="rlMgrVchip mr-2" color="red">RN Assessment</v-chip>
								<v-spacer></v-spacer>
									<v-tooltip top>
										<template v-slot:activator="{ on, attrs }">
											<v-btn rounded v-bind="attrs" v-on="on" color="red" @click="bSwitchDuetAdminDisp()">
												<v-icon class="mr-2">mdi-notebook</v-icon> Assess
											</v-btn>
										</template>
										<span>Release Note Assessment</span>
									</v-tooltip>
								</v-row>
						</v-col>
						<v-col cols="1" md="1" lg="1" xl="1" sm="0" xs="0">
							<v-spacer></v-spacer>
						</v-col>
					</v-row>
				</v-col>
			</v-row>
			<v-row v-if="!bGotRelMgrData" class="pa-0 ma-0 " justify="center" align="center">
				<v-card class="pa-2 ma-2 mt-4" align="center" width="75%">
					<div style="color: red" class="text-h4" v-html="tmpLang.plugin.ReleaseMgr.connErr"></div>
				</v-card>
			</v-row>
			<v-row v-if="bGotRelMgrData && !bGotSplashJSON && !currView" class="pa-0 ma-0 " justify="center" align="center">
				<v-card class="pa-2 ma-2" align="center" width="75%">
					<div v-html="tmpLang.plugin.ReleaseMgr.notice" class="text-body-1" ></div>
					<v-row class="pa-2 ma-2 " justify="center" align="center">
						<v-chip class="rlMgrVchip red lighten-3 black--text">{{tmpLang.plugin.ReleaseMgr.redTxt}}</v-chip>
						<v-chip class="rlMgrVchip blue lighten-4 black--text">{{tmpLang.plugin.ReleaseMgr.blueTxt}}</v-chip>
						<v-chip class="rlMgrVchip purple lighten-4 black--text">{{tmpLang.plugin.ReleaseMgr.purpleTxt}}</v-chip>
					</v-row>
					<div v-html="tmpLang.plugin.ReleaseMgr.noticeFooter" class="text-body-1" ></div>
					<v-btn small @click="gotoForum()" class="info">{{tmpLang.plugin.ReleaseMgr.noticeForum}}</v-btn>
				</v-card>
				<v-card class="pa-2 ma-2 mt-8" align="center" width="75%">
					<div v-html="tmpLang.plugin.ReleaseMgr.guide" class="text-body-1" ></div>
				</v-card>
			</v-row>
			<v-row v-if="bGotRelMgrData && bGotSplashJSON && !currView" class="pa-0 ma-0 " justify="center" align="center">
				<v-container fluid class="pa-0 ma-0">
					<DispSplash :riJSON="splashJSON" class="fill-height"></DispSplash>
				</v-container>
			</v-row>
		</v-card>
		<editGlobalSettingsDialog :shown.sync="bShowEditGlobalSettingsDialog"  @save="callSaveSettings(relMgrSession)" :sysData="relMgrSession"></editGlobalSettingsDialog>
	</v-container>
</template>

<script lang="ts">

import Vue from "vue";
import store from "@/store";
import { isPrinting } from "@/utils/enums";
import { marked } from 'marked';
import * as tempENLang from './en';
import * as gitFunctions from'./gitFunctions';
import * as dataFunctions from './data'
import DispRN from './DispRN.vue';
import DispAdminRN from './DispAdminRN.vue';
import DispRI from './DispRI.vue';
import DispRNFiles from './DispRNFiles.vue';
import DispSplash from './DispSplash.vue';
import editGlobalSettingsDialog from './editGlobalSettingsDialog.vue';



export default Vue.extend({
	components: {
        DispRN,
		DispRI,
		DispRNFiles,
		DispAdminRN,
		DispSplash,
		editGlobalSettingsDialog,
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
		isPrinting(): boolean {
			return isPrinting(store.state.machine.model.state.status);
		},
		bIsSBC(): boolean {
			if(this.systemDSFVerStr !== null && this.systemDSFVerStr !== ''){
				return true;
			}else{
				return false;
			}
		},
		bShowOverlay(): boolean {
			if(this.fwSrc == this.gitOwnerNameGloomy && (this.currView == "duetRRFRN" || this.currView == "duetRRFRI")){
				return true;
			}else{
				return false;
			}
		},
		fwSrc(): string {
			if(typeof store.state.machine.model.boards[0] !== "undefined"){
				if(store.state.machine.model.boards[0].firmwareName.toLowerCase().includes('duet') || store.state.machine.model.boards[0].firmwareName == ""){
					return this.gitOwnerNameDuet; 
				}else {
					return this.gitOwnerNameGloomy;
				}
			}else{
				return "No Board Connected"
			}
		},
		fwSrcFriendlyName(): string {
			if(this.fwSrc == this.gitOwnerNameGloomy){
				return 'Team Gloomy';
			}else{
				return 'Official Duet 3D';
			}
		},
		fwVer(): string {
			let tmpVer = "";
			try{tmpVer = store.state.machine.model.boards[0].firmwareVersion;}
			catch{tmpVer = "Not Connected"}
			return tmpVer;
		},
		conBoard(): string {
			let tmpCB = "";
			try{tmpCB = store.state.machine.model.boards[0].name;}
			catch{tmpCB = "Not Connected"}
			return tmpCB;
		},
		conBoards(): any {
			let tmpCB: any = null;
			//tmpCB = [{name: "board1"}, {name: "board2"},{name: "Board etc"}]
			try{tmpCB = store.state.machine.model.boards;}
			catch{tmpCB = "Not Connected"}
			return tmpCB;
		},
		systemBoardSNames(): any {
			return this.relMgrData.testData;
		},
		bHiddenDuetMenu(): boolean {
			try{
				if(store.state.machine.model.global.has("releaseMgrDuet")){
					if(store.state.machine.model.global.get("releaseMgrDuet")){
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
		bHiddenTestData() : boolean{
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
		backCol(): any {
			if(this.darkTheme){
					return "background-color: #515151 !important;";
				}else{
					return "background-color: #f5f5f5 !important;";
			}
		},
		tmpLang(): any {
			return tempENLang.tmpLangObj();
		},
		labelClass(): string {
			return this.darkTheme ? 'grey--text darken-3' : 'blue--text lighten-5';
		},
		switchClass(): string {
			return this.darkTheme ? 'grey darken-3' : 'blue lighten-5';
		},
		duetFilteredTags():any {
			var j: any = 0;
			var tmpArr: any = [];
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
		gloomyFilteredTags(): any{
			var j: any = 0;
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
	data: function () {
		return {
			bPageReload: false,
			allDuetReleasesJSON: null as any,
			allSBCReleasesJSON: null as any,
			allGloomyReleasesJSON: null as any,
			allGloomyESPReleasesJSON: null as any,
			allDWCReleasesJSON: null as any,
			bGotAllSBCReleases: false,
			bGotAllDWCReleases: false,
			bGotSplashJSON: false,
			splashJSON: null as any,
			gitOwnerNameDuet: 'Duet3D',
			gitOwnerNameGloomy: 'gloomyandy',
			gitRepoNameDuet: "RepRapFirmware",
			gitSBCRepoNameDuet: "DuetSoftwareFramework",
			gitDWCRepoNameDuet: "DuetWebControl", 
			gitRepoNameGloomy: "RepRapFirmware",
			gitRepoNameGloomyESP: "DuetWiFiSocketServer",
			gitRelMgrRepoName: "ReleaseMgr",
			gitRelMgrOwnName: "MintyTrebor",
			gitRelMgrDataURL: "main/RelMgrData/RelMgrData.json",
			gitRelMgrSplashURL: "main/RelMgrData/splash/",
			dsfUpdateInsURL: "https://docs.duet3d.com/User_manual/Machine_configuration/DSF_RPi#installing-updates)",
			gloomyUpdateInsURL1: "https://teamgloomy.github.io/stm32_sbc.html",
			gloomyUpdateInsURL2: "https://teamgloomy.github.io/lpc_sbc.html",
			dsfUpdateInsHTML: null as any,
			gloomyUpdateInsHTML: null as any,
			relMgrData: {} as any,
			duetRNJSON: {} as any,
			duetRIJSON:{} as any,
			gloomyRIJSON: {} as any,
			gloomyESPRIJSON: {} as any,
			gloomyRNJSON: {} as any,
			sbcRIJSON: {} as any,
			sbcRNJSON: {} as any,
			dwcRIJSON: {} as any,
			dwcRNJSON: {} as any,
			duetAdminRNJSON: {} as any,
			duetBtnGrp: 0 as any,
			SBCBtnGrp: 0 as any,
			DWCBtnGrp: 0 as any,
			gloomyBtnGrp: 0 as any,
			bShowPreRelease: false,
			bShowAllReleases: false,
			gloomyRNFilters: [] as any,
			gloomyRNSections: []  as any,
			selectedDuetRelTag: null as any,
			selectedGloomyRelTag: null as any,
			bGotDuetRN: false,
			bGotDuetRI: false,
			bGotDuetSBCRI: false,
			bGotDuetSBCRN: false,
			bGotDuetDWCRI: false,
			bGotDuetDWCRN: false,
			bGotRelMgrData: false,
			bShowGloomyReleases: false,
			bGotGloomyRN: false,
			bGotGloomyRI: false,
			bGotGloomyESPRI: false,
			bCarouselCycle: true,			
			currDSFTag: null as any,
			currDWCTag: null as any,
			currView: null as any,
			bShowEditGlobalSettingsDialog: false,
			relMgrSession: dataFunctions.loadSettings()
		}
	},
	
	mounted(){
		//do an intial load
		dataFunctions.loadSettings()
		this.startUp();
	},

	activated(){
		const globcont = window.document.getElementById("global-container");
		if(globcont != null){
			globcont.hidden = true;
		}
	},

	deactivated(){
		const globcont = window.document.getElementById("global-container");
		if(globcont != null){
			globcont.hidden = false;
		}
	},

	created() {
		const globcont = window.document.getElementById("global-container");
		if(globcont != null){
			globcont.hidden = true;
		}
	},

    methods: {
		
		gotoForum(){
			window.open('https://forum.duet3d.com/topic/27582', '_blank');
		},

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
					const getGloomyESPReleases = await this.getAllReleasesJSON(this.gitOwnerNameGloomy, this.gitRepoNameGloomyESP).then(response => response);
					this.allGloomyESPReleasesJSON = await getGloomyESPReleases;
				}
				if(!this.bGotSplashJSON){
					const getSplashes = await gitFunctions.getByGitFileRaw(`${this.gitRelMgrSplashURL}splash.json`, this.gitRelMgrOwnName, this.gitRelMgrRepoName).then(res => res);
					this.splashJSON = await getSplashes;
					if(this.splashJSON){
						this.bGotSplashJSON = await this.configSplash();
					}
				}
			}else{
				//probably do alert here
			}

		},

		callSaveSettings(settingsObject: any){
			dataFunctions.saveSettings(settingsObject);
		},

		async configSplash(){
			let i: any = 0;
			for(i in this.splashJSON.splashes){
				const getMDTxt = await gitFunctions.getByGitFileRaw(`${this.gitRelMgrSplashURL}${this.splashJSON.splashes[i].file}`, this.gitRelMgrOwnName, this.gitRelMgrRepoName).then(res => res);
				this.splashJSON.splashes[i].mdTxt = await getMDTxt;
			}
			//console.log(this.splashJSON.splashes)
			return true;
		},	

		async getRelMgrData(){
			//critical function - this is the data used to sort the release notes. If not retreived do not continue to process
			const getRelMgrData = await gitFunctions.getByGitFileRaw(this.gitRelMgrDataURL, this.gitRelMgrOwnName, this.gitRelMgrRepoName).then(res => res);
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

		async selectedDuetTag(tmpTag: any){
			this.bGotDuetRN = false;
			this.bGotDuetRI = false;
			this.duetRNJSON = {};
			this.duetRIJSON = {body: ""};
			const getRelJSON  = await this.getReleaseNotes(this.gitOwnerNameDuet, this.gitRepoNameDuet, tmpTag).then(response => response);
			this.duetRNJSON = await getRelJSON;
			this.duetAdminRNJSON = JSON.parse(JSON.stringify(this.duetRNJSON));
			this.duetRIJSON = this.allDuetReleasesJSON.filter((item: { tag_name: string; }) => (item.tag_name == tmpTag))
			if(this.duetRIJSON.length > 0){
				this.duetRIJSON = this.duetRIJSON[0];//don't need the array 
				this.bGotDuetRI = true;
			}
			//get DWC Release Details
			this.bGotDuetDWCRN = false;
			this.bGotDuetDWCRI = false;
			this.dwcRNJSON = false;
			this.dwcRIJSON = {body: ""};
			//MUST GET RI FIRST!!
			this.dwcRIJSON = await this.getDuetSBCDWCRI(tmpTag, this.gitDWCRepoNameDuet).then(res => res).then(res => res);
			//check if RI was found
			if(this.dwcRIJSON.length > 0){
				this.dwcRIJSON = this.dwcRIJSON[0];//don't need the array 
				const getDWCRelJSON  = await this.getReleaseNotes(this.gitOwnerNameDuet, this.gitDWCRepoNameDuet, tmpTag).then(response => response);
				this.dwcRNJSON = await getDWCRelJSON;
				if(this.bIsSBC){
					//SBC is in use so get the SBC RI & RN info also ---- MUST GET RI FIRST!!
					this.bGotDuetSBCRN = false;
					this.bGotDuetSBCRI = false;
					this.sbcRNJSON = {};
					this.sbcRIJSON = {body: ""};
					this.sbcRIJSON = await this.getDuetSBCDWCRI(tmpTag, this.gitSBCRepoNameDuet).then(res => res).then(res => res);
					this.sbcRIJSON = this.sbcRIJSON[0];//don't need the array 
					const getSBCRelJSON = await this.getReleaseNotes(this.gitOwnerNameDuet, this.gitSBCRepoNameDuet, tmpTag).then(response => response);
					this.sbcRNJSON = await getSBCRelJSON;
					this.dsfUpdateInsHTML = `<span><a :title="${this.dsfUpdateInsURL}" @click="hlpLinkClick(this.dsfUpdateInsURL)"  style="color: green">Click here to view DSF update instructions</a></span>`;
				}
			}else{
				//no matching DWC found so there is probably an issue with github or the release has not yet been posted

			}
		},

		async selectedGloomyTag(tmpTag: string){
			this.bGotGloomyRN = false;
			this.bGotGloomyRI = false;
			this.bGotGloomyESPRI = false;
			this.currView = null
			this.doGloomyRelease(tmpTag);
		},

		resetAll(){
			this.bGotDuetRN = false;
			this.bGotDuetRI = false;
			this.bGotDuetSBCRN = false;
			this.bGotDuetSBCRI = false;
			this.bGotGloomyRN = false;
			this.bGotGloomyRI = false;
			this.bGotGloomyESPRI = false;
			this.selectedDuetRelTag = null;
			this.selectedGloomyRelTag = null;
			this.bGotDuetDWCRI = false;
			this.bGotDuetDWCRN = false;
			this.currView = null;
		},

		bSwitchDuetDisp(){
			this.currView = null;
			this.DWCBtnGrp = null;
			this.gloomyBtnGrp = null;
			this.SBCBtnGrp = null;
			if(this.duetBtnGrp == 1){
				this.currView = "duetRRFRI";
			}else if(this.duetBtnGrp == 0){
				this.currView = "duetRRFRN";
			}
		},

		bSwitchDWCDisp(){
			this.currView = null;
			this.gloomyBtnGrp = null;
			this.duetBtnGrp = null;
			this.SBCBtnGrp = null;
			if(this.DWCBtnGrp == 1){
				this.currView = "duetDWCRI";
			}else if(this.DWCBtnGrp == 0){
				this.currView = "duetDWCRN";
			}
		},

		bSwitchGloomyDisp(){
			this.currView = null;
			this.DWCBtnGrp = null;
			this.duetBtnGrp = null;
			this.SBCBtnGrp = null;
			if(this.gloomyBtnGrp == 2){
				this.currView = "gloomyESPRI";
			}else if(this.gloomyBtnGrp == 1){
				this.currView = "gloomyRI";
			}else if(this.gloomyBtnGrp == 0){
				this.currView = "gloomyRN";
			}
		},

		bSwitchDuetSBCDisp(){
			this.currView = null;
			this.DWCBtnGrp = null;
			this.gloomyBtnGrp = null;
			this.duetBtnGrp = null;
			if(this.SBCBtnGrp == 1){
				this.currView = "duetSBCRI";
			}else if(this.SBCBtnGrp == 0){
				this.currView = "duetSBCRN";
			}
		},

		bSwitchDuetAdminDisp(){
			this.currView = null;
			this.DWCBtnGrp = null;
			this.gloomyBtnGrp = null;
			this.duetBtnGrp = null;
			this.SBCBtnGrp = null;
			this.currView = "duetAdmin";
		},

		checkShowAllRel(){
			if(!this.bShowPreRelease){this.bShowAllReleases = false}
		},

		async doGloomyRelease(tmpTag: string){
			this.gloomyRIJSON = {body: ""};
			this.gloomyRNJSON = {body: ""};
			this.gloomyRIJSON = this.allGloomyReleasesJSON.filter((item: { tag_name: string; }) => (item.tag_name == tmpTag));
			this.gloomyRIJSON = this.gloomyRIJSON[0];
			//get the release notes links from the release body
			let hrefArr = this.gloomyRIJSON.body.match(/https:.*WHATS_NEW_UNIFIED.md/g);
			let tmpStr = hrefArr[0];
			tmpStr = tmpStr.replace("https://github.com/gloomyandy/RepRapFirmware/blob/", "");
			const relJSONGet = await gitFunctions.getByGitFileRaw(tmpStr, this.gitOwnerNameGloomy, this.gitRepoNameGloomy).then(res => res);
			const tmpTxt = await relJSONGet;
			//get the esp release tag and then get the RI
			hrefArr = this.gloomyRIJSON.body.match(/\(https:\/\/github.com\/gloomyandy\/DuetWiFiSocketServer\/releases\/tag\/(v|V).*\d\)/g);
			if(hrefArr){
				hrefArr = hrefArr[0].match(/(v|V)\d.*\d/g)
				tmpStr = hrefArr[0];
				if(tmpStr){
					this.gloomyESPRIJSON = this.allGloomyESPReleasesJSON.filter((item: { tag_name: string; }) => (item.tag_name == tmpStr));
					this.gloomyESPRIJSON = this.gloomyESPRIJSON[0]
					this.bGotGloomyESPRI = true;
				}
			}
			this.gloomyRNJSON = {body: tmpTxt};
			this.bGotGloomyRN = true;
			this.bGotGloomyRI = true;
			this.gloomyBtnGrp = 1;
			this.bSwitchGloomyDisp();
		},

		async getAllReleasesJSON(gitUName: string, gitRepoName: string){
			//Get the all releases in JSON object
			if(gitUName && gitRepoName){
				const relJSONGet = await gitFunctions.getByGitAPI('releases', gitUName, gitRepoName);
				const relJSON = await relJSONGet;
				if(relJSON){
					//re-order by date release published
					var relJSONFiltered = relJSON.sort((a: any, b: any) => (a.published_at < b.published_at) ? 1 : -1)
					if(gitUName == this.gitOwnerNameDuet && gitRepoName == this.gitRepoNameDuet){
						//remove some allways unwanted items for Duet Releases (nothing pre 3.2 and anything beginning with 'v')
						relJSONFiltered = relJSON.filter((item: { tag_name: string; }) => (item.tag_name >= "3.3" && !(item.tag_name.charAt(0)=='v')));
						//pruning based on release date and type of release eg if full release remove all ref's to betas & RC's before it was released etc
						//var allFullReleasesJSON = relJSONFiltered.filter(item => (item.prerelease == false));
						//relJSONFiltered = relJSONFiltered.filter(item => (item.published_at <= allFullReleasesJSON[0].published_at && item.prerelease == false) || (item.published_at >= allFullReleasesJSON[0].published_at));
					}
					if(gitUName == this.gitOwnerNameDuet && gitRepoName == this.gitDWCRepoNameDuet){
						//no need to do any filtering just return full JSON for DWC
						return relJSON;
					}
					if(gitUName == this.gitOwnerNameGloomy && gitRepoName == this.gitRepoNameGloomy){
						//process gloomy releses if required
						relJSONFiltered = relJSONFiltered.filter((item: { tag_name: string; }) => (item.tag_name >= "v3.3"));
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

		async getReleaseNotes(gitUName: string, gitRepoName: string, gitTagName:string){
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
						
					}if(gitRepoName == this.gitDWCRepoNameDuet){
						//Standard Config
						if(gitTagName.toLowerCase().includes('beta')){
							tmpFName = `Changelog-DWC-${majorVNumStr}.x-Beta.md`;
							rnType = "Beta"
						}
						else if(gitTagName.toLowerCase().includes('rc')){
							tmpFName = `Changelog-DWC-${majorVNumStr}.x-RC.md`;
							rnType = "RC"
						}else{
							tmpFName = `Changelog-DWC-${majorVNumStr}.x.md`;
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
					const relJSONGet = await gitFunctions.getByGitWikiRaw(tmpFName, gitUName, gitRepoName);
					const relText = await relJSONGet;
					if(await relText){
						if(gitRepoName == this.gitRepoNameDuet){
							let conv = this.convertRNtoJSON(relText, rnType, gitUName, gitTagName, gitRepoName);
							//always show the duet rn when fetched
							this.bGotDuetRN = true;
							this.duetBtnGrp = 0;
							this.bSwitchDuetDisp();
							return conv;
						}
						if(gitRepoName == this.gitDWCRepoNameDuet){
							let conv = this.convertRNtoJSON(relText, rnType, gitUName, this.currDWCTag, gitRepoName);
							//always show the duet rn when fetched
							this.bGotDuetDWCRN = true;
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

		hlpLinkClick(tmpURL: string){
			window.open(tmpURL, '_blank');
		},

		async getDuetSBCDWCRI(tmpTag: string, gitRepoName: string){
			//first we have to re-configure the tag to match DSF tagging structure
			//console.log("tmpTag:", tmpTag)
			let majorVNumStr: string = tmpTag.substr(0,1);
			let minorVNumStr = tmpTag.substr(2,1);
			let subVNumStr = "0";
			let prefix = "";
			let prefix2 = "";
			let suffix = "";
			let tmpBetaNumber = 0;
			if(tmpTag.length > 3){
				subVNumStr = tmpTag.substr(4,1);
				prefix = `${majorVNumStr}.${minorVNumStr}.${subVNumStr}`;
			}else{
				prefix = `${majorVNumStr}.${minorVNumStr}`;
			}
			//prefix = `${majorVNumStr}.${minorVNumStr}`;
			prefix2 = `${majorVNumStr}.${minorVNumStr}.${subVNumStr}`;
			//console.log("prefix:", prefix)
			//console.log("prefix2:", prefix2)
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
			//console.log("dsfTag:", dsfTag)
			if(gitRepoName == this.gitDWCRepoNameDuet){
				//DWC
				if(!this.bGotAllDWCReleases){
					//only get the sbc release info if we have not already done so
					const riJSONGet = await gitFunctions.getByGitAPI('releases', this.gitOwnerNameDuet, this.gitDWCRepoNameDuet);
					this.allDWCReleasesJSON = await riJSONGet;
					this.bGotAllDWCReleases = true;
				}			
				//check if the tag is there
				let currRIDWC = this.allDWCReleasesJSON.filter((item: { tag_name: string; }) => item.tag_name == dsfTag)
				if(currRIDWC.length == 0){
					//this tag was not found try a different format because the formatting is variable
					let dsfTag = `v${prefix2}${suffix}`;
					currRIDWC = this.allDWCReleasesJSON.filter((item: { tag_name: string; }) => item.tag_name == dsfTag)
				}
				if(currRIDWC.length > 0){
					this.bGotDuetDWCRI = true;
					//need this as apparently its not possible to be conistent across the release tags
					this.currDWCTag = dsfTag;
					return currRIDWC;
				}else{
					return [];
				}
			}else{
				//SBC
				if(!this.bGotAllSBCReleases){
					//only get the sbc release info if we have not already done so
					const riJSONGet = await gitFunctions.getByGitAPI('releases', this.gitOwnerNameDuet, this.gitSBCRepoNameDuet);
					this.allSBCReleasesJSON = await riJSONGet;
					this.bGotAllSBCReleases = true;
				}			
				//check if the tag is there
				let currRISBC = this.allSBCReleasesJSON.filter((item: { tag_name: string; }) => item.tag_name == dsfTag)
				if(currRISBC.length == 0){
					//this tag was not found try a different format because the formatting is variable
					let dsfTag = `v${prefix2}${suffix}`;
					currRISBC = this.allSBCReleasesJSON.filter((item: { tag_name: string; }) => item.tag_name == dsfTag)
				}
				if(currRISBC.length > 0){
					this.bGotDuetSBCRI = true;
					//need this as apparently its not possible to be conistent across the release tags
					this.currDSFTag = dsfTag;
					return currRISBC;
				}else{
					return [];
				}
			}

		},

		doFormatBold(str: string){
			//replace strings matching **some text** with <strong>some text</strong>
			var newstr = str.replace(/\*{2}(.*?)\*{2}/g, `<strong>$1</strong>`);
			if(newstr){
				return newstr;
			}else{
				return str;
			}
		},

		doFormatLink(str: string){
			//replace all the hyperlinks so they open in a new window
			var strArr: any = str.match(/(?<!!)\[{1}(.*?)\]{1}\(http(.*?)\)/g);
			var i: any = 0;
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

		doReplaceGloomyWNLinks(str: string){
			//replaces a specific link -- might not be needed
			var newstr = str.replace(/https:\/\/github.com\/gloomyandy\/RepRapFirmware\/blob\/WHATS_NEW_UNIFIED.md/g, `https://raw.githubusercontent.com/gloomyandy/RepRapFirmware/WHATS_NEW_UNIFIED.md`);
			return newstr;
		},

		convertRNtoJSON(rnRawMD: any, strType: string, gitUName: string, gitTagName: string, gitRepoName: string){
			//convert the release notes md file to structured json
			//strType = Beta, RC, Full
			//console.log(rnRawMD)
			if(rnRawMD && strType && gitUName && gitTagName){
				//first do some non conditional formatting as its easier to do here
				rnRawMD = this.doFormatBold(rnRawMD);
				rnRawMD = this.doFormatLink(rnRawMD);
				//second breakup md by new line in JSON
				var rnArray: any = rnRawMD.split(/\r?\n/);
				var i: any = 0;
				var rnJSON: any = {lines: []};
				for(i in rnArray){
					rnJSON.lines.push({line: rnArray[i]});
				}
				rnJSON.lines = rnJSON.lines.filter((item: { line: string; }) => (item.line !== "")); //allways remove empty lines
				//filter out unwanted Duet stuff
				var t: any =0;
				for(t in this.relMgrData.duetRNFilters){
					rnJSON.lines = rnJSON.lines.filter((item: { line: string; }) => (!item.line.toLowerCase().includes(this.relMgrData.duetRNFilters[t])));
				}
				//filter out any remaining ==== lines
				rnJSON.lines = rnJSON.lines.filter((item: { line: string; }) => (!item.line.toLowerCase().includes("====")));
				const newRNJSON: any = {releases: [], relType: strType, selTag: gitTagName, gUName: gitUName, class: "rn", gRName: gitRepoName};
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
					}else if(rnJSON.lines[i].line.slice(-1) === ":" && rnJSON.lines[i].line.charAt(0) !== "-"){
						//this is a section
						var c: any = 0;
						for(c in newRNJSON.releases){
							if(newRNJSON.releases[c].release == currRelStr){
								newRNJSON.releases[c].sections.push({section: rnJSON.lines[i].line, lines: [], color: "", hover: "", hwMatch: false, confGMatch: false, fileMatch: false});
								currSecStr = rnJSON.lines[i].line;
							}
						}					
					}else{
						//this is section content
						var d: any = 0;
						var e: any = 0;
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
				var f: any = 0;
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
		}
	}
});
</script>