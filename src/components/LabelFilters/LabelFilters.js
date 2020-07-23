import React from 'react';
import PropTypes from 'prop-types';
import { prop } from 'ramda';
import { AllNoneText } from './styles';
import Tag from '../_library/Tag';
import Headline from '../_library/Headline';

const getToggleHandler = ({ filteredTags, tags, setFilteredTags }) => () => {
	if (filteredTags.length === tags.length) return setFilteredTags([]);
	return setFilteredTags(tags.map(prop('id')));
};

const getClickHandler = ({
	filteredTags,
	setFilteredTags,
	id,
}) => () => {
	const newFilteredTags = filteredTags.includes(id)
		? filteredTags.filter((tagId) => tagId !== id)
		: [...filteredTags, id];
	setFilteredTags(newFilteredTags);
};

function elementHasTag(element, id) {
	if (Array.isArray(element)) return element.find((nestedEl) => elementHasTag(nestedEl, id));
	return (element.tags || []).find((tag) => tag.id === id);
}

function reOrganizeTags(tags) {
	const redoneTags = [];
	tags.forEach((element) => {
		redoneTags.push(element.Tag);
	});
	return redoneTags;
}

const LabelFilters = ({
	tags,
	filteredTags,
	hoveredElement,
	setHoveredElement,
	...otherProps
}) => (
	<div className="tour-entry-keywords">
		{tags.length > 0 && (
			<Headline variant="h5">
				{'Keywords'}
				{tags.length > 1 && (
					<AllNoneText onClick={getToggleHandler({ tags, filteredTags, ...otherProps })}>
						Toggle all/none
					</AllNoneText>
				)}
			</Headline>
		)}
		<br />
		{reOrganizeTags(tags).map(({ id, name }) => (
			<Tag
				key={id}
				hovered={hoveredElement && elementHasTag(hoveredElement, id)}
				isActive={filteredTags.find((filteredTagId) => filteredTagId === id)}
				onMouseEnter={() => setHoveredElement({ id, itemType: 'tag' })}
				onMouseLeave={() => setHoveredElement(null)}
				onClick={tags.length > 1 ? getClickHandler({ ...otherProps, filteredTags, id }) : () => {	}}
			>
				{name}
			</Tag>
		))}
	</div>
);

LabelFilters.propTypes = {
	tags: PropTypes.arrayOf(PropTypes.shape({
		id: PropTypes.string.isRequired,
		name: PropTypes.string.isRequired,
	})).isRequired,
	filteredTags: PropTypes.arrayOf(PropTypes.string).isRequired,
	setFilteredTags: PropTypes.func.isRequired,
	hoveredElement: PropTypes.oneOfType([
		PropTypes.shape({
			id: PropTypes.string.isRequired,
			itemType: PropTypes.string.isRequired,
		}),
		PropTypes.arrayOf(
			PropTypes.shape({
				id: PropTypes.string.isRequired,
				itemType: PropTypes.string.isRequired,
			}),
		),
	]),
	setHoveredElement: PropTypes.func,
};

LabelFilters.defaultProps = {
	hoveredElement: null,
	setHoveredElement: () => {},
};

export default LabelFilters;
