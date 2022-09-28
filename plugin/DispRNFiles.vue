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
	<v-card outlined elevation="3" class=" rMgrv-cardRNFiles pa-0 ma-0">
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

<script>
'use strict'

import { mapGetters, mapState, mapActions, mapMutations } from 'vuex';
import tempENLang from './en.js';

export default {
	props: {
		riJSON: {
			type: Object
		},
		selectedTag: String,
		bShowOverlay: Boolean
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
			return this.tmpLangObj().boards;
		},			
	},

	data () {
		return {
			bExpRel: [[0]],
			bExpSec: [[0]],
			currBSN: null,
			panelJSON: {releases:[]},
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
		...mapActions('machine', ['sendCode']),
		...mapActions('machine', {machineDownload: 'download', getFileList: 'getFileList'}),
        ...mapActions('machine', ['upload']),
		...mapMutations('machine/settings', ['addCode', 'removeCode']),
		
		startUp(){
			this.bSOvrlay = this.bShowOverlay;
		}, 

		assetClick(tmpURL){
			window.open(tmpURL, '_blank');
		},
		
	},
	watch: {
		// selectedTag() {
		// 	this.startUp();
		// },
		// riJSON(){
		// 	this.startUp();
		// },
		// darkTheme(){
		// 	this.startUp();
		// }
	}
}
</script>
