import { RSSFeed } from '../App'

function TemplateField({ feed, setFeed }: { feed: RSSFeed; setFeed: (feed: RSSFeed) => void }) {
	return (
		<textarea
			value={feed.template}
			onChange={
				(e) => setFeed({ ...feed, template: e.target.value })
			}
		/>
	);
}
export default TemplateField

