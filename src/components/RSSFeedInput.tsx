import { RSSFeed } from '../App'

function RSSFeedInput({ feed, setFeed }: { feed: RSSFeed; setFeed: (feed: RSSFeed) => void }) {
	return (
		<input
			type="url"
			value={feed.url}
			onChange={(e) => setFeed({ ...feed, url: e.target.value })}
		/>
	);
}
export default RSSFeedInput

