import { Button, ButtonGroup, Icon } from '@rocket.chat/fuselage';
import React from 'react';

import Page from '../../../components/Page';
import VerticalBar from '../../../components/VerticalBar';
import { useRoute, useCurrentRoute } from '../../../contexts/RouterContext';
import { useTranslation } from '../../../contexts/TranslationContext';
import { AddUser } from './AddUser';
import EditUserWithData from './EditUserWithData';
import { InviteUsers } from './InviteUsers';
import { UserInfoWithData } from './UserInfo';
import UsersTable from './UsersTable';

function UsersPage() {
	const t = useTranslation();

	const usersRoute = useRoute('admin-users');

	const handleVerticalBarCloseButtonClick = () => {
		usersRoute.push({});
	};

	const handleNewButtonClick = () => {
		usersRoute.push({ context: 'new' });
	};

	const handleInviteButtonClick = () => {
		usersRoute.push({ context: 'invite' });
	};

	const [, { context, id }] = useCurrentRoute();

	return (
		<Page flexDirection='row'>
			<Page>
				<Page.Header title={t('Users')}>
					<ButtonGroup>
						<Button onClick={handleNewButtonClick}>
							<Icon name='plus' /> {t('New')}
						</Button>
						<Button onClick={handleInviteButtonClick}>
							<Icon name='send' /> {t('Invite')}
						</Button>
					</ButtonGroup>
				</Page.Header>
				<Page.Content>
					<UsersTable />
				</Page.Content>
			</Page>
			{context && (
				<VerticalBar>
					<VerticalBar.Header>
						{context === 'info' && t('User_Info')}
						{context === 'edit' && t('Edit_User')}
						{context === 'new' && t('Add_User')}
						{context === 'invite' && t('Invite_Users')}
						<VerticalBar.Close onClick={handleVerticalBarCloseButtonClick} />
					</VerticalBar.Header>

					{context === 'info' && <UserInfoWithData uid={id} />}
					{context === 'edit' && <EditUserWithData uid={id} />}
					{context === 'new' && <AddUser />}
					{context === 'invite' && <InviteUsers />}
				</VerticalBar>
			)}
		</Page>
	);
}

export default UsersPage;
