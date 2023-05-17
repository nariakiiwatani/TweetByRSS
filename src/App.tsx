import { useState, useEffect } from 'react';
import RSSFeedInput from './components/RSSFeedInput';
import TemplateEditor from './components/TemplateEditor';
import SelectItem from './components/SelectItem';
import Preview from './components/Preview';
import CopyButton from './components/CopyButton';
import TweetButton from './components/TweetButton';

function App() {
	const [feed_url, setFeedUrl] = useState(() => localStorage.getItem('feed_url') || '');
	const [rss, setRSS] = useState<any>(null);
	const [item_index, setItemIndex] = useState(0)
	const [template, setTemplate] = useState(() => localStorage.getItem('template') || '');
	const [preview_text, setPreviewText] = useState('');

	useEffect(() => { localStorage.setItem('feed_url', feed_url); }, [feed_url]);
	useEffect(() => { localStorage.setItem('template', template); }, [template]);

	return (
		<div className="App">
			<p>https://anchor.fm/s/44c1d13c/podcast/rss</p>
			<p>https://your-voice-is-yours.com/rss/d005ba73-3f0a-40ed-8e8f-6c110ad35dca</p>
			<h1>RSSからツイートを作成</h1>
			<h2>RSSフィードのURL</h2>
			<RSSFeedInput feed_url={feed_url} setFeedUrl={setFeedUrl} onResult={setRSS} />
			<h2>ツイート内容</h2>
			<TemplateEditor value={template} rss={rss} onChange={setTemplate} />
			<h2>使用するエピソード</h2>
			<SelectItem rss={rss} onChange={setItemIndex} />
			<h2>プレビュー</h2>
			<Preview template={template} rss={rss} item_index={item_index} onChange={setPreviewText} />
			<CopyButton value={preview_text} />
			<TweetButton value={preview_text} />
		</div>
	);
}

export default App;
