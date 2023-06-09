import { useState, useRef } from 'react'
import { useAsync } from 'react-use'
import { XMLParser } from 'fast-xml-parser';
import { TextField, CircularProgress } from '@mui/material';

const parser = new XMLParser({
	attributeNamePrefix: "@",
	ignoreAttributes: false
})

const fetch_via_api = (url: string) => {
	const new_url = `https://publicpodcast.link/.netlify/functions/get_rss?url=${encodeURIComponent(url)}`
	return fetch(new_url)
}

interface RSSFeedInputProps {
	feed_url: string;
	setFeedUrl: (url: string) => void;
	onResult: (url: string, rss: any) => void;
}

function RSSFeedInput({ feed_url:url, setFeedUrl, onResult }: RSSFeedInputProps) {
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')
	const last_request = useRef('')

	useAsync(async () => {
		if (url) {
			last_request.current = url
			setLoading(true)
			setFeedUrl(url)
			setError('')
			fetch_via_api(url)
			.then(res => res.text())
			.then(str => parser.parse(str).rss)
			.then(rss=> {
				if(last_request.current === url) {
					onResult(url, rss)
				}
			})
			.catch(e => {
				if(last_request.current === url) {
					onResult(url, undefined)
					setError(e.message)
				}
			})
			.finally(() => {
				if(last_request.current === url) {
					setLoading(false)
				}
			})
		}
	}, [url])

	return (
		<div>
			<TextField
				fullWidth
				sx={{width: '80%'}}
				type="url"
				value={url}
				onChange={e=>setFeedUrl(e.target.value)}
				label="Feed URL"
				variant="outlined"
				error={error!==''}
				helperText={error}
			/>
			{loading && <CircularProgress />}
		</div>
	);
}

export default RSSFeedInput;
