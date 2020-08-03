import React from 'react';
import { storiesOf } from '@storybook/react';
import { BrowserRouter as Router } from 'react-router-dom';
import {
	Grid,
	Row,
	Col,
} from '@smooth-ui/core-sc';
import Fieldset from '../components/_library/Fieldset';
import Headline from '../components/_library/Headline';
import {
	StoryWrapper,
	Card,
	Separator,
	IconContainer,
	HeadlineContainer,
	Title,
} from './styles';
import {
	TitleWrapper,
	SecondaryInfo,
	ItemDate,
	Type,
} from '../components/SummarySection/Summary/styles';
import IconItem from '../components/IconItem';

storiesOf('Points of Entry', module)
	.add('Landing page w/ Themes', () => (
		<StoryWrapper maxWidth={800}>
			<Router>
				<Fieldset title="How would you like to browse the archive?">
					<Grid>
						<Row>
							<Card maxWidth={160} background="#f8f9fa">
								<Row justifyContent="center">
									<svg width="4em" height="4em" viewBox="0 0 16 16" className="bi bi-book" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
										<path fillRule="evenodd" d="M3.214 1.072C4.813.752 6.916.71 8.354 2.146A.5.5 0 0 1 8.5 2.5v11a.5.5 0 0 1-.854.354c-.843-.844-2.115-1.059-3.47-.92-1.344.14-2.66.617-3.452 1.013A.5.5 0 0 1 0 13.5v-11a.5.5 0 0 1 .276-.447L.5 2.5l-.224-.447.002-.001.004-.002.013-.006a5.017 5.017 0 0 1 .22-.103 12.958 12.958 0 0 1 2.7-.869zM1 2.82v9.908c.846-.343 1.944-.672 3.074-.788 1.143-.118 2.387-.023 3.426.56V2.718c-1.063-.929-2.631-.956-4.09-.664A11.958 11.958 0 0 0 1 2.82z" />
										<path fillRule="evenodd" d="M12.786 1.072C11.188.752 9.084.71 7.646 2.146A.5.5 0 0 0 7.5 2.5v11a.5.5 0 0 0 .854.354c.843-.844 2.115-1.059 3.47-.92 1.344.14 2.66.617 3.452 1.013A.5.5 0 0 0 16 13.5v-11a.5.5 0 0 0-.276-.447L15.5 2.5l.224-.447-.002-.001-.004-.002-.013-.006-.047-.023a12.582 12.582 0 0 0-.799-.34 12.96 12.96 0 0 0-2.073-.609zM15 2.82v9.908c-.846-.343-1.944-.672-3.074-.788-1.143-.118-2.387-.023-3.426.56V2.718c1.063-.929 2.631-.956 4.09-.664A11.956 11.956 0 0 1 15 2.82z" />
									</svg>
								</Row>
								<Row><Separator /></Row>
								<Row justifyContent="center">Scholarly essays</Row>
							</Card>
							<Card maxWidth={160} background="#f8f9fa">
								<Row justifyContent="center">
									<svg width="4em" height="4em" viewBox="0 0 16 16" className="bi bi-signpost-split" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
										<path d="M7 16h2V6H8V2h1v-.586a1 1 0 0 0-2 0V7h1v4H7v5z" />
										<path fillRule="evenodd" d="M14 3H8v2h6l.75-1L14 3zM8 2a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h6a1 1 0 0 0 .8-.4l.975-1.3a.5.5 0 0 0 0-.6L14.8 2.4A1 1 0 0 0 14 2H8zM2 8h6v2H2l-.75-1L2 8zm6-1a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H2a1 1 0 0 1-.8-.4L.225 9.3a.5.5 0 0 1 0-.6L1.2 7.4A1 1 0 0 1 2 7h6z" />
									</svg>
								</Row>
								<Row><Separator /></Row>
								<Row justifyContent="center">Themes</Row>
							</Card>
							<Card maxWidth={160} background="#f8f9fa">
								<Row justifyContent="center">
									<svg width="4em" height="4em" viewBox="0 0 16 16" className="bi bi-calendar4-range" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
										<path fillRule="evenodd" d="M14 2H2a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1zM2 1a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2H2z" />
										<path fillRule="evenodd" d="M14 2H2a1 1 0 0 0-1 1v1h14V3a1 1 0 0 0-1-1zM2 1a2 2 0 0 0-2 2v2h16V3a2 2 0 0 0-2-2H2z" />
										<path fillRule="evenodd" d="M3.5 0a.5.5 0 0 1 .5.5V1a.5.5 0 0 1-1 0V.5a.5.5 0 0 1 .5-.5zm9 0a.5.5 0 0 1 .5.5V1a.5.5 0 0 1-1 0V.5a.5.5 0 0 1 .5-.5z" />
										<path d="M9 7.5a.5.5 0 0 1 .5-.5H15v2H9.5a.5.5 0 0 1-.5-.5v-1zm-2 3a.5.5 0 0 0-.5-.5H1v2h5.5a.5.5 0 0 0 .5-.5v-1z" />
									</svg>
								</Row>
								<Row><Separator /></Row>
								<Row justifyContent="center">Phases</Row>
							</Card>
							<Card maxWidth={160} background="#f8f9fa">
								<Row justifyContent="center">
									<svg width="4em" height="4em" viewBox="0 0 16 16" className="bi bi-layout-text-window" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
										<path fillRule="evenodd" d="M14 1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
										<path fillRule="evenodd" d="M11 15V4h1v11h-1zm4.5-11H.5V3h15v1zM3 6.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm0 3a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm0 3a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5z" />
									</svg>
								</Row>
								<Row><Separator /></Row>
								<Row justifyContent="center">Full timeline</Row>
							</Card>
						</Row>
					</Grid>
				</Fieldset>
			</Router>
		</StoryWrapper>
	))
	.add('Landing page w/ Conferences', () => (
		<StoryWrapper maxWidth={800}>
			<Router>
				<Fieldset title="How would you like to browse the archive?">
					<Grid>
						<Row>
							<Card maxWidth={160} background="#f8f9fa">
								<Row justifyContent="center">
									<svg width="4em" height="4em" viewBox="0 0 16 16" className="bi bi-book" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
										<path fillRule="evenodd" d="M3.214 1.072C4.813.752 6.916.71 8.354 2.146A.5.5 0 0 1 8.5 2.5v11a.5.5 0 0 1-.854.354c-.843-.844-2.115-1.059-3.47-.92-1.344.14-2.66.617-3.452 1.013A.5.5 0 0 1 0 13.5v-11a.5.5 0 0 1 .276-.447L.5 2.5l-.224-.447.002-.001.004-.002.013-.006a5.017 5.017 0 0 1 .22-.103 12.958 12.958 0 0 1 2.7-.869zM1 2.82v9.908c.846-.343 1.944-.672 3.074-.788 1.143-.118 2.387-.023 3.426.56V2.718c-1.063-.929-2.631-.956-4.09-.664A11.958 11.958 0 0 0 1 2.82z" />
										<path fillRule="evenodd" d="M12.786 1.072C11.188.752 9.084.71 7.646 2.146A.5.5 0 0 0 7.5 2.5v11a.5.5 0 0 0 .854.354c.843-.844 2.115-1.059 3.47-.92 1.344.14 2.66.617 3.452 1.013A.5.5 0 0 0 16 13.5v-11a.5.5 0 0 0-.276-.447L15.5 2.5l.224-.447-.002-.001-.004-.002-.013-.006-.047-.023a12.582 12.582 0 0 0-.799-.34 12.96 12.96 0 0 0-2.073-.609zM15 2.82v9.908c-.846-.343-1.944-.672-3.074-.788-1.143-.118-2.387-.023-3.426.56V2.718c1.063-.929 2.631-.956 4.09-.664A11.956 11.956 0 0 1 15 2.82z" />
									</svg>
								</Row>
								<Row><Separator /></Row>
								<Row justifyContent="center">Scholarly essays</Row>
							</Card>
							<Card maxWidth={160} background="#f8f9fa">
								<Row justifyContent="center">
									<svg width="4em" height="4em" viewBox="0 0 16 16" className="bi bi-journals" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
										<path d="M3 2h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2h1a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1H1a2 2 0 0 1 2-2z" />
										<path d="M5 0h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2v-1a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1H3a2 2 0 0 1 2-2zM1 6v-.5a.5.5 0 0 1 1 0V6h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0V9h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0v.5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1z" />
									</svg>
								</Row>
								<Row><Separator /></Row>
								<Row justifyContent="center">Conferences</Row>
							</Card>
							<Card maxWidth={160} background="#f8f9fa">
								<Row justifyContent="center">
									<svg width="4em" height="4em" viewBox="0 0 16 16" className="bi bi-calendar4-range" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
										<path fillRule="evenodd" d="M14 2H2a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1zM2 1a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2H2z" />
										<path fillRule="evenodd" d="M14 2H2a1 1 0 0 0-1 1v1h14V3a1 1 0 0 0-1-1zM2 1a2 2 0 0 0-2 2v2h16V3a2 2 0 0 0-2-2H2z" />
										<path fillRule="evenodd" d="M3.5 0a.5.5 0 0 1 .5.5V1a.5.5 0 0 1-1 0V.5a.5.5 0 0 1 .5-.5zm9 0a.5.5 0 0 1 .5.5V1a.5.5 0 0 1-1 0V.5a.5.5 0 0 1 .5-.5z" />
										<path d="M9 7.5a.5.5 0 0 1 .5-.5H15v2H9.5a.5.5 0 0 1-.5-.5v-1zm-2 3a.5.5 0 0 0-.5-.5H1v2h5.5a.5.5 0 0 0 .5-.5v-1z" />
									</svg>
								</Row>
								<Row><Separator /></Row>
								<Row justifyContent="center">Phases</Row>
							</Card>
							<Card maxWidth={160} background="#f8f9fa">
								<Row justifyContent="center">
									<svg width="4em" height="4em" viewBox="0 0 16 16" className="bi bi-layout-text-window" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
										<path fillRule="evenodd" d="M14 1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
										<path fillRule="evenodd" d="M11 15V4h1v11h-1zm4.5-11H.5V3h15v1zM3 6.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm0 3a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm0 3a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5z" />
									</svg>
								</Row>
								<Row><Separator /></Row>
								<Row justifyContent="center">Full timeline</Row>
							</Card>
						</Row>
					</Grid>
				</Fieldset>
			</Router>
		</StoryWrapper>
	))
	.add('Scholarly essays', () => (
		<StoryWrapper maxWidth={800}>
			<Row>
				<HeadlineContainer>
					<svg width="2em" height="2em" viewBox="0 0 16 16" className="bi bi-book" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
						<path fillRule="evenodd" d="M3.214 1.072C4.813.752 6.916.71 8.354 2.146A.5.5 0 0 1 8.5 2.5v11a.5.5 0 0 1-.854.354c-.843-.844-2.115-1.059-3.47-.92-1.344.14-2.66.617-3.452 1.013A.5.5 0 0 1 0 13.5v-11a.5.5 0 0 1 .276-.447L.5 2.5l-.224-.447.002-.001.004-.002.013-.006a5.017 5.017 0 0 1 .22-.103 12.958 12.958 0 0 1 2.7-.869zM1 2.82v9.908c.846-.343 1.944-.672 3.074-.788 1.143-.118 2.387-.023 3.426.56V2.718c-1.063-.929-2.631-.956-4.09-.664A11.958 11.958 0 0 0 1 2.82z" />
						<path fillRule="evenodd" d="M12.786 1.072C11.188.752 9.084.71 7.646 2.146A.5.5 0 0 0 7.5 2.5v11a.5.5 0 0 0 .854.354c.843-.844 2.115-1.059 3.47-.92 1.344.14 2.66.617 3.452 1.013A.5.5 0 0 0 16 13.5v-11a.5.5 0 0 0-.276-.447L15.5 2.5l.224-.447-.002-.001-.004-.002-.013-.006-.047-.023a12.582 12.582 0 0 0-.799-.34 12.96 12.96 0 0 0-2.073-.609zM15 2.82v9.908c-.846-.343-1.944-.672-3.074-.788-1.143-.118-2.387-.023-3.426.56V2.718c1.063-.929 2.631-.956 4.09-.664A11.956 11.956 0 0 1 15 2.82z" />
					</svg>
				</HeadlineContainer>
				<Headline variant="h3">Scholarly Essays</Headline>
			</Row>
			<Row><Separator /></Row>
			<Row>
				These essays, written by experts on the subject of U.S.-Iran relations,
				provide context for many of the
				events and documents contained in the archive. Inside each essay you will
				find links to mentioned documents,
				events, and stakeholders as they are represented in the archive.
			</Row>
			<Row><Separator /></Row>
			<Col>
				<Row>
					<SecondaryInfo variant="h6">
						<IconContainer>
							<IconItem size={20} itemType="document" fillColor="black" strokeColor="black" />
						</IconContainer>
						<ItemDate>Malcolm Byrne</ItemDate>
						<Type>October 1, 2000</Type>
					</SecondaryInfo>
				</Row>
				<Row>
					<TitleWrapper>
						<Title variant="h5">
							Clinton Administration Views on Iran under Khatami
						</Title>
					</TitleWrapper>
				</Row>
				<Row><Separator /></Row>
				<Row>
					<SecondaryInfo variant="h6">
						<IconContainer>
							<IconItem size={20} itemType="document" fillColor="black" strokeColor="black" />
						</IconContainer>
						<ItemDate>Farideh Farhi</ItemDate>
						<Type>January 1, 2001</Type>
					</SecondaryInfo>
				</Row>
				<Row>
					<TitleWrapper>
						<Title variant="h5">
							Perspective from Iran: Khatami/Clinton period (May 1997–January 2001)
						</Title>
					</TitleWrapper>
				</Row>
				<Row><Separator /></Row>
				<Row>
					<SecondaryInfo variant="h6">
						<IconContainer>
							<IconItem size={20} itemType="document" fillColor="black" strokeColor="black" />
						</IconContainer>
						<ItemDate>Bruce Riedel</ItemDate>
						<Type>February 7, 2007</Type>
					</SecondaryInfo>
				</Row>
				<Row>
					<TitleWrapper>
						<Title variant="h5">
							Bush and Iran: 2001 to 2005
						</Title>
					</TitleWrapper>
				</Row>
				<Row><Separator /></Row>
				<Row>
					<SecondaryInfo variant="h6">
						<IconContainer>
							<IconItem size={20} itemType="document" fillColor="black" strokeColor="black" />
						</IconContainer>
						<ItemDate>Mark Gasiorowski</ItemDate>
						<Type>April 2, 2007</Type>
					</SecondaryInfo>
				</Row>
				<Row>
					<TitleWrapper>
						<Title variant="h5">
							U.S. Policy Toward Iran During the Bush and Early Clinton Years, 1989-1997
						</Title>
					</TitleWrapper>
				</Row>
			</Col>
		</StoryWrapper>
	));
