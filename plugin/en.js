export default {
    methods: {
        tmpLangObj() {
                return { 
                    plugin: {
                        ReleaseMgr: {
                            name: 'ReleaseMgr',
                            configAssTitle: 'Config.g Assessment',
                            configAssGcodeMatchState: 'These codes in config.g are also mentioned in the release notes for ',
                            configAssGcodeNoMatchState: 'Your config.g file does not contain any of the codes included in the release notes.',
                            fileBrowserFileClickedP1: 'These codes in  ',
                            fileBrowserFileClickedP2: ' are also mentioned in the release notes for ',
                            fileBrowserFootor1: 'Files with red icon contain G-Code(s) that are included in the release notes. ',
                            fileBrowserFootor2: 'Click the file for more details.',
                            fileBrowserMacroMode: 'Switch View to SYS files',
                            fileBrowserSysMode: 'Switch View to Macro files',
                            switchDuetRN: 'Duet Release',
                            switchGloomyRN: 'Gloomy Release',
                            switchDuetSBCRN: 'SBC Release',
                            switchDuetRNHover: 'Switch View to Duet Release Notes',
                            switchDuetRIHover: 'Switch View to Duet Release Info',
                            switchGloomyRNHover: 'Switch View to Gloomy Release Notes',
                            switchGloomyRIHover: 'Switch View to Gloomy Release Info',
                            switchDuetSBCRNHover: 'Switch View to Duet SBC Release Notes',
                            switchDuetSBCRIHover: 'Switch View to Duet SBC Release Info',
                            releaseAssetsHeader: 'Release Assets available for download',
                            lineMatchedConfG: 'Your Config.g contains the g-code(s) highlighted in this change',
                            shortNMatchedHW: 'Your HW configuration may be impacted by this change',
                            gcodeMatchConfG: 'This code is included in your Config.g file',
                            gcodeMatchFile: 'This code is included in the selected file',
                            gcodeMatchConfGSection: 'This section contains changes which indicates an impact to your Config.g',
                            HWMatchHWSection: 'This section contains changes which indicates an impact to your HW configuration',
                            BothMatchSection: 'This section contains changes which indicates an impact to both your Config.g & HW configuration',
                            gcodeMatchConfGRN: 'This Release Note contains changes which indicates an impact to your Config.g',
                            HWMatchHWRN: 'This Release Note contains changes which indicates an impact to your HW configuration',
                            BothMatchRN: 'This Release Note contains changes which indicates an impact to both your Config.g & HW configuration',
                            headerDuet: 'Currently Viewing Duet Release Details',
                            headerSBC: 'Currently Viewing Duet SBC Release Details',
                            headerGloomy: 'Currently Viewing Gloomy Release Details',
                            title: 'ReleaseMgr',
                            currFWVer: 'Current Firmware Version :',
                            currFWSrc: 'Firmware Source :',
                            currCBoard: 'Control Board(s) :',
                            btnRefreshHover: 'Refresh Data',
                            lblSelGloomyRel: 'Select Team Gloomy Release',
                            lblSelDuetRel: 'Select Duet Release',
                            lblSWAllRel: 'All Releases',
                            lblSWBetaRel: 'Beta Releases',
                            notice: '<strong>ReleaseMgr</strong> is your wingman for firmware updating.<br><br><strong>ReleaseMgr</strong> attempts to identify information in the Duet release notes that may impact your current configuration, by matching information in your <strong>config.g</strong> and hardware setup:<br><br><span class="red lighten-1">Red highlighting indicates G-codes matched in your config.g</span><br><span class="blue lighten-4">Blue highlighting indicates hardware matched in your setup</span><br><span class="purple lighten-4">Purple highlighting indicates a combination of both</span><br><br>All information is indicative<br>You should not solely rely on ReleaseMgr for evaluating the impact of updating your current firmware/software.',
                            guide: '<strong>All release notes should be read in full before updating!<br/>You are fully responsible for the consequences of updating your firmware.<br></strong>Superceeded Beta and RC firmware versions are not generally supported, and using them is at your own risk.',
                            noticeDark: '<strong>ReleaseMgr</strong> is your wingman in the firmware updating process.<br><br><strong>ReleaseMgr</strong> attempts to identify information in the Duet release notes that may impact your current configuration, by matching information in your <strong>config.g</strong> and hardware setup:<br><br><span class="red darken-1">Red highlighting indicates G-codes matched in your config.g</span><br><span class="blue darken-4">Blue highlighting indicates hardware matched in your setup</span><br><span class="purple darken-4">Purple highlighting indicates a combination of both</span><br><br>All information is indicative<br>You should not solely rely on ReleaseMgr for evaluating the impact of updating your current firmware/software.',
                            guideDark: '<strong>All release notes should be read in full before updating!<br/>You are fully responsible for the consequences of updating your firmware.<br></strong>Superceeded Beta and RC firmware versions are not generally supported, and using them is at your own risk.',
                            connErr: '<strong>Unable to reach GitHub. Check your connection & browser settings.</strong>',

                        }
                    }, 
                };
            }
        }
}