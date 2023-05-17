import { useAsync } from 'react-use';

import { XMLParser } from 'fast-xml-parser';
import { TextField, CircularProgress } from '@mui/material';

const parser = new XMLParser({
	attributeNamePrefix: "@",
	ignoreAttributes: false
})

interface RSSFeedInputProps {
	feed_url: string;
	setFeedUrl: (url: string) => void;
	onResult: (rss: string) => void;
}

function RSSFeedInput({ feed_url, setFeedUrl, onResult }: RSSFeedInputProps) {
	const { loading, error } = useAsync(async () => {
		if (!feed_url) return;
		try {
			const response = await fetch(feed_url);
			const rss_string = await response.text()
			const rss = parser.parse(rss_string).rss
			onResult(rss);
		} catch (err) {
			console.error(err);
		}
	}, [feed_url, onResult]);

	return (
		<div>
			<TextField
				sx={{width: '80%'}}
				type="url"
				value={feed_url}
				onChange={(e) => setFeedUrl(e.target.value)}
				disabled={loading}
				label="Feed URL"
				variant="outlined"
			/>
			{loading && <CircularProgress />}
			{error && <span>Error: {error.message}</span>}
		</div>
	);
}

export default RSSFeedInput;
