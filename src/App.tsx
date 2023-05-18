import { useState, useEffect, useCallback } from 'react';
import RSSFeedInput from './components/RSSFeedInput';
import TemplateEditor from './components/TemplateEditor';
import SelectItem from './components/SelectItem';
import Preview from './components/Preview';
import CopyButton from './components/CopyButton';
import TweetButton from './components/TweetButton';
import Header from './components/Header'

import { Box, Paper, Typography, Select, MenuItem, SelectChangeEvent, Button } from '@mui/material'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import { useTranslation } from './hooks/useTranslation'

const theme = createTheme({
	palette: {
		mode: 'light',
	},
});

const useStorage = <T,>(root:string) => {
	const [data, setData] = useState<{[key:string]:T}>(()=>JSON.parse(localStorage.getItem(root)??'{}'))
	const updateStorage = useCallback(() => {
		localStorage.setItem(root, JSON.stringify(data))
	}, [root, data])
	const get = useCallback((key: string) => {
		return data[key]??null
	}, [data])
	const set = useCallback((key: string, value:T|((t:T)=>T)) => {
		if(value instanceof Function) {
			setData(prev => ({...prev, [key]:value(prev[key])}))
		}
		else {
			setData(prev => ({...prev, [key]:value}))
		}
	}, [setData])
	const remove = useCallback((key: string) => {
		setData(prev => {
			const new_data = {...prev}
			delete new_data[key]
			return new_data
		})
	}, [setData])
	useEffect(() => {
		updateStorage()
	}, [data, updateStorage])
	return {data, get, set, remove}
}

function App() {
	const { t } = useTranslation('label')

	const record = useStorage<{title:string,template:string}>('record')
	const current = useStorage<string>('current')

	const [feed_url, setFeedUrl] = useState(() => current.get('url') || '');
	const [is_feed_valid, setIsFeedValid] = useState(false)
	const [rss, setRSS] = useState<any>(null);
	const [episode_index, setEpisodeIndex] = useState(0)
	const [template, setTemplate] = useState(() => record.get(feed_url)?.template || '');
	const [preview_text, setPreviewText] = useState('');

	const handleRssChange = useCallback((url: string, rss:any) => {
		if(!rss) {
			setIsFeedValid(false)
			return
		}
		const {title} = rss.channel
		current.set('url', url)
		setRSS(rss)
		record.set(url, prev=>({...prev, title}))
		setIsFeedValid(true)
	}, [current.set, setRSS, setIsFeedValid, record.set])

	const handleSelectRecord = useCallback((event: SelectChangeEvent<string>) => {
		const url = event.target.value
		current.set('url', url)
		setFeedUrl(url)
		const template = record.get(url)?.template
		if(template) {
			setTemplate(template)
		}
		setIsFeedValid(true)
	}, [current.set, setFeedUrl, record.get, setTemplate])

	const handleRemoveRecord = useCallback(() => {
		const url = current.get('url')
		current.remove('url')
		setFeedUrl('')
		setIsFeedValid(false)
		if(url) {
			record.remove(url)
		}
	}, [current.get, current.remove, setFeedUrl, setIsFeedValid, record.remove])

	useEffect(() => {
		const url = current.get('url')
		if(url) {
			record.set(url, prev=>({...prev, template}))
		}
	}, [template, current.get, record.set])

	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<Header />
			<Box sx={{ margin: 2 }}>
				<Select value={current.get('url')||'label'} onChange={handleSelectRecord}>
					<MenuItem disabled value='label'>---select channel---</MenuItem>
					{Object.entries(record.data).map(([url,{title}]) => <MenuItem value={url}>{title}</MenuItem>)}
				</Select>
				{current.get('url') && <Button onClick={handleRemoveRecord}>delete</Button>}
				<Paper elevation={2} sx={{ padding: 2, marginBottom: 2 }}>
					<Typography variant="h5" gutterBottom>{t.input_rss}</Typography>
					<RSSFeedInput feed_url={feed_url} setFeedUrl={setFeedUrl} onResult={handleRssChange} />
				</Paper>

				<Paper elevation={2} sx={{ padding: 2, marginBottom: 2 }}>
					<Typography variant="h5" gutterBottom>{t.edit_template}</Typography>
					<TemplateEditor disabled={!is_feed_valid} value={template} rss={rss} onChange={setTemplate} />
				</Paper>

				<Paper elevation={2} sx={{ padding: 2, marginBottom: 2 }}>
					<Typography variant="h5" gutterBottom>{t.select_episode}</Typography>
					<SelectItem rss={rss} onChange={setEpisodeIndex} />
				</Paper>

				<Paper elevation={2} sx={{ padding: 2, marginBottom: 2 }}>
					<Typography variant="h5" gutterBottom>{t.preview}</Typography>
					<Preview template={template} rss={rss} item_index={episode_index} onChange={setPreviewText} />
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
