import { useState, useEffect } from 'react';
import RSSFeedInput from './components/RSSFeedInput';
import TemplateEditor from './components/TemplateEditor';
import SelectItem from './components/SelectItem';
import Preview from './components/Preview';
import CopyButton from './components/CopyButton';
import TweetButton from './components/TweetButton';

import { XMLParser } from 'fast-xml-parser';

const parser = new XMLParser({
	attributeNamePrefix: "@",
	ignoreAttributes: false
})

function App() {
	const [feed_url, setFeedUrl] = useState(() => localStorage.getItem('feed_url') || '');
	const [rss, setRSS] = useState<any>(null);
	const [item_index, setItemIndex] = useState(0)
	const [template, setTemplate] = useState(() => localStorage.getItem('template') || '');
	const [preview_text, setPreviewText] = useState('');

	const handleFetchFeed = (rss:string) => {
		setRSS(parser.parse(rss).rss)
	}

	useEffect(() => { localStorage.setItem('feed_url', feed_url); }, [feed_url]);
	useEffect(() => { localStorage.setItem('template', template); }, [template]);

	return (
		<div className="App">
			<p>https://anchor.fm/s/44c1d13c/podcast/rss</p>
			<p>https://your-voice-is-yours.com/rss/d005ba73-3f0a-40ed-8e8f-6c110ad35dca</p>
			<RSSFeedInput feed_url={feed_url} setFeedUrl={setFeedUrl} onResult={handleFetchFeed} />
			<TemplateEditor value={template} rss={rss} onChange={setTemplate} />
			<SelectItem rss={rss} onChange={setItemIndex} />
			<Preview template={template} rss={rss} item_index={item_index} onChange={setPreviewText} />
			<CopyButton value={preview_text} />
			<TweetButton value={preview_text} />
		</div>
	);
}

export default App;
