'use strict'

import { registerRoute } from '../../routes';

import ReleaseMgrMainPanel from './ReleaseMgrMainPanel.vue';


registerRoute(ReleaseMgrMainPanel, {
	Settings: {
		ReleaseMgr: {
			icon: 'mdi-application-cog',
			caption: 'ReleaseMgr',
			path: '/ReleaseMgr'
		}
	}
});



