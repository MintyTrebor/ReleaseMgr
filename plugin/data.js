export default {
    methods: {
        newFullData() {
            return {
                checkOnLoad: false,
                lastVersion: null,
                alertOnce: true
            }
        },
        saveSettings() {
            console.log("saving")
            localStorage.setItem('releaseMgrSettings', JSON.stringify(this.relMgrSession));
		},
		loadSettings() {
			var tmpString = localStorage.getItem('releaseMgrSettings');
            if(tmpString) {
                this.relMgrSession = JSON.parse(tmpString);
            } else {
                this.resetSettings();
			}
		},
        resetSettings(){
			this.relMgrSession = this.newFullData();
			this.saveSettings();			
		},
    }
}