import React, { FC } from 'react';

import { FileProp } from '..';
import { useTranslation } from '../../../../contexts/TranslationContext';
import MarkdownText from '../../../MarkdownText';
import Attachment from '../Attachment';
import { AttachmentPropsBase } from '../Attachment/AttachmentPropsBase';
import { useCollapse } from '../hooks/useCollapse';

export type PDFAttachmentProps = {
	file: FileProp;
} & AttachmentPropsBase;

export const PDFAttachment: FC<PDFAttachmentProps> = ({
	collapsed: collapsedDefault = false,
	description,
	title_link: link,
	title_link_download: hasDownload,
	file,
}) => {
	const t = useTranslation();
	const [collapsed, collapse] = useCollapse(collapsedDefault);
	return (
		<Attachment>
			<MarkdownText variant='inline' content={description} />
			<Attachment.Row>
				<Attachment.Title>{t('PDF')}</Attachment.Title>
				{collapse}
				{hasDownload && link && <Attachment.Download href={link} />}
			</Attachment.Row>
			{!collapsed && (
				<Attachment.Content>
					<canvas id={file._id} className='attachment-canvas'></canvas>
					{/* <div id="js-loading-{{fileId}}" class="attachment-pdf-loading">
			<Attachment.Title>{title}</Attachment.Title>
			{file.size && <Attachment.Size size={file.size}/>}
					{{> icon block="rc-input__icon-svg" icon="loading"}}
				</div>*/}
				</Attachment.Content>
			)}
		</Attachment>
	);
};
