import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Theme from '../components/Theme';
import { GlobalStyles } from '../components/App/styles';
import Headline from '../components/_library/Headline';

const StoryWrapperContent = styled.div`
	width: 100%;
	max-width: ${({ maxWidth }) => (maxWidth ? `${maxWidth}px` : '370px')};
	margin: 40px auto;
	padding: 40px;
	border: 1px solid #dee2e6;
	border-radius: 5px;
	background: ${({ background }) => background};
`;

const StoryWrapperContainer = styled.div`
	width: 100vw;
	min-height: 100vh;
	position: relative;
`;

export const ClickableCard = styled.div`
	width: 100%;
	max-width: ${({ maxWidth }) => (maxWidth ? `${maxWidth}px` : '370px')};
	margin: 20px auto;
	padding: 20px;
	padding-bottom: 15px;
	border: 1px solid #dee2e6;
	border-radius: 5px;
	background: ${({ background }) => background};
	transition: color .2s ease-in-out,border-style .2s ease-in-out,visibility .2s ease-in-out,background .2s ease-in-out,background-color .2s ease-in-out,text-decoration .2s ease-in-out,box-shadow .2s ease-in-out,transform .2s ease-in-out,opacity .2s ease-in-out;
	&:hover {
		background: #e9ecef;
		cursor: pointer;
	}
`;

export const PhaseCard = styled.div`
	width: 100%;
	max-width: ${({ maxWidth }) => (maxWidth ? `${maxWidth}px` : '370px')};
	margin: 20px auto;
	padding: 20px;
	padding-bottom: 15px;
	border: 1px solid #dee2e6;
	border-radius: 5px;
	background: ${({ background }) => background};
	transition: color .2s ease-in-out,border-style .2s ease-in-out,visibility .2s ease-in-out,background .2s ease-in-out,background-color .2s ease-in-out,text-decoration .2s ease-in-out,box-shadow .2s ease-in-out,transform .2s ease-in-out,opacity .2s ease-in-out;
`;

export const SearchContainer = styled.form`
	position: relative;
	height: 25%;
	width: 40%;
	z-index: 2;
`;

export const Field = styled.input`
	position: absolute;
	top: -0.5em;
	left: 425px;
	width: 100%;
	height: 25%;
	border: 1px solid ${({ theme }) => theme.commonBorderColor};
	background: ${({ value }) => (value ? 'none' : 'url("/icons/loup.svg")')};
	background-position: 3.5rem center;
	background-size: 1.5rem 1.5rem;
	background-repeat: no-repeat;
	font-size: 1rem;
	line-height: 1rem;
	padding: 1.25rem 1rem 1rem 1rem;
	border-radius: 10px;
	transition: color 200ms ease-out,
		border 200ms ease-out,
		box-shadow 200ms ease-out,
		border-radius 200ms ease-out;
	text-align: ${({ value }) => (value ? 'left' : 'center')};

	&::placeholder {
		color: ${({ theme }) => theme.gray500};
	}

	&:focus {
		${({ theme }) => theme.controlFocus()('primary')}
		border-color: ${({ theme }) => theme.primary};
		border-radius: 1px;
		border-top-width: 1px;
		text-align: left;
		background: none;
	}
`;

export const Separator = styled.hr`
	width: 100%;
	height: 1px;
	border: none;
	margin: 0.8rem 0;
`;

export const PhaseInnerSeparator = styled.hr`
	width: 100%;
	height: 1px;
	margin: 0.8rem 0;
	border: 0;
	border-bottom: 1px solid ${({ theme }) => theme.commonBorderColor};
`;

export const IconContainer = styled.span`
	position: absolute;
`;

export const HeadlineContainer = styled.span`
	margin-top: ${({ variant }) => {
		if (variant === 'h5') return '0';
		return '-0.5em';
	}};
	margin-right: ${({ variant }) => {
		if (variant === 'h5') return '0.5em';
		return '1em';
	}};
`;

export const Title = styled(Headline)`
	display: inline;
	cursor: pointer;
	box-decoration-break: clone;
	border-radius: 2px;
	padding: 0 .4rem;
	margin-left: -0.4rem;
	transition: color 200ms ease-out, background 200ms ease-out;
	&:hover {
		background: ${({ theme }) => theme.primaryLight};
		color: ${({ theme }) => theme.primaryDark};
	}
`;

export const StoryWrapper = ({ children, maxWidth, background }) => (
	<Theme>
		<StoryWrapperContainer>
			<GlobalStyles />
			<StoryWrapperContent
				maxWidth={maxWidth}
				background={background}
			>
				{children}
			</StoryWrapperContent>
		</StoryWrapperContainer>
	</Theme>
);

StoryWrapper.propTypes = {
	children: PropTypes.element.isRequired,
	maxWidth: PropTypes.number,
	background: PropTypes.string,
};

StoryWrapper.defaultProps = {
	maxWidth: undefined,
	background: 'none',
};

