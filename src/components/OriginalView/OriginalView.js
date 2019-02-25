import React from 'react';
import PropTypes from 'prop-types';
import { pdfjs, Document, Page } from 'react-pdf';
import LoadingIndicator from '../LoadingIndicator';
import NodeSidebar from '../NodeSidebar';
import Errors from '../Errors';
import { LoadingContainer } from '../LoadingIndicator/styles';
import { Container, Content, ScrollContainer } from './styles';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const createPageKey = (idx) => ['page', idx].join('-');

const OriginalView = ({
	id,
	file,
	setErrors,
	stopLoading,
	isLoading,
	pagesCount,
	setPagesCount,
	errors,
}) => (
	<Container>
		<Errors errors={errors} />
		<LoadingContainer isLoading={isLoading}>
			<LoadingIndicator />
		</LoadingContainer>
		<NodeSidebar id={id} itemType="document" />
		{file && (
			<ScrollContainer>
				<Content>
					<Document
						file={file}
						loading=" "
						error=" "
						noData=" "
						renderMode="canvas"
						onLoadSuccess={({ _pdfInfo }) => {
							setPagesCount(_pdfInfo.numPages);
							stopLoading();
						}}
						onLoadError={(err) => {
							setErrors([err]);
							stopLoading([err]);
						}}
					>
						{[...Array(pagesCount)].map((_, idx) => (
							<Page
								key={createPageKey(idx)}
								pageNumber={idx + 1}
								loading=" "
								error=" "
								noData=" "
								renderInteractiveForms={false}
								renderTextLayer={false}
								renderAnnotationLayer={false}
							/>
						))}
					</Document>
				</Content>
			</ScrollContainer>
		)}
	</Container>
);

OriginalView.propTypes = {
	id: PropTypes.string.isRequired,
	file: PropTypes.string,
	setErrors: PropTypes.func,
	stopLoading: PropTypes.func,
	setPagesCount: PropTypes.func,
	pagesCount: PropTypes.number,
	isLoading: PropTypes.bool,
	errors: Errors.propTypes.errors,
};

OriginalView.defaultProps = {
	file: undefined,
	setErrors: () => undefined,
	stopLoading: () => undefined,
	setPagesCount: () => undefined,
	pagesCount: 0,
	isLoading: true,
	errors: Errors.defaultProps.errors,
};

export default OriginalView;
