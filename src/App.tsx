import { useState, useEffect } from 'react';
import RSSFeedInput from './components/RSSFeedInput';
import TemplateEditor from './components/TemplateEditor';
import SelectItem from './components/SelectItem';
import Preview from './components/Preview';
import CopyButton from './components/CopyButton';
import TweetButton from './components/TweetButton';
import Header from './components/Header'

import { Box, Paper, Typography } from '@mui/material'

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
			<Header />
			<Box sx={{ margin: 2 }}>
				<Paper elevation={2} sx={{ padding: 2, marginBottom: 2 }}>
					<Typography variant="h5" gutterBottom>RSSフィードのURLを入力</Typography>
					<RSSFeedInput feed_url={feed_url} setFeedUrl={setFeedUrl} onResult={setRSS} />
				</Paper>

				<Paper elevation={2} sx={{ padding: 2, marginBottom: 2 }}>
					<Typography variant="h5" gutterBottom>ツイート内容を編集</Typography>
					<TemplateEditor value={template} rss={rss} onChange={setTemplate} />
				</Paper>

				<Paper elevation={2} sx={{ padding: 2, marginBottom: 2 }}>
					<Typography variant="h5" gutterBottom>反映するエピソードを選択</Typography>
					<SelectItem rss={rss} onChange={setItemIndex} />
				</Paper>

				<Paper elevation={2} sx={{ padding: 2, marginBottom: 2 }}>
					<Typography variant="h5" gutterBottom>プレビュー</Typography>
					<Preview template={template} rss={rss} item_index={item_index} onChange={setPreviewText} />
				</Paper>

				<Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
					<TweetButton value={preview_text} />
					<CopyButton value={preview_text} />
				</Box>
			</Box>
		</ThemeProvider>
	);
}

export default App;
