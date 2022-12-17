export function tmpLangObj() {
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
                switchDuetRN: 'RRF Release',
                switchGloomyRN: 'Gloomy Release',
                switchDuetSBCRN: 'DSF Release',
                switchDuetDWCRN: 'DWC Release',
                switchDuetRNHover: 'Switch View to Duet RRF Release Notes',
                switchDuetRIHover: 'Switch View to Duet RRF Release Info',
                switchGloomyRNHover: 'Switch View to Gloomy Release Notes',
                switchGloomyRIHover: 'Switch View to Gloomy Release Info',
                switchGloomyESPRIHover: 'Switch View to Gloomy ESP Wifi Release Info',
                switchDuetSBCRNHover: 'Switch View to Duet DSF Release Notes',
                switchDuetSBCRIHover: 'Switch View to Duet DSF Release Info',
                switchDuetDWCRNHover: 'Switch View to Duet DWC Release Notes',
                switchDuetDWCRIHover: 'Switch View to Duet DWC Release Info',
                dsfUpdateInstructions: 'Click here to view DSF & SBC update instructions',
                gloomyUpdateIns1: 'Click here to view DSF & SBC update instructions for STM32 Boards',
                gloomyUpdateIns2: 'Click here to view DSF & SBC update instructions for LPC Boards',
                releaseAssetsHeader: 'Release Assets available for download',
                lineMatchedConfG: 'Your Config.g contains the g-code(s) highlighted in this change',
                shortNMatchedHW: 'Your HW configuration may be impacted by this change',
                gcodeMatchConfG: 'This code is included in your Config.g file. Click to view Reference Documentation for this GCode',
                gcodeLink2Doc: 'Click to view Reference Documentation for this GCode',
                gcodeMatchFile: 'This code is included in the selected file',
                gcodeMatchConfGSection: 'This section contains changes which indicates an impact to your Config.g',
                HWMatchHWSection: 'This section contains changes which indicates an impact to your HW configuration',
                BothMatchSection: 'This section contains changes which indicates an impact to both your Config.g & HW configuration',
                gcodeMatchConfGRN: 'This Release Note contains changes which indicates an impact to your Config.g',
                HWMatchHWRN: 'This Release Note contains changes which indicates an impact to your HW configuration',
                BothMatchRN: 'This Release Note contains changes which indicates an impact to both your Config.g & HW configuration',
                headerDuet: 'Currently Viewing Duet RRF Release Details',
                headerSBC: 'Currently Viewing Duet DSF Release Details',
                headerDWC: 'Currently Viewing Duet DWC Release Details',
                headerGloomy: 'Currently Viewing Team Gloomy Release Details',
                filesNotAvail: 'Typically not used for Team Gloomy based boards',
                filesNotAvail2: 'Click to Gain Access',
                title: 'ReleaseMgr',
                currFWVer: 'Current Firmware Version :',
                currFWSrc: 'Firmware Source :',
                currCBoard: 'Control Board(s) :',
                btnRefreshHover: 'Refresh Data',
                btnSettingsHover: 'Settings',
                lblSelGloomyRel: 'Select Team Gloomy Release',
                lblSelDuetRel: 'Select Duet Release',
                lblSWAllRel: 'All Releases',
                lblSWBetaRel: 'Beta Releases',
                notice: '<strong>ReleaseMgr</strong> is your wingman for firmware updating.<br><strong>ReleaseMgr</strong> attempts to identify information in the Duet release notes that may impact your current configuration by matching information in your <strong>config.g</strong> and hardware setup:',
                noticeFooter: 'All information is indicative<br>You should not solely rely on ReleaseMgr for evaluating the impact of updating your current firmware/software.',
                noticeForum: 'Please goto this forum post to provide any feedback.',
                guide: '<strong>All release notes should be read in full before updating!<br/>You are fully responsible for the consequences of updating your firmware.<br></strong>Superceded Beta and RC firmware versions are not generally supported, and using them is at your own risk.',
                redTxt: 'Red highlighting indicates G-codes matched in your config.g',
                blueTxt: 'Blue highlighting indicates hardware matched in your setup',
                purpleTxt: 'Purple highlighting indicates a combination of both',
                connErr: '<strong>Unable to reach GitHub. Check your connection & browser settings.</strong>',
                fileDLNotice: 'All files will download to your local machine. Follow the standard updating process once downloaded.',
                switchGSCheckOnLoad: 'Auto Check for Updates',
                switchGSCheckOnLoadHover: 'Checks Github for a newer version when loading DWC',
                switchGSAlertOnce: 'Alert Once per version release',
                switchGSAlertOnceHover: 'ReleaseMgr will alert only once per release when it finds a new update.',
            }
        }, 
    };
}