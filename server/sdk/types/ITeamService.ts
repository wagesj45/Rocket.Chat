import { FindOneOptions } from 'mongodb';

import { ITeam, IRecordsWithTotal, IPaginationOptions, IQueryOptions, ITeamMember, TEAM_TYPE } from '../../../definition/ITeam';
import { IRoom } from '../../../definition/IRoom';
import { ICreateRoomParams } from './IRoomService';

export interface ITeamCreateRoom extends Omit<ICreateRoomParams, 'type'> {
	id?: string;
}

export interface ITeamCreateParams {
	team: Pick<ITeam, 'name' | 'type'>;
	room: ITeamCreateRoom;
	members?: Array<string>; // list of user _ids
	owner?: string; // the team owner. If not present, owner = requester
}

export interface ITeamMemberParams {
	userId: string;
	roles?: Array<string>;
}

export interface IUserInfo {
	_id: string;
	username?: string;
	name: string;
	status: string;
}

export interface ITeamMemberInfo {
	user: IUserInfo;
	roles?: string[];
	createdBy: Omit<IUserInfo, 'name' | 'status'>;
	createdAt: Date;
}

export interface ITeamInfo extends ITeam {
	rooms: number;
	numberOfUsers: number;
}

export interface IListRoomsFilter {
	name: string;
	isDefault: boolean;
	getAllRooms: boolean;
	allowPrivateTeam: boolean;
}

export interface ITeamUpdateData {
	name: string;
	type: TEAM_TYPE;
}

export interface ITeamService {
	create(uid: string, params: ITeamCreateParams): Promise<ITeam>;
	addRooms(uid: string, rooms: Array<string>, teamId: string): Promise<Array<IRoom>>;
	removeRoom(uid: string, rid: string, teamId: string, canRemoveAnyRoom: boolean): Promise<IRoom>;
	listRooms(uid: string, teamId: string, filter: IListRoomsFilter, pagination: IPaginationOptions): Promise<IRecordsWithTotal<IRoom>>;
	listRoomsOfUser(uid: string, teamId: string, userId: string, allowPrivateTeam: boolean, pagination: IPaginationOptions): Promise<IRecordsWithTotal<IRoom>>;
	updateRoom(uid: string, rid: string, isDefault: boolean, canUpdateAnyRoom: boolean): Promise<IRoom>;
	list(uid: string, paginationOptions?: IPaginationOptions, queryOptions?: IQueryOptions<ITeam>): Promise<IRecordsWithTotal<ITeam>>;
	listAll(options?: IPaginationOptions): Promise<IRecordsWithTotal<ITeam>>;
	listByNames(names: Array<string>, options?: FindOneOptions<ITeam>): Promise<Array<ITeam>>;
	listByIds(ids: Array<string>, options?: FindOneOptions<ITeam>): Promise<ITeam[]>;
	search(userId: string, term: string | RegExp, options?: FindOneOptions<ITeam>): Promise<ITeam[]>;
	members(uid: string, teamId: string, canSeeAll: boolean, options?: IPaginationOptions, queryOptions?: IQueryOptions<ITeamMember>): Promise<IRecordsWithTotal<ITeamMemberInfo>>;
	addMembers(uid: string, teamId: string, members: Array<ITeamMemberParams>): Promise<void>;
	updateMember(teamId: string, members: ITeamMemberParams): Promise<void>;
	removeMembers(teamId: string, members: Array<ITeamMemberParams>): Promise<boolean>;
	getInfoByName(teamName: string): Promise<Partial<ITeam> | undefined>;
	getInfoById(teamId: string): Promise<Partial<ITeam> | undefined>;
	deleteById(teamId: string): Promise<boolean>;
	deleteByName(teamName: string): Promise<boolean>;
	unsetTeamIdOfRooms(teamId: string): void;
	getOneById(teamId: string, options?: FindOneOptions<ITeam>): Promise<ITeam | undefined>;
	getOneByName(teamName: string | RegExp, options?: FindOneOptions<ITeam>): Promise<ITeam | null>;
	getOneByMainRoomId(teamId: string): Promise<ITeam | null>;
	getOneByRoomId(teamId: string): Promise<ITeam | undefined>;
	getMatchingTeamRooms(teamId: string, rids: Array<string>): Promise<Array<string>>;
	autocomplete(uid: string, name: string): Promise<Array<IRoom>>;
	getAllPublicTeams(options: FindOneOptions<ITeam>): Promise<Array<ITeam>>;
	getMembersByTeamIds(teamIds: Array<string>, options: FindOneOptions<ITeamMember>): Promise<Array<ITeamMember>>;
	update(uid: string, teamId: string, updateData: ITeamUpdateData): Promise<void>;
}
