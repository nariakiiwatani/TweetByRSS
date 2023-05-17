import { useState, useEffect } from 'react';
import RSSFeedInput from './components/RSSFeedInput';
import TemplateEditor from './components/TemplateEditor';
import Preview from './components/Preview';
import CopyButton from './components/CopyButton';
import TweetButton from './components/TweetButton';

function App() {
	// ステートの設定
	const [feed_url, setFeedUrl] = useState('');
	const [rss_string, setRssString] = useState('');
	const [template, setTemplate] = useState('');
	const [previewText, setPreviewText] = useState('');

	useEffect(() => {
		// TODO: localStorageからデータを取得し、ステートをセットする
	}, []);

//	console.info({feed_url, rss_string})

	return (
		<div className="App">
			<p>https://anchor.fm/s/44c1d13c/podcast/rss</p>
			<p>https://your-voice-is-yours.com/rss/d005ba73-3f0a-40ed-8e8f-6c110ad35dca</p>
			<RSSFeedInput feed_url={feed_url} setFeedUrl={setFeedUrl} onResult={setRssString} />
			<TemplateEditor value={template} rss={rss_string} onChange={setTemplate} />
			<Preview template={template} rss={rss_string} onChange={setPreviewText} />
			<CopyButton value={previewText} />
			<TweetButton value={previewText} />
		</div>
	);
}

export default App;
