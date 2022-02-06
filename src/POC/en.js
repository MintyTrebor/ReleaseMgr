export default {
    methods: {
        tmpLangObj() {
                return { 
                    plugin: {
                        ReleaseMgr: {
                            name: 'ReleaseMgr',
                            configAssTitle: 'Config.g Assessment',
                            configAssGcodeMatchState: 'These codes in config.g are also mentioned in the release notes for ',
                            configAssGcodeNoMatchState: 'Your config.g file does not contain any of the codes mentioned in the release notes.',
                            fileBrowserFileClickedP1: 'These codes in  ',
                            fileBrowserFileClickedP2: ' are also mentioned in the release notes for ',
                            fileBrowserFootor1: 'Files with red icon contain G-Code(s) that are mentioned in the release notes. ',
                            fileBrowserFootor2: 'Click the file for more details.',
                            fileBrowserMacroMode: 'Switch View to SYS files',
                            fileBrowserSysMode: 'Switch View to Macro files',
                            switchDuetRN: 'Switch View to Duet Release Notes',
                            switchDuetRI: 'Switch View to Duet Release Info',
                            switchGloomyRN: 'Switch View to Gloomy Release Notes',
                            switchGloomyRI: 'Switch View to Gloomy Release Info',
                            releaseAssetsHeader: 'Release Assets available for download',

                        }
                    }        
                };
            }
        }
}