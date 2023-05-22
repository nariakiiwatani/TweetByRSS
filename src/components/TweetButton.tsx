import React, { useState, useEffect } from 'react';
import { Button, TextField, Grid } from '@mui/material'
import { useTranslation } from '../hooks/useTranslation';

function extractTweetId(input: string) {
	// If the input is just numeric characters, return it directly
	if (/^\d+$/.test(input)) {
		return input;
	}

	// Regular expression to match the tweet id in the URL
	const regex = /status\/(\d+)/;
	const match = input.match(regex);

	// If a match is found, return it. Otherwise, return null.
	if (match) {
		return match[1];
	} else {
		return null;
	}
}

const useTwitterStatusID = (id_or_url: string) => {
	const [status_id, setStatusID] = useState<string | null>(null)
	useEffect(() => {
		const result = extractTweetId(id_or_url)
		setStatusID(result)
	}, [id_or_url])
	return {
		status_id,
	}
}
const useInReplyToField = () => {
	const { t } = useTranslation(['tweet', 'reply'])
	const [value, setValue] = useState('')
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setValue(e.target.value)
	}
	const { status_id } = useTwitterStatusID(value)
	const is_error = !status_id && value !== ''
	const Field = (<TextField
		fullWidth
		size='small'
		label={t.label}
		value={value}
		onChange={handleChange}
		helperText={t.helper(status_id, is_error)}
		error={is_error}
	/>)
	return {
		status_id,
		Field
	}
}

type TweetButtonProps = {
	value: string;
};

const TweetButton: React.FC<TweetButtonProps> = ({ value }) => {
	const { t } = useTranslation('tweet')
	const { status_id: in_reply_to, Field: InputField } = useInReplyToField()

	const tweet = () => {
		const url = 'https://twitter.com/intent/tweet';
		const query = Object.entries({
			text: encodeURIComponent(value),
			in_reply_to
		}).filter(([_k, v]) => v && v !== '')
			.map(([k, v]) => `${k}=${v}`).join('&')
		console.info({ url, query })
		window.open(`${url}?${query}`, '_blank');
	};

	return (
		<div>
			<Grid container>
				<Grid item xs={12} md={6}>
					{InputField}
				</Grid>
			</Grid>
			<Button
				variant='contained'
				color='primary'
				onClick={tweet}
			>{t.button}</Button>
		</div>
	)

};

export default TweetButton;
