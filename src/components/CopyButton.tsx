import React from 'react';

type CopyButtonProps = {
	value: string;
};

const CopyButton: React.FC<CopyButtonProps> = ({ value }) => {
	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(value);
		} catch (err) {
			console.error('Failed to copy text');
		}
	};

	return <button onClick={handleCopy}>Copy to clipboard</button>;
};

export default CopyButton;
