import React from 'react';
import { Button } from '@mui/material'

type TweetButtonProps = {
	value: string;
};

const TweetButton: React.FC<TweetButtonProps> = ({ value }) => {
	const tweet = () => {
		const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(value)}`;
		window.open(url, '_blank');
	};


	return (
		<div>
			<Button
				variant='contained'
				color='primary'
				onClick={tweet}
			>ツイート</Button>
		</div>
	)

};

export default TweetButton;
