import React from 'react';
import {Text} from 'ink';
import Spinner from 'ink-spinner';

export const LoadingSpinner = ({text}: {text: string}) => (
	<>
		<Text color="green">
			<Spinner type="dots" />
		</Text>
		<Text> {text}</Text>
	</>
);
