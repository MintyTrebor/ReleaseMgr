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

<script lang="ts">

import Vue from "vue";
import store from "@/store";
import { marked } from 'marked';


export default Vue.extend({
	props: {
		riJSON: {
			type: Object
		},
		selectedTag: String,
		srcType: String
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
			panelHTML: "" as any			
		}
	},

	mounted(){
		this.startUp();
	},

	methods: {
		startUp(){
			if(this.riJSON){
				this.processRIJSON();
			}
		}, 

		processRIJSON(){
			if(this.srcType == "gloomyRN"){
				let markdown = this.riJSON.body.replace(/\n(?=\n)/g, "\n\n<br/>\n")
				const tmpRelIMup: any = marked.parse(markdown, {gfm : true, breaks: true});
				let hrefArr: any = tmpRelIMup.match(/<\s*a[^>]*/g);
				this.panelHTML = tmpRelIMup;
				let cn: any = 0;
				for(cn in hrefArr){
					let tmpTxt = hrefArr[cn].replace("href", "title");
					this.panelHTML = this.panelHTML.replace(hrefArr[cn], tmpTxt + ` onclick="window.open(this.title, '_blank')"  style="color: green"`);
				}
			}else{
				const tmpRelIMup: any = marked.parse(this.riJSON.body, {gfm : true, breaks: true});
				let hrefArr: any = tmpRelIMup.match(/<\s*a[^>]*/g);
				this.panelHTML = tmpRelIMup;
				let cn: any = 0;
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
});
</script>
