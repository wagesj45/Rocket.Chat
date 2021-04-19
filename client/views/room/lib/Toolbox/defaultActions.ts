import { useMemo, lazy } from 'react';

import { addAction } from '.';
import { usePermission } from '../../../../contexts/AuthorizationContext';

addAction('rocket-search', {
	groups: ['channel', 'group', 'direct', 'direct_multiple', 'live', 'team'],
	id: 'rocket-search',
	title: 'Search_Messages',
	icon: 'magnifier',
	template: 'RocketSearch',
	order: 4,
});

addAction('user-info', {
	groups: ['direct'],
	id: 'user-info',
	title: 'User_Info',
	icon: 'user',
	template: lazy(() => import('../../MemberListRouter')),
	order: 5,
});

addAction('contact-profile', {
	groups: ['live'],
	id: 'contact-profile',
	title: 'Contact_Info',
	icon: 'user',
	template: lazy(
		() => import('../../../omnichannel/directory/contacts/contextualBar/ContactsContextualBar'),
	),
	order: 5,
});

addAction('user-info-group', {
	groups: ['direct_multiple'],
	id: 'user-info-group',
	title: 'Members',
	icon: 'team',
	template: lazy(() => import('../../MemberListRouter')),
	order: 5,
});

addAction('members-list', ({ room }) => {
	const hasPermission = usePermission('view-broadcast-member-list', room._id);
	return useMemo(
		() =>
			!room.broadcast || hasPermission
				? {
						groups: ['channel', 'group'],
						id: 'members-list',
						title: 'Members',
						icon: 'members',
						template: lazy(() => import('../../MemberListRouter')),
						order: 5,
				  }
				: null,
		[hasPermission, room.broadcast],
	);
});

addAction('uploaded-files-list', {
	groups: ['channel', 'group', 'direct', 'direct_multiple', 'live', 'team'],
	id: 'uploaded-files-list',
	title: 'Files',
	icon: 'clip',
	template: lazy(() => import('../../contextualBar/RoomFiles')),
	order: 6,
});

addAction('keyboard-shortcut-list', {
	groups: ['channel', 'group', 'direct', 'direct_multiple', 'team'],
	id: 'keyboard-shortcut-list',
	title: 'Keyboard_Shortcuts_Title',
	icon: 'keyboard',
	template: lazy(() => import('../../contextualBar/KeyboardShortcuts')),
	order: 99,
});
