<style>
	.rMgrv-cardRNFiles {
		display: flex !important;
		flex-direction: column;
		height: calc((100vh - 340px)/2);
	}

	.rMgrv-mainCardRLM {
		height: calc(100vh - 240px);
	}

	.rMgrv-cardRNFiles__text {
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
	<v-card outlined elevation="3" class="rMgrv-cardRNFiles pa-0 ma-0">
		<v-card-title>
			{{riJSON.name}} Files
		</v-card-title>
		<v-card-text class="rMgrv-cardRNFiles__text">
			<v-overlay :absolute="true" :opacity="0.5" :value="bSOvrlay" align="center" justify="center" >
				<v-chip>{{tmpLang.filesNotAvail}}</v-chip>
				<v-btn rounded medium class="mr-2" style="cursor: pointer" color="info" @click="bSOvrlay = !bSOvrlay">
					{{tmpLang.filesNotAvail2}}
				</v-btn>
			</v-overlay>
			<span v-for="(fileLink, i) in riJSON.assets" :key="i">
				<span><a :title="fileLink.browser_download_url" @click="assetClick(fileLink.browser_download_url)"  style="color: green">{{fileLink.name}}</a></span><br>
			</span>			
		</v-card-text>
	</v-card>
</template>

<script lang="ts">

import Vue from "vue";
import store from "@/store";
import { isPrinting } from "@/utils/enums";
import * as tempENLang from './en';

export default Vue.extend({
	props: {
		riJSON: {
			type: Object
		},
		selectedTag: String,
		bShowOverlay: Boolean
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
		isPrinting(): boolean {
			return isPrinting(store.state.machine.model.state.status);
		},		
	},

	data () {
		return {
			bExpRel: [[0]] as any,
			bExpSec: [[0]] as any,
			currBSN: null,
			panelJSON: {releases:[]} as any,
			gitOwnerNameDuet: 'Duet3D',
			gitOwnerNameGloomy: 'gloomyandy',
			panelHTML: "",
			bSOvrlay: false			
		}
	},

	mounted(){
		this.startUp();
	},

	methods: {
		startUp(){
			this.bSOvrlay = this.bShowOverlay;
		}, 

		assetClick(tmpURL: string){
			window.open(tmpURL, '_blank');
		},
		
	}
});
</script>
