import { css } from '@rocket.chat/css-in-js';
import { Box, Margins, ButtonGroup, Button, Icon } from '@rocket.chat/fuselage';
import React, { memo } from 'react';

import VerticalBar from '../../../../client/components/VerticalBar';
import { useTranslation } from '../../../../client/contexts/TranslationContext';
import { withResponseData } from './withResponseData';

const breakWord = css`
	word-break: break-word;
`;

export const CannedResponseDetails = ({
	response: { shortcut, text, scope },
	onEdit,
	onReturn,
	onClose,
}) => {
	const t = useTranslation();

	return (
		<VerticalBar>
			<VerticalBar.Header>
				<VerticalBar.Back onClick={onReturn} />
				<VerticalBar.Text>!{shortcut}</VerticalBar.Text>
				<VerticalBar.Close onClick={onClose} />
			</VerticalBar.Header>

			<VerticalBar.ScrollableContent>
				<Margins block='x4'>
					<span>
						<Box fontScale='p2'>{t('Shortcut')}:</Box>
						<Box fontScale='p1' className={[breakWord]}>
							!{shortcut}
						</Box>
					</span>

					<span>
						<Box fontScale='p2'>{t('Content')}:</Box>
						<Box mbe='x2' flexShrink={1} className={[breakWord]}>
							{text}
						</Box>
					</span>

					<span>
						<Box fontScale='p2'>{t('Scope')}:</Box>
						<Box mbs='x2' className={[breakWord]}>
							{scope}
						</Box>
					</span>
				</Margins>
			</VerticalBar.ScrollableContent>

			<VerticalBar.Footer>
				<ButtonGroup stretch>
					<Button onClick={onEdit}>
						<Icon name='pencil' size='x16' />
						{t('Edit')}
					</Button>
				</ButtonGroup>
			</VerticalBar.Footer>
		</VerticalBar>
	);
};

export default memo(withResponseData(CannedResponseDetails));
