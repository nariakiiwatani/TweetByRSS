import { useState, useEffect } from 'react';
import RSSFeedInput from './components/RSSFeedInput';
import TemplateEditor from './components/TemplateEditor';
import SelectItem from './components/SelectItem';
import Preview from './components/Preview';
import CopyButton from './components/CopyButton';
import TweetButton from './components/TweetButton';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const theme = createTheme({
	palette: {
		mode: 'light',  // または 'dark'
		// その他のカスタム設定...
	},
	// その他のカスタム設定...
});
function App() {
	const [feed_url, setFeedUrl] = useState(() => localStorage.getItem('feed_url') || '');
	const [rss, setRSS] = useState<any>(null);
	const [item_index, setItemIndex] = useState(0)
	const [template, setTemplate] = useState(() => localStorage.getItem('template') || '');
	const [preview_text, setPreviewText] = useState('');

	useEffect(() => { localStorage.setItem('feed_url', feed_url); }, [feed_url]);
	useEffect(() => { localStorage.setItem('template', template); }, [template]);

	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<div className="App">
				<h1>RSSからツイート文を作成</h1>
				<h2>RSSフィードのURL</h2>
				<RSSFeedInput feed_url={feed_url} setFeedUrl={setFeedUrl} onResult={setRSS} />
				<h2>ツイート内容</h2>
				<TemplateEditor value={template} rss={rss} onChange={setTemplate} />
				<h2>プレビュー</h2>
				<SelectItem rss={rss} onChange={setItemIndex} />
				<Preview template={template} rss={rss} item_index={item_index} onChange={setPreviewText} />
				<TweetButton value={preview_text} />
				<CopyButton value={preview_text} />
			</div>
		</ThemeProvider>
	);
}

export default App;
