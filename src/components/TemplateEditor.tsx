import React, { useState, useEffect, useRef } from 'react';
import { TextField, Grid, Typography, Button, Box } from '@mui/material';
import { Select, MenuItem, SelectChangeEvent } from '@mui/material';
import { useTranslation } from '../hooks/useTranslation'
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'

type TemplateSelectorProps = {
	index: number
	length: number
	onNext: () => void
	onPrevious: () => void
}
export const TemplateSelector = ({ index, length, onNext, onPrevious }: TemplateSelectorProps) => {
	const button_style = {
		sx: {
		}
	}
	return (<Box>
		<Button
			{...button_style}
			onClick={onPrevious}
			variant='text'
			disabled={index===0}
		><NavigateBeforeIcon /></Button>
		<span>{`${index + 1}`}</span>
		<Button
			{...button_style}
			onClick={onNext}
			variant='text'
			disabled={index>=length-1}
		><NavigateNextIcon /></Button>
		<span> of </span>
		<span>{`${length}`}</span>
	</Box>)
}

export const useTemplateEditor = (defaultValue: string|(()=>string)) => {
	const [value, setValue] = useState(defaultValue)
	return {
		value,
		change: setValue
	}
}

type TemplateEditorProps = {
	value: string;
	rss: any;
	disabled?: boolean;
	onChange: (value: string) => void;
	Selector: React.ReactNode
};

const TemplateEditor: React.FC<TemplateEditorProps> = ({ value, rss, disabled, onChange, Selector }) => {
	const { t } = useTranslation('editor')
	const [elements, setElements] = useState<{ path: string, value: any }[]>([]);
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	const getElements = (obj: any, path: string = ''): { path: string, value: any }[] => {
		return Object.entries(obj)
			.reduce((elements, [key, value]) => {
				const newPath = key.startsWith("@") ? `${path}${key}` : path ? `${path}.${key}` : key;
				if (typeof value === 'object' && value !== null) {
					return [...elements, ...getElements(value as any, newPath)];
				}
				return [...elements, { path: newPath, value: typeof value === 'object' ? '[object]' : value }];
			}, [] as { path: string, value: any }[]);
	};
	useEffect(() => {
		if (!rss) return;
		try {
			const channel = { ...rss.channel }
			if (Array.isArray(channel.item)) {
				channel.item = channel.item[0]
			}
			setElements(getElements(channel));
		} catch (error) {
			console.error(error);
		}
	}, [rss]);

	const handleInsertSelect = (event: SelectChangeEvent<string>) => {
		const path = event.target.value
		const position = textareaRef.current?.selectionStart || 0;
		const insertValue = `[[${path}]]`
		const newValue = [value.slice(0, position), insertValue, value.slice(position)].join('');

		onChange(newValue);
		setTimeout(() => {
			if (textareaRef.current) {
				textareaRef.current.selectionStart =
					textareaRef.current.selectionEnd = position + insertValue.length;
			}
		}, 0);
	};
	const option = (element: { path: string, value: any }, index: number) => (
		<MenuItem key={index} value={element.path}>
			{element.path}: {element.value}
		</MenuItem>
	)
	return (
		<Grid container spacing={2} alignItems="flex-start" sx={{maxWidth:'100vw'}}>
			<Grid item xs={12} sm={6}>
				<TextField
					disabled={disabled}
					value={value}
					onChange={e => onChange(e.target.value)}
					multiline
					rows={6}
					variant="outlined"
					inputRef={textareaRef}
					fullWidth
				/>
				{Selector}
			</Grid>
			<Grid item xs={12} sm={6}>
				<Typography variant='h6' gutterBottom>{t.insert_from_rss}</Typography>
				<Select
					disabled={disabled}
					onChange={handleInsertSelect}
					value='label'
					fullWidth
				>
					<MenuItem value='label' disabled>{t.channel}</MenuItem>
					{elements.filter(e => !e.path.startsWith('item.')).map(option)}
				</Select>
				<Select
					disabled={disabled}
					onChange={handleInsertSelect}
					value='label'
					fullWidth
				>
					<MenuItem value='label' disabled>{t.episode}</MenuItem>
					{elements.filter(e => e.path.startsWith('item.')).map(option)}
				</Select>
			</Grid>
		</Grid>
	);
};

export default TemplateEditor;
