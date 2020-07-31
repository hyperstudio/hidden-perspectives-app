import React from 'react';
import PropTypes from 'prop-types';
import Headline from '../Headline';
import {
	Container, Legend, EditLegend, EditContainer,
} from './styles';

const Fieldset = ({ title, children, mode }) => (
	<Container>
		{mode === 'edit'
			? (
				<EditContainer>
					<EditLegend>
						<Headline variant="h5">
							{title}
						</Headline>
					</EditLegend>
					{children}
				</EditContainer>
			)
			: (
				<>
					<Legend>
						<Headline variant="h5">
							{title}
						</Headline>
					</Legend>
					{children}
				</>
			)
		}
	</Container>
);

Fieldset.propTypes = {
	title: PropTypes.string.isRequired,
	children: PropTypes.node.isRequired,
	mode: PropTypes.oneOf(['edit', 'display']),
};

Fieldset.defaultProps = {
	mode: 'display',
};

export default Fieldset;
