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
	.rMgrv-CarCard {
		min-height: calc(100vh - 340px);
		max-height: calc(100vh - 340px);
		flex-grow: 1;
		overflow-y: auto;
		overflow-x: hidden;
	}
	.rlMgrVchip {
		white-space: normal !important;
		height: auto !important;
		text-align: center !important; 
		min-height: 35px !important;
	}
</style>
<template>
	<v-card outlined elevation="3" class="rMgrv-cardRLM">
		<v-card-text class="fill-height">
			<v-carousel show-arrows-on-hover height="auto" continuous hide-delimiters>
				<v-carousel-item>
					<v-card flat class="rMgrv-CarCard">
						<v-row class="pa-2 ma-2 " justify="center" align="center">
							<v-card class="pa-2 ma-2" align="center" width="75%">
								<div v-html="tmpLang.notice" class="text-body-1" ></div>
								<v-row class="pa-2 ma-2 " justify="center" align="center">
									<v-chip class="rlMgrVchip red lighten-3 black--text">{{tmpLang.redTxt}}</v-chip>
									<v-chip class="rlMgrVchip blue lighten-4 black--text">{{tmpLang.blueTxt}}</v-chip>
									<v-chip class="rlMgrVchip purple lighten-4 black--text">{{tmpLang.purpleTxt}}</v-chip>
								</v-row>
								<div v-html="tmpLang.noticeFooter" class="text-body-1" ></div>
								<v-btn small @click="gotoForum()" class="info">{{tmpLang.noticeForum}}</v-btn>
							</v-card>
							<v-card class="pa-2 ma-2 mt-8" align="center" width="75%">
								<div v-html="tmpLang.guide" class="text-body-1" ></div>
							</v-card>
						</v-row>
					</v-card>
				</v-carousel-item>	
				<v-carousel-item v-for="(splash, i) in riJSON.splashes" :key="i">
					<v-card flat class="rMgrv-CarCard">
						<v-card-text>
							<v-row class="fill-height ma-2" align="center" justify="center" :key="i" >	
								<div v-html="processRIJSON(splash.mdTxt)"></div>
							</v-row>
						</v-card-text>
					</v-card>
				</v-carousel-item>
			</v-carousel>
		</v-card-text>
	</v-card>
</template>

<script lang="ts">

import Vue from "vue";
import { marked } from 'marked';
import * as tempENLang from './en';

export default Vue.extend({
	props: {
		riJSON: {
			type: Object
		}
    },
	computed: {
		tmpLang(){
			return tempENLang.tmpLangObj().plugin.ReleaseMgr;
		}
	},
	methods: {
		processRIJSON(mdStr: any){
				const tmpRelIMup = marked.parse(mdStr, {gfm : true, breaks: true});
				let RelIMup = tmpRelIMup;
				let arrMatchStr: any  = RelIMup.match(/<a[^>]*>(.*?)<\/a>/g);
				let i: any = 0;
				for(i in arrMatchStr){
					let tmpURLstr = arrMatchStr[i].match(/".*"/g);
					let URLstr = tmpURLstr[0].substring(1, tmpURLstr[0].length-1);
					let tmpAncStr = arrMatchStr[i].match(/>.*</g);
					let AncStr = tmpAncStr[0].substring(1, tmpAncStr[0].length-1);
					RelIMup = RelIMup.replace(arrMatchStr[i], `<a title="${URLstr}" onclick="window.open(this.title, '_blank')"  style="color: green">${AncStr}</a>`);
				}				
				return RelIMup;
		},

		gotoForum(){
			window.open('https://forum.duet3d.com/topic/27582', '_blank');
		},
		
	},
});
</script>
