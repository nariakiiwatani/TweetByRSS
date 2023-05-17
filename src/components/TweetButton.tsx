import React from 'react';

type TweetButtonProps = {
	value: string;
};

const TweetButton: React.FC<TweetButtonProps> = ({ value }) => {
	const tweet = () => {
		const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(value)}`;
		window.open(url, '_blank');
	};

	return <button onClick={tweet}>Tweet</button>;
};

export default TweetButton;
