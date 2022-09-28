<style scoped>
  .TUICardVars {
    flex-grow: 1;
    overflow-y: auto;
    overflow-x: hidden;
    max-height: 200px;
    min-height: 200px;
  }
  .TUICardDVars {
    overflow-y: auto;
    overflow-x: hidden;
    /* max-height: 98%; */
    /* max-width: 99%; */
  }
  .TUIButton:focus::before { opacity: 0 !important; }
  .TUIButton:hover::before { opacity: 0.08 !important; }
</style>
<template>
  <v-dialog v-model="internalShown" @keydown.escape="dismissed" persistent width="60vw" >
    <v-card class="TUICardDVars" height="40vh">
			<v-card-title>
				<v-row justify="center" class="mt-2">
					<v-chip color="info"><span class="headline">ReleaseMgr Settings</span></v-chip>
				</v-row>
			</v-card-title>
      <v-row dense class="pa-0 ma-0" justify="center">
        <v-col cols="12" >
          <v-tooltip bottom >
            <template v-slot:activator="{ on, attrs }">
              <v-row v-bind="attrs" v-on="on" dense class="pa-0 ma-0" justify="center">
                <v-switch v-model="sysData.checkOnLoad" :label="tmpLang.plugin.ReleaseMgr.switchGSCheckOnLoad"></v-switch>
              </v-row>
            </template>
            <span>{{ tmpLang.plugin.ReleaseMgr.switchGSCheckOnLoadHover }}</span>
          </v-tooltip>
        </v-col>
      </v-row>
      <v-row dense class="pa-0 ma-0" justify="center">
        <v-col cols="12" >
          <v-tooltip bottom >
            <template v-slot:activator="{ on, attrs }">
              <v-row v-bind="attrs" v-on="on" dense class="pa-0 ma-0" justify="center">
                <v-switch v-model="sysData.alertOnce" v-bind="attrs" v-on="on" :label="tmpLang.plugin.ReleaseMgr.switchGSAlertOnce"></v-switch>
              </v-row>
            </template>
					  <span>{{ tmpLang.plugin.ReleaseMgr.switchGSAlertOnceHover }}</span>
				  </v-tooltip>
        </v-col>
      </v-row>      
			<v-row class="pa-0 ma-0 mb-6" justify="center" align="center">
				<v-tooltip bottom >
					<template v-slot:activator="{ on, attrs }">
						<v-btn rounded medium class="mr-2" style="cursor: pointer" color="info" v-bind="attrs" v-on="on" @click="dismissed()">
							Save & Exit
						</v-btn>
					</template>
					<span>Save & Close Settings</span>
				</v-tooltip>				
			</v-row>
		</v-card>
	</v-dialog>
</template>

<script>
"use strict";

import tempENLang from './en.js';

export default {
  props: {
    shown: {
      type: Boolean,
      required: true,
    },
    sysData: Object
  },
  computed: {
    internalShown: {
      get() {
        return this.shown;
      },
      set(value) {
        if (value) {
          if (value == "save") {
            this.save();
          }
        } else {
          this.dismissed();
        }
      },
    },
    tmpLang(){
			return this.tmpLangObj();
		},
  },
  mixins: [
		tempENLang
	],
  methods: {
    save() {
      this.$emit("save");
      this.$emit("update:shown", false);
    },
    dismissed() {
      this.$emit("save");
      this.$emit("update:shown", false);
    }
  }
}
</script>
