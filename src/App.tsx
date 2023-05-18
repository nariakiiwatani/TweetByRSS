import { useState, useEffect, useCallback, useMemo } from 'react';
import RSSFeedInput from './components/RSSFeedInput';
import TemplateEditor from './components/TemplateEditor';
import SelectItem from './components/SelectItem';
import Preview from './components/Preview';
import CopyButton from './components/CopyButton';
import TweetButton from './components/TweetButton';
import Header from './components/Header'

import { Box, Paper, Typography, Select, MenuItem, Button, Grid } from '@mui/material'
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
	const { t } = useTranslation('index')

	const record = useStorage<{title:string,template:string}>('record')
	const current = useStorage<string>('current')

	const [feed_url, setFeedUrl] = useState(() => current.get('url') || '');
	const [rss, setRSS] = useState<any>(null);
	const [episode_index, setEpisodeIndex] = useState(0)
	const [template, setTemplate] = useState(() => record.get(feed_url)?.template || '');
	const [preview_text, setPreviewText] = useState('');

	const handleRssChange = useCallback((url: string, rss:any) => {
		setRSS(rss)
		const title = rss?.channel?.title
		if(title) {
			current.set('url', url)
			record.set(url, prev=>({...prev, title}))
			const template = record.get(url)?.template
			if(template) {
				setTemplate(template)
			}
			setEpisodeIndex(0)
		}
	}, [current.set, setRSS, record.set, record.get, setEpisodeIndex])

	const handleSelectRecord = useCallback((url:string) => {
		setFeedUrl(url)
	}, [setFeedUrl])

	const handleRemoveRecord = useCallback(() => {
		const url = current.get('url')
		current.remove('url')
		setFeedUrl('')
		if(url) {
			record.remove(url)
		}
	}, [current.get, current.remove, setFeedUrl, record.remove])

	useEffect(() => {
		const url = current.get('url')
		if(url) {
			record.set(url, prev=>({...prev, template}))
		}
	}, [template, current.get, record.set])

	const record_items = useMemo(() => Object.entries(record.data), [record.data])

	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<Header />
			<Box sx={{ margin: 2 }}>
				<Paper elevation={2} sx={{ padding: 2, marginBottom: 2 }}>
					<Grid container spacing={2}>
						<Grid item xs={12} md={4} container>
							<Grid item xs={6}>
								<Typography variant="h5" gutterBottom>
									{t.select_channel}
								</Typography>
							</Grid>
							<Grid item xs={6}>
								{current.get('url') && <>
									<Button
										variant='contained'
										color='error'
										onClick={handleRemoveRecord}
									>{t.delete_channel}</Button>
								</>}
							</Grid>
							<Grid item xs={12}>
								<Select fullWidth value={current.get('url')||'label'}>
									<MenuItem key={'label'} value='label'>---{t.select_channel}---</MenuItem>
									{record_items.map(([url,{title}]) => <MenuItem key={url} value={url} onClick={()=>handleSelectRecord(url)}>{title}</MenuItem>)}
								</Select>
							</Grid>
						</Grid>
						<Grid item xs={8} md={6} container>
							<Grid item xs={12}>
								<Typography variant="h5" gutterBottom>{t.input_rss}</Typography>
							</Grid>
							<Grid item xs={12}>
								<RSSFeedInput feed_url={feed_url} setFeedUrl={setFeedUrl} onResult={handleRssChange} />
							</Grid>
						</Grid>
					</Grid>
				</Paper>
				<Paper elevation={2} sx={{ padding: 2, marginBottom: 2 }}>
					<Typography variant="h5" gutterBottom>{t.edit_template}</Typography>
					<TemplateEditor disabled={!rss} value={template} rss={rss} onChange={setTemplate} />
				</Paper>

				<Paper elevation={2} sx={{ padding: 2, marginBottom: 2 }}>
					<Typography variant="h5" gutterBottom>{t.select_episode}</Typography>
					<SelectItem rss={rss} value={episode_index} onChange={setEpisodeIndex} />
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
