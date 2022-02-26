<style>
	.rMgrv-cardRLM {
		display: flex !important;
		flex-direction: column;
		height: calc(100vh - 300px);
	}

	.rMgrv-mainCardRLM {
		height: calc(100vh - 240px);
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
	<v-card outlined elevation="3" class="rMgrv-cardRLM pa-0 ma-0">
		<!-- {{riJSON}} -->
		<v-card-title>
			{{riJSON.name}}
		</v-card-title>
		<v-card-text class="rMgrv-cardRLM__text">
			<div v-html="panelHTML"></div>
		</v-card-text>
	</v-card>
</template>

<script>
'use strict'

import { mapGetters, mapState, mapActions, mapMutations } from 'vuex';
import { marked } from 'marked';
import tempENLang from './en.js';

export default {
	props: {
		riJSON: {
			type: Object
		},
		selectedTag: String,
		srcType: String
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
			panelHTML: ""			
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
			if(this.riJSON){
				this.processRIJSON();
			}
		}, 

		processRIJSON(){
			if(this.srcType == "gloomyRN"){
				let markdown = this.riJSON.body.replace(/\n(?=\n)/g, "\n\n<br/>\n")
				const tmpRelIMup = marked.parse(markdown, {gfm : true, breaks: true});
				let hrefArr = tmpRelIMup.match(/<\s*a[^>]*/g);
				this.panelHTML = tmpRelIMup;
				let cn=0;
				for(cn in hrefArr){
					let tmpTxt = hrefArr[cn].replace("href", "title");
					this.panelHTML = this.panelHTML.replace(hrefArr[cn], tmpTxt + ` onclick="window.open(this.title, '_blank')"  style="color: green"`);
				}
			}else{
				const tmpRelIMup = marked.parse(this.riJSON.body, {gfm : true, breaks: true});
				let hrefArr = tmpRelIMup.match(/<\s*a[^>]*/g);
				this.panelHTML = tmpRelIMup;
				let cn=0;
				for(cn in hrefArr){
					let tmpTxt = hrefArr[cn].replace("href", "title");
					this.panelHTML = this.panelHTML.replace(hrefArr[cn], tmpTxt + ` onclick="window.open(this.title, '_blank')"  style="color: green"`);
				}
			}
			
		}
		
	},
	watch: {
		selectedTag() {
			this.startUp();
		},
		riJSON(){
			this.startUp();
		},
		darkTheme(){
			this.startUp();
		}
	}
}
</script>
