import { useState, useEffect, useCallback, useRef } from 'react'

import { XMLParser } from 'fast-xml-parser';
import { TextField, CircularProgress } from '@mui/material';

const parser = new XMLParser({
	attributeNamePrefix: "@",
	ignoreAttributes: false
})

interface RSSFeedInputProps {
	feed_url: string;
	setFeedUrl: (url: string) => void;
	onResult: (url: string, rss: any) => void;
}

function RSSFeedInput({ feed_url, setFeedUrl, onResult }: RSSFeedInputProps) {
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')
	const last_request = useRef('')
	const handleChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
		const url = e.target.value
		last_request.current = url
		setLoading(true)
		setFeedUrl(url)
		setError('')
		fetch(url)
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
	}, [parser, setFeedUrl, onResult, setLoading])
	useEffect(() => {
		if (feed_url) {
			handleChange({target:{value:feed_url}} as React.ChangeEvent<HTMLInputElement>)
		}
	}, [])

	return (
		<div>
			<TextField
				sx={{width: '80%'}}
				type="url"
				value={feed_url}
				onChange={handleChange}
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
