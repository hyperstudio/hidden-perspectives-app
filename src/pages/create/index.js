import React from 'react';
import PropTypes from 'prop-types';
import CreateForm from '../../components/CreateForm';
import Header from '../../components/Header';

const CreatePage = ({ itemType }) => (
	<>
		<Header />
		<CreateForm itemType={itemType} />
	</>
);

CreatePage.propTypes = {
	itemType: PropTypes.string.isRequired,
};

export default CreatePage;

