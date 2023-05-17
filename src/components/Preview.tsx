import React, { useEffect, useState } from 'react';
import { XMLParser } from 'fast-xml-parser';

type PreviewProps = {
	template: string;
	rss: string;
	onChange: (value: string) => void;
};

const parser = new XMLParser({
	attributeNamePrefix: "@",
	ignoreAttributes: false
})

const Preview: React.FC<PreviewProps> = ({ template, rss, onChange }) => {
	const [selectedItemIndex, setSelectedItemIndex] = useState(0);
	const [channel, setChannel] = useState<any>([]);
	const [previewText, setPreviewText] = useState('');

	useEffect(() => {
		if (!rss) return;
		try {
			const feedData = parser.parse(rss);
			const channel = { ...feedData.rss.channel }
			if(channel.item && !Array.isArray(channel.item)) {
				channel.item = [channel.item]
			}
			setChannel(channel)
		} catch (error) {
			console.error(error);
		}
	}, [rss]);

	useEffect(() => {
		let text = template;
		const matches = template.match(/\[\[.*?\]\]/g) || [];
		matches.forEach((match) => {
			let value = channel;
			const path = match.replaceAll('@', '.@').slice(2, -2).split('.');
			if(path[0] === 'item') {
				value = value.item[selectedItemIndex]
				path.splice(0,1)
			}
			for (const key of path) {
				value = value[key];
				if (!value) break;
			}
			text = text.replace(match, value || '');
		});
		setPreviewText(text);
		onChange(text);
	}, [template, channel, selectedItemIndex, onChange]);

	return (
		<div>
			<select value={selectedItemIndex} onChange={e => setSelectedItemIndex(Number(e.target.value))}>
				{channel?.item && channel.item.map((item:any, index:number) => (
					<option key={index} value={index}>
						{item.title}
					</option>
				))}
			</select>
			<div>{previewText}</div>
		</div>
	);
};

export default Preview;
