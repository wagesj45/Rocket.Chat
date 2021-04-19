import { useCallback, useMemo, useState } from 'react';

import { getConfig } from '../../../../../../app/ui-utils/client/config';
import { IRoom } from '../../../../../../definition/IRoom';
import { useEndpoint } from '../../../../../contexts/ServerContext';
import { useScrollableRecordList } from '../../../../../hooks/lists/useScrollableRecordList';
import { useComponentDidUpdate } from '../../../../../hooks/useComponentDidUpdate';
import { RecordList } from '../../../../../lib/lists/RecordList';

type TeamsChannelListOptions = {
	teamId: string;
	type: 'all' | 'autoJoin';
	text: string;
};

export const useTeamsChannelList = (
	options: TeamsChannelListOptions,
): {
	teamsChannelList: RecordList<IRoom>;
	initialItemCount: number;
	reload: () => void;
	loadMoreItems: (start: number, end: number) => void;
} => {
	const apiEndPoint = useEndpoint('GET', 'teams.listRooms');
	const [teamsChannelList, setTeamsChannelList] = useState(() => new RecordList<IRoom>());
	const reload = useCallback(() => setTeamsChannelList(new RecordList<IRoom>()), []);

	useComponentDidUpdate(() => {
		options && reload();
	}, [options, reload]);

	const fetchData = useCallback(
		async (start, end) => {
			const { rooms, total } = await apiEndPoint({
				teamId: options.teamId,
				offset: start,
				count: end - start,
				filter: options.text,
				type: options.type,
			});

			return {
				items: rooms.map((rooms) => {
					rooms._updatedAt = new Date(rooms._updatedAt);
					return { ...rooms };
				}),
				itemCount: total,
			};
		},
		[apiEndPoint, options],
	);

	const { loadMoreItems, initialItemCount } = useScrollableRecordList(
		teamsChannelList,
		fetchData,
		useMemo(() => {
			const filesListSize = getConfig('teamsChannelListSize');
			return filesListSize ? parseInt(filesListSize, 10) : undefined;
		}, []),
	);

	return {
		reload,
		teamsChannelList,
		loadMoreItems,
		initialItemCount,
	};
};
