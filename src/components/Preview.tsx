import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';

function escapeHtml(unsafe: string) {
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
}

type PreviewProps = {
	template: string;
	rss: any;
	item_index: number;
	onChange: (value: string) => void;
};

const Preview: React.FC<PreviewProps> = ({ template, rss, item_index, onChange }) => {
	const [text, setText] = useState('')
	const [charCount, setCharCount] = useState(0);
	const urlRegex = /(https?:\/\/[^\s\u3000-\u30FF\uFF00-\uFFEF]+)/g;

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
			if (path[0] === 'item') {
				value = value.item[item_index]
				path.splice(0, 1)
			}
			for (const key of path) {
				value = value[key];
				if (!value) break;
			}
			text = text.replace(match, value || '');
		});

		text = escapeHtml(text);
		text = text.replace(/\n/g, '<br />');

		const urlMatches = text.match(urlRegex) || [] as string[];
		const urlLength = urlMatches.reduce((sum, url) => sum + url.length, 0);
		const url_in_tweet_size = 23;
		const adjustedLength = text.length - urlLength + urlMatches.length * url_in_tweet_size;
		setCharCount(adjustedLength);
		onChange(text);
		setText(text)
	}, [rss, template, item_index, onChange])

	return (
	<Box sx={{maxWidth:'100vw'}}>
		<Card variant="outlined">
			<CardContent>
				<Typography variant="body1" dangerouslySetInnerHTML={{__html:text}}></Typography>
			</CardContent>
		</Card>
		<Typography variant="caption" color="textSecondary">Twitter投稿時の文字数(たぶん): {charCount}</Typography>
	</Box>
	);
};

export default Preview;
