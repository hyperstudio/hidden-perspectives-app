import React from 'react';
import PropTypes from 'prop-types';
import MetadataRow from '../_library/MetadataRow';
import Fieldset from '../_library/Fieldset';
import LoadingIndicator from '../LoadingIndicator';
import NodeSidebar from '../NodeSidebar';
import Errors from '../Errors';
import { LoadingContainer } from '../LoadingIndicator/styles';
import { Container, Content, ScrollContainer } from './styles';

const DefaultValueComponent = ({ value }) => value;
DefaultValueComponent.propTypes = {
	value: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.array,
		PropTypes.shape({}),
	]).isRequired,
};

const MetadataEditView = ({
	data,
	isLoading,
	id,
	itemType,
	errors,
}) => (
	<Container>
		<Errors errors={errors} />
		<LoadingContainer isLoading={isLoading}>
			<LoadingIndicator />
		</LoadingContainer>
		<NodeSidebar id={id} itemType={itemType} />
		<ScrollContainer>
			<Content>
				{data.map(({ values, groupLabel }) => (
					<Fieldset title={groupLabel} key={groupLabel}>
						{values.map(({ label, ValueComponent = DefaultValueComponent, value }) => (
							<MetadataRow key={label} label={label}>
								{Array.isArray(value)
									? value.map(({ name, ...props }) => (
										<ValueComponent
											{...props}
											key={name}
											value={name}
										/>
									)) : <ValueComponent value={value} />}
							</MetadataRow>
						))}
					</Fieldset>
				))}
			</Content>
		</ScrollContainer>
	</Container>
);

MetadataEditView.propTypes = {
	id: PropTypes.string.isRequired,
	itemType: PropTypes.string.isRequired,
	isLoading: PropTypes.bool,
	data: PropTypes.arrayOf(PropTypes.shape({
		groupLabel: PropTypes.string.isRequired,
		values: PropTypes.arrayOf(PropTypes.shape({
			label: PropTypes.string.isRequired,
			ValueComponent: PropTypes.oneOfType([
				PropTypes.element,
				PropTypes.func,
			]),
			value: PropTypes.oneOfType([
				PropTypes.string,
				PropTypes.array,
				PropTypes.shape({}),
			]).isRequired,
		})).isRequired,
	})),
	errors: Errors.propTypes.errors,
};

MetadataEditView.defaultProps = {
	isLoading: true,
	data: [],
	errors: Errors.defaultProps.errors,
};

export default MetadataEditView;
