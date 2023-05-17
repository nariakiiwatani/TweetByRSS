import React from 'react';
import { Button } from '@mui/material'
import { useTranslation } from '../hooks/useTranslation';

type TweetButtonProps = {
	value: string;
};

const TweetButton: React.FC<TweetButtonProps> = ({ value }) => {
	const { t } = useTranslation('tweet')

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
			>{t.button}</Button>
		</div>
	)

};

export default TweetButton;
