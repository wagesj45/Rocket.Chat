import { Box, CheckBox, Menu, Option } from '@rocket.chat/fuselage';
import { useMutableCallback } from '@rocket.chat/fuselage-hooks';
import React, { useMemo } from 'react';

import { roomTypes } from '../../../../../app/utils/client';
import { useSetModal } from '../../../../contexts/ModalContext';
import { useEndpoint } from '../../../../contexts/ServerContext';
import { useTranslation } from '../../../../contexts/TranslationContext';
import ConfirmationModal from './ConfirmationModal';

const useReactModal = (Component, props) => {
	const setModal = useSetModal();

	return useMutableCallback(() => {
		const handleClose = () => {
			setModal(null);
		};

		setModal(() => <Component onClose={handleClose} {...props} />);
	});
};

const RoomActions = ({ room, reload }) => {
	const t = useTranslation();
	const updateRoomEndpoint = useEndpoint('POST', 'teams.updateRoom');
	const removeRoomEndpoint = useEndpoint('POST', 'teams.removeRoom');
	const deleteRoomEndpoint = useEndpoint(
		'POST',
		room.t === 'c' ? 'channels.delete' : 'groups.delete',
	);

	const RemoveFromTeamAction = useReactModal(ConfirmationModal, {
		onConfirmAction: () => {
			removeRoomEndpoint({ teamId: room.teamId, roomId: room._id });
			reload();
		},
		labelButton: t('Remove'),
		content: (
			<Box is='span' size='14px'>
				{t('Team_Remove_from_team_modal_content', {
					teamName: roomTypes.getRoomName(room.t, room),
				})}
			</Box>
		),
	});

	const DeleteChannelAction = useReactModal(ConfirmationModal, {
		onConfirmAction: () => {
			deleteRoomEndpoint({ roomId: room._id });
			reload();
		},
		labelButton: t('Delete'),
		content: (
			<>
				<Box is='span' size='14px' color='danger-500' fontWeight='600'>
					{t('Team_Delete_Channel_modal_content_danger')}
				</Box>
				<Box is='span' size='14px'>
					{' '}
					{t('Team_Delete_Channel_modal_content')}
				</Box>
			</>
		),
	});

	const menuOptions = useMemo(() => {
		const AutoJoinAction = () => {
			updateRoomEndpoint({
				roomId: room._id,
				isDefault: !room.teamDefault,
			});

			reload();
		};

		return [
			{
				label: {
					label: t('Team_Auto-join'),
					icon: room.t === 'c' ? 'hash' : 'hashtag-lock',
				},
				action: AutoJoinAction,
			},
			{
				label: {
					label: t('Team_Remove_from_team'),
					icon: 'cross',
				},
				action: RemoveFromTeamAction,
			},
			{
				label: {
					label: t('Delete'),
					icon: 'trash',
				},
				action: DeleteChannelAction,
			},
		];
	}, [
		DeleteChannelAction,
		RemoveFromTeamAction,
		room._id,
		room.t,
		room.teamDefault,
		t,
		updateRoomEndpoint,
		reload,
	]);

	return (
		<Menu
			flexShrink={0}
			key='menu'
			tiny
			renderItem={({ label: { label, icon }, ...props }) =>
				icon.match(/hash/) ? (
					<Option {...props} label={label} icon={icon}>
						<CheckBox checked={room.teamDefault} />
					</Option>
				) : (
					<Box color='danger-600'>
						<Option {...props} label={label} icon={icon} />
					</Box>
				)
			}
			options={menuOptions}
		/>
	);
};

export default RoomActions;
