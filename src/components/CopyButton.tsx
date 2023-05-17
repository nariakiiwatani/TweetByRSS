import React, { useState } from 'react';
import { Button, Snackbar, Alert } from '@mui/material';
import { useTranslation } from '../hooks/useTranslation';

type CopyButtonProps = {
	value: string;
};

const CopyButton: React.FC<CopyButtonProps> = ({ value }) => {
	const { t } = useTranslation('copy')
	const [copyStatus, setCopyStatus] = useState<'idle' | 'copying' | 'completed' | 'error'>('idle');

	const handleCopy = async () => {
		try {
			setCopyStatus('copying');
			await navigator.clipboard.writeText(value);
			setCopyStatus('completed');
		} catch (err) {
			setCopyStatus('error');
			console.error('Failed to copy text');
		}
	};

	const handleClose = () => {
		setCopyStatus('idle');
	};

	return (
		<div>
			<Button
				variant='contained'
				color='secondary'
				onClick={handleCopy}
				disabled={copyStatus === 'copying'}
			>{t.button}</Button>
			<Snackbar open={copyStatus === 'copying'} autoHideDuration={6000} onClose={handleClose}>
				<Alert onClose={handleClose} severity="info" sx={{ width: '100%' }}>
					{t.pending}
				</Alert>
			</Snackbar>
			<Snackbar open={copyStatus === 'completed'} autoHideDuration={6000} onClose={handleClose}>
				<Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
					{t.success}
				</Alert>
			</Snackbar>
			<Snackbar open={copyStatus === 'error'} autoHideDuration={6000} onClose={handleClose}>
				<Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
					{t.fail}
				</Alert>
			</Snackbar>
		</div>
	);
};

export default CopyButton;
