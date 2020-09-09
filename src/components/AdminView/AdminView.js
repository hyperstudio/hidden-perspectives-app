import React from 'react';
import PropTypes from 'prop-types';
import {
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalDialog,
	ModalFooter,
	ModalHeader,
	Typography,
} from '@smooth-ui/core-sc';
import { isAuthenticated, isAuthorized, getUserId } from '../../utils/localStorageUtil';
import InputWrapper from '../_library/InputWrapper';
import Select from '../_library/Select';
import LoadingIndicator from '../LoadingIndicator';
import Errors from '../Errors';
import Alerts from '../Alerts';
import Button from '../_library/Button';
import { LoadingContainer } from '../LoadingIndicator/styles';
import {
	Container,
	Content,
	ScrollContainer,
	Table,
	Tbody,
	Td,
	Th,
	Thead,
	Title,
} from './styles';

const optionsList = [
	{ label: 'Admin', value: 'Admin' },
	{	label: 'Editor', value: 'Editor' },
	{ label: 'Viewer', value: 'Viewer' },
];

const AdminView = ({
	isLoading,
	setSelectState,
	selectState,
	handleSelectChange,
	handleDelete,
	users,
	alerts,
	errors,
	toggled,
	onToggle,
	deleted,
	refreshUsers,
}) => (
	<Container>
		<Errors errors={errors} />
		<Alerts alerts={alerts} />
		<LoadingContainer isLoading={isLoading}>
			<LoadingIndicator />
		</LoadingContainer>
		{!isLoading && isAuthenticated() && isAuthorized(['Admin']) && (
			<ScrollContainer>
				<Content>
					<Title variant="h3">
						Administration
					</Title>
					<Title variant="h4">
						Users
						{' '}
						<Button
							type="button"
							disabled={isLoading}
							onClick={(evt) => {
								evt.preventDefault();
								refreshUsers();
							}}
						>
							<img src="/icons/refresh.svg" alt="Refresh" />
						</Button>
					</Title>
					<div style={{ paddingBottom: '1rem' }}>
						To change a user&apos;s role, select a different role in the dropdown menu.
						To delete a user, click the &ldquo;Delete user&rdquo; button.
					</div>
					<Table>
						<Thead>
							<tr>
								<Th>Email</Th>
								<Th>Username</Th>
								<Th style={{ minWidth: '100px' }}>Role</Th>
								<Th>Actions</Th>
							</tr>
						</Thead>
						<Tbody>
							{users.map((user) => (!deleted.includes(user.id) && (
								<tr key={user.id}>
									<Td>
										{user.email}
									</Td>
									<Td>
										{user.userName}
									</Td>
									<Td>
										{user.id !== getUserId() && (
											<InputWrapper
												name="role"
												label="Role"
												placeholder="Role"
												value={selectState[user.id]}
												nolabel
												options={optionsList}
												onChange={(val) => {
													setSelectState({ ...selectState, [user.id]: val });
													handleSelectChange(user.id, val.value);
												}}
											>
												{(props) => <Select {...props} />}
											</InputWrapper>
										)}
										{user.id === getUserId() && (
											user.role
										)}
									</Td>
									<Td>
										<Button
											type="button"
											danger
											disabled={user.id === getUserId()}
											onClick={(evt) => {
												evt.preventDefault();
												return onToggle({ ...toggled, [user.id]: true });
											}}
										>
											Delete user
										</Button>
										<Modal
											opened={toggled[user.id]}
											onClose={() => (
												onToggle({ ...toggled, [user.id]: false })
											)}
										>
											<ModalDialog>
												<ModalContent>
													<ModalCloseButton />
													<ModalHeader>
														<Typography variant="h5" m={0}>
															Delete user
														</Typography>
													</ModalHeader>
													<ModalBody>
														Are you sure you want to delete this user?
														This action cannot be undone.
													</ModalBody>
													<ModalFooter>
														<Button
															type="button"
															danger
															onClick={(evt) => {
																evt.preventDefault();
																handleDelete(user.id);
															}}
														>
															Delete user
														</Button>
														<Button
															type="button"
															onClick={(evt) => {
																evt.preventDefault();
																return onToggle({ ...toggled, [user.id]: false });
															}}
														>
															Cancel
														</Button>
													</ModalFooter>
												</ModalContent>
											</ModalDialog>
										</Modal>

									</Td>
								</tr>
							)))}
						</Tbody>
					</Table>
				</Content>
			</ScrollContainer>
		)}
		{!isLoading && (!isAuthenticated() || !isAuthorized(['Admin'])) && (
			<ScrollContainer>
				<Content style={{ textAlign: 'center' }}>
					You do not have permission to view this page.
				</Content>
			</ScrollContainer>
		)}
	</Container>
);

AdminView.propTypes = {
	isLoading: PropTypes.bool,
	selectState: PropTypes.shape({}),
	setSelectState: PropTypes.func.isRequired,
	handleSelectChange: PropTypes.func.isRequired,
	handleDelete: PropTypes.func.isRequired,
	refreshUsers: PropTypes.func.isRequired,
	users: PropTypes.arrayOf(PropTypes.shape({
		id: PropTypes.string.isRequired,
		email: PropTypes.string.isRequired,
		role: PropTypes.string.isRequired,
		userName: PropTypes.string.isRequired,
	})),
	deleted: PropTypes.arrayOf(PropTypes.string),
	errors: PropTypes.arrayOf(PropTypes.string.isRequired),
	alerts: PropTypes.arrayOf(
		PropTypes.shape({
			message: PropTypes.string.isRequired,
			variant: PropTypes.string.isRequired,
		}),
	),
	toggled: PropTypes.shape({}).isRequired,
	onToggle: PropTypes.func.isRequired,
};

AdminView.defaultProps = {
	isLoading: true,
	users: [],
	errors: [],
	deleted: [],
	alerts: [],
	selectState: {},
};

export default AdminView;
