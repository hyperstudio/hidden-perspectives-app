import React from 'react';
import PropTypes from 'prop-types';
import { lifecycle } from '@hypnosphi/recompose';
import {
	Content,
	InnerContainer,
	OuterContainer,
	YearsContainer,
	Year,
	Date,
	DatesContainer,
	YearTooltip,
	YearCount,
	YearName,
} from './styles';

const OptimizedYears = lifecycle({
	shouldComponentUpdate({ items, activeYear }) {
		return items.length !== this.props.items.length
			|| activeYear !== this.props.activeYear;
	},
})(({ items, activeYear, onClick }) => {
	const yearHeight = (100 / items.length);
	return (
		<YearsContainer>
			{items.map(({
				id,
				year,
				density,
				count,
			}) => (
				<Year
					key={id}
					density={density}
					height={yearHeight}
					isActive={activeYear === year}
					onClick={() => onClick(year)}
				>
					<YearTooltip>
						<YearName>{year}</YearName>
						<YearCount>{count}</YearCount>
					</YearTooltip>
				</Year>
			))}
		</YearsContainer>
	);
});

const OptimizedDates = lifecycle({
	shouldComponentUpdate({ years }) {
		return years.length !== this.props.years.length;
	},
})(({ years, items }) => (
	<DatesContainer>
		{years.map((year) => (
			<Date key={year} h={(100 / items.length)}>{year}</Date>
		))}
	</DatesContainer>
));

const getYears = (items) => items.map(({ year }) => year);

const Minimap = ({
	items,
	isLoading,
	activeYear,
	onClick,
}) => (
	<OuterContainer className="tour-minimap">
		<InnerContainer>
			<Content>
				<OptimizedYears items={items} activeYear={activeYear} onClick={onClick} />
			</Content>
			{!isLoading && (
				<OptimizedDates years={getYears(items)} items={items} />
			)}
		</InnerContainer>
	</OuterContainer>
);

Minimap.propTypes = {
	items: PropTypes.arrayOf(PropTypes.shape({
		id: PropTypes.string.isRequired,
		density: PropTypes.number.isRequired,
	})),
	isLoading: PropTypes.bool,
	activeYear: PropTypes.string,
	onClick: PropTypes.func,
};

Minimap.defaultProps = {
	isLoading: false,
	items: [],
	activeYear: undefined,
	onClick: () => {},
};

export default Minimap;
