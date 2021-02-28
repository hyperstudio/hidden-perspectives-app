import React from 'react';
import PropTypes from 'prop-types';
import Headline from '../_library/Headline';
import Stakeholder from '../_library/Stakeholder';
import PdfThumbnail from '../PdfThumbnail';
import { getShortenedString } from '../../utils/stringUtil';
import {
	Trigger,
	Container,
	Content,
	Title,
	Subtitle,
	Summary,
	AuthorsContainer,
} from './styles';

const SUMMARY_MAX_LEN = 200;
const Tooltip = ({
	id,
	subtitle,
	title,
	summary,
	thumbnailUrl,
	isLoading,
	position,
	itemTypeName,
	path,
	noSubtitle,
	noTitle,
	withLink,
	authors,
	...rest
}) => (
	<Container id={`tooltip-${id}`} position={position} {...rest}>
		<Content>
			{!isLoading && thumbnailUrl && (
				<PdfThumbnail file={thumbnailUrl} id={id} />
			)}
			{!noTitle && <Title variant="h2">{isLoading ? 'Loading...' : title}</Title>}
			{!noSubtitle && <Subtitle variant="h6">{isLoading ? 'Loading...' : subtitle}</Subtitle>}
			{!isLoading && <Summary>{getShortenedString(summary, SUMMARY_MAX_LEN)}</Summary>}
			{authors.length > 0 && (
				<AuthorsContainer>
					<Headline variant="h6">{authors.length === 1 ? 'Author' : 'Authors'}</Headline>
					{authors.map((author) => (
						<Stakeholder
							key={author.id}
							id={author.id}
							to={`/protagonist/context/${author.id}`}
						>
							{author.name}
						</Stakeholder>
					))}
				</AuthorsContainer>
			)}
		</Content>
	</Container>
);

Tooltip.propTypes = {
	id: PropTypes.string,
	subtitle: PropTypes.string,
	title: PropTypes.string,
	summary: PropTypes.string,
	thumbnailUrl: PropTypes.string,
	path: PropTypes.string,
	isLoading: PropTypes.bool,
	noSubtitle: PropTypes.bool,
	noTitle: PropTypes.bool,
	withLink: PropTypes.bool,
	position: PropTypes.oneOf(['left', 'right']),
	itemTypeName: PropTypes.oneOf(['Event', 'Document', 'Stakeholder']),
	authors: PropTypes.arrayOf(PropTypes.shape({
		id: PropTypes.string.isRequired,
		name: PropTypes.string.isRequired,
	})),
};

Tooltip.defaultProps = {
	id: undefined,
	subtitle: undefined,
	title: undefined,
	summary: undefined,
	thumbnailUrl: undefined,
	path: '',
	isLoading: true,
	withLink: true,
	noSubtitle: false,
	noTitle: false,
	position: 'right',
	itemTypeName: 'Document',
	authors: [],
};

const TooltipTrigger = ({
	children,
	onMouseEnter,
	onMouseLeave,
	...props
}) => (
	<Trigger
		onMouseEnter={onMouseEnter}
		onMouseLeave={onMouseLeave}
	>
		{children}
		<Tooltip {...props} />
	</Trigger>
);

TooltipTrigger.propTypes = {
	onMouseEnter: PropTypes.func,
	onMouseLeave: PropTypes.func,
	children: PropTypes.node.isRequired,
};

TooltipTrigger.defaultProps = {
	onMouseEnter: () => {},
	onMouseLeave: () => {},
};

export default TooltipTrigger;

