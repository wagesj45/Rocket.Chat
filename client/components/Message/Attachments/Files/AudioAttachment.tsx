import React, { FC } from 'react';

import { FileProp } from '..';
import Attachment from '../Attachment';
import { AttachmentPropsBase } from '../Attachment/AttachmentPropsBase';
import { useMediaUrl } from '../context/AttachmentContext';
import { useCollapse } from '../hooks/useCollapse';

export type AudioAttachmentProps = {
	audio_url: string;
	audio_type: string;
	audio_size?: number;
	file?: FileProp;
} & AttachmentPropsBase;

export const AudioAttachment: FC<AudioAttachmentProps> = ({
	title,
	audio_url: url,
	audio_type: type,
	collapsed: collapsedDefault = false,
	audio_size: size,
	description,
	title_link: link,
	title_link_download: hasDownload,
}) => {
	const [collapsed, collapse] = useCollapse(collapsedDefault);
	// useTranslation();
	const getURL = useMediaUrl();
	return (
		<Attachment>
			<Attachment.Row>
				<Attachment.Title>{title}</Attachment.Title>
				{size && <Attachment.Size size={size} />}
				{collapse}
				{hasDownload && link && <Attachment.Download title={title} href={getURL(link)} />}
			</Attachment.Row>
			{!collapsed && (
				<Attachment.Content border='none'>
					<audio controls>
						<source src={getURL(url)} type={type} />
					</audio>
					{description && <Attachment.Details is='figcaption'>{description}</Attachment.Details>}
				</Attachment.Content>
			)}
		</Attachment>
	);
};
