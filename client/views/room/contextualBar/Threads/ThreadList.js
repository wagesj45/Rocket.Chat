import { Box, Icon, TextInput, Select, Margins, Callout } from '@rocket.chat/fuselage';
import { useResizeObserver, useMutableCallback, useAutoFocus } from '@rocket.chat/fuselage-hooks';
import React, { useMemo, useRef } from 'react';
import { Virtuoso } from 'react-virtuoso';

import ThreadComponent from '../../../../../app/threads/client/components/ThreadComponent';
import ScrollableContentWrapper from '../../../../components/ScrollableContentWrapper';
import VerticalBar from '../../../../components/VerticalBar';
import {
	useRoute,
	useCurrentRoute,
	useQueryStringParameter,
} from '../../../../contexts/RouterContext';
import { useSetting } from '../../../../contexts/SettingsContext';
import { useTranslation } from '../../../../contexts/TranslationContext';
import { useTabContext } from '../../providers/ToolboxProvider';
import Row from './Row';
import { withData } from './withData';

function ThreadList({
	total = 10,
	threads = [],
	room,
	unread = [],
	unreadUser = [],
	unreadGroup = [],
	type,
	setType,
	loadMoreItems,
	loading,
	onClose,
	error,
	userId,
	text,
	setText,
}) {
	const showRealNames = useSetting('UI_Use_Real_Name');
	const threadsRef = useRef();

	const t = useTranslation();
	const inputRef = useAutoFocus(true);
	const [name] = useCurrentRoute();
	const channelRoute = useRoute(name);
	const onClick = useMutableCallback((e) => {
		const { id: context } = e.currentTarget.dataset;
		channelRoute.push({
			tab: 'thread',
			context,
			rid: room._id,
			name: room.name,
		});
	});

	const options = useMemo(
		() => [
			['all', t('All')],
			['following', t('Following')],
			['unread', t('Unread')],
		],
		[t],
	);

	threadsRef.current = threads;

	const { ref, contentBoxSize: { inlineSize = 378, blockSize = 1 } = {} } = useResizeObserver({
		debounceDelay: 200,
	});

	const mid = useTabContext();
	const jump = useQueryStringParameter('jump');

	return (
		<>
			<VerticalBar.Header>
				<VerticalBar.Icon name='thread' />
				<VerticalBar.Text>{t('Threads')}</VerticalBar.Text>
				<VerticalBar.Close onClick={onClose} />
			</VerticalBar.Header>
			<VerticalBar.Content paddingInline={0} ref={ref}>
				<Box
					display='flex'
					flexDirection='row'
					p='x24'
					borderBlockEndWidth='x2'
					borderBlockEndStyle='solid'
					borderBlockEndColor='neutral-200'
					flexShrink={0}
				>
					<Box display='flex' flexDirection='row' flexGrow={1} mi='neg-x4'>
						<Margins inline='x4'>
							<TextInput
								placeholder={t('Search_Messages')}
								value={text}
								onChange={setText}
								addon={<Icon name='magnifier' size='x20' />}
								ref={inputRef}
							/>
							<Select
								flexGrow={0}
								width='110px'
								onChange={setType}
								value={type}
								options={options}
							/>
						</Margins>
					</Box>
				</Box>
				<Box flexGrow={1} flexShrink={1} overflow='hidden' display='flex'>
					{error && (
						<Callout mi='x24' type='danger'>
							{error.toString()}
						</Callout>
					)}
					{total === 0 && <Box p='x24'>{t('No_Threads')}</Box>}
					{!error && total > 0 && threads.length > 0 && (
						<Virtuoso
							style={{ height: blockSize, width: inlineSize }}
							totalCount={total}
							endReached={
								loading ? () => {} : (start) => loadMoreItems(start, Math.min(50, total - start))
							}
							overscan={25}
							data={threads}
							components={{ Scroller: ScrollableContentWrapper }}
							itemContent={(index, data) => (
								<Row
									thread={data}
									showRealNames={showRealNames}
									unread={unread}
									unreadUser={unreadUser}
									unreadGroup={unreadGroup}
									userId={userId}
									onClick={onClick}
								/>
							)}
						/>
					)}
				</Box>
			</VerticalBar.Content>
			{mid && (
				<VerticalBar.InnerContent>
					<ThreadComponent onClickBack={onClick} mid={mid} jump={jump} room={room} />
				</VerticalBar.InnerContent>
			)}
		</>
	);
}

export default withData(ThreadList);
