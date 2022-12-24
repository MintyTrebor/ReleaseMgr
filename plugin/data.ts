export function newFullData() {
    return {
        checkOnLoad: true,
        lastVersion: null,
        alertOnce: true
    }
}

export function saveSettings(RMgrJSON: any) {
    //console.log("saving")
    localStorage.setItem('releaseMgrSettings', JSON.stringify(RMgrJSON));
}

export function loadSettings() {
    var tmpString = localStorage.getItem('releaseMgrSettings');
    if(tmpString) {
        return JSON.parse(tmpString);
    } else {
        return newFullData();
    }
} 
