import React, { useEffect, useState } from 'react';

type PreviewProps = {
	template: string;
	rss: any;
	item_index: number;
	onChange: (value: string) => void;
};

const Preview: React.FC<PreviewProps> = ({ template, rss, item_index, onChange }) => {
	const [text, setText] = useState('')
	useEffect(() => {
		if (!rss) return;

		const channel = { ...rss.channel }
		if (channel.item && !Array.isArray(channel.item)) {
			channel.item = [channel.item]
		}

		let text = template;
		const matches = template.match(/\[\[.*?\]\]/g) || [];
		matches.forEach((match) => {
			let value = channel;
			const path = match.replaceAll('@', '.@').slice(2, -2).split('.');
			if(path[0] === 'item') {
				value = value.item[item_index]
				path.splice(0,1)
			}
			for (const key of path) {
				value = value[key];
				if (!value) break;
			}
			text = text.replace(match, value || '');
		});
		onChange(text);
		setText(text)
	}, [rss, template, item_index, onChange])

	return (
		<div>
			<div>{text}</div>
		</div>
	);
};

export default Preview;
