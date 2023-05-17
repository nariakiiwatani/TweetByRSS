import { useAsync } from 'react-use';

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
			onResult(await response.text());
		} catch (err) {
			console.error(err);
		}
	}, [feed_url, onResult]);

	return (
		<div>
			<input
				type="url"
				value={feed_url}
				onChange={(e) => setFeedUrl(e.target.value)}
				disabled={loading}
			/>
			{loading && <span>Loading...</span>}
			{error && <span>Error: {error.message}</span>}
		</div>
	);
}

export default RSSFeedInput;
