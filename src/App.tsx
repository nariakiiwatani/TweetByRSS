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

import { useTranslation } from './hooks/useTranslation'

const theme = createTheme({
	palette: {
		mode: 'light',
	},
});

function App() {
	const { t } = useTranslation('label')

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
					<Typography variant="h5" gutterBottom>{t.input_rss}</Typography>
					<RSSFeedInput feed_url={feed_url} setFeedUrl={setFeedUrl} onResult={setRSS} />
				</Paper>

				<Paper elevation={2} sx={{ padding: 2, marginBottom: 2 }}>
					<Typography variant="h5" gutterBottom>{t.edit_template}</Typography>
					<TemplateEditor value={template} rss={rss} onChange={setTemplate} />
				</Paper>

				<Paper elevation={2} sx={{ padding: 2, marginBottom: 2 }}>
					<Typography variant="h5" gutterBottom>{t.select_episode}</Typography>
					<SelectItem rss={rss} onChange={setItemIndex} />
				</Paper>

				<Paper elevation={2} sx={{ padding: 2, marginBottom: 2 }}>
					<Typography variant="h5" gutterBottom>{t.preview}</Typography>
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
