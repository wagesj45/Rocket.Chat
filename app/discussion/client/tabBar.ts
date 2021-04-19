import { useMemo, lazy } from 'react';

import { addAction } from '../../../client/views/room/lib/Toolbox';
import { useSetting } from '../../../client/contexts/SettingsContext';

const template = lazy(() => import('../../../client/views/room/contextualBar/Discussions'));

addAction('discussions', () => {
	const discussionEnabled = useSetting('Discussion_enabled');

	return useMemo(() => (discussionEnabled ? {
		groups: ['channel', 'group', 'direct', 'team'],
		id: 'discussions',
		title: 'Discussions',
		icon: 'discussion',
		template,
		full: true,
		order: 7,
	} : null), [discussionEnabled]);
});
