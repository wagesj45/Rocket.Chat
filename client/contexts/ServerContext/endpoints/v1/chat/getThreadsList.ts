import { IMessage } from '../../../../../../definition/IMessage';
import { IRoom } from '../../../../../../definition/IRoom';
import { ObjectFromApi } from '../../../../../../definition/ObjectFromApi';

export type GetThreadsListEndpoint = {
	GET: (params: {
		rid: IRoom['_id'];
		type: 'unread' | 'following' | 'all';
		text?: string;
		offset: number;
		count: number;
	}) => {
		threads: ObjectFromApi<IMessage>[];
		total: number;
	};
};
