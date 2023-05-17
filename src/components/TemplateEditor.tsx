import React, { useState, useEffect, useRef } from 'react';
import { TextField, Grid, Typography } from '@mui/material';
import { Select, MenuItem, SelectChangeEvent } from '@mui/material';

type TemplateEditorProps = {
	value: string;
	rss: any;
	onChange: (value: string) => void;
};

const TemplateEditor: React.FC<TemplateEditorProps> = ({ value: propsValue, rss, onChange }) => {
	const [value, setValue] = useState(propsValue);
	const [elements, setElements] = useState<{ path: string, value: any }[]>([]);
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	useEffect(() => {
		if (value !== propsValue) {
			setValue(propsValue);
		}
	}, [propsValue]);

	useEffect(() => {
		onChange(value);
	}, [value, onChange]);

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

	const handleSelectChange = (event: SelectChangeEvent<string>) => {
		const path = event.target.value
		const position = textareaRef.current?.selectionStart || 0;
		const insertValue = `[[${path}]]`
		const newValue = [value.slice(0, position), insertValue, value.slice(position)].join('');

		setValue(newValue);
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
		<Grid container spacing={2} alignItems="center" sx={{maxWidth:'100vw'}}>
			<Grid item xs={12} sm={6}>
				<TextField
					value={value}
					onChange={e => setValue(e.target.value)}
					multiline
					rows={6}
					label="Template"
					variant="outlined"
					inputRef={textareaRef}
					fullWidth
				/>
			</Grid>
			<Grid item xs={12} sm={1}>
				<Typography variant="h4">&#8592;</Typography>
			</Grid>
			<Grid item xs={12} sm={5}>
				<Typography variant='h6'>RSSから挿入</Typography>
				<Select
					onChange={handleSelectChange}
					value='label'
					fullWidth
				>
					<MenuItem value='label' disabled>--- 番組情報 ---</MenuItem>
					{elements.filter(e => !e.path.startsWith('item.')).map(option)}
				</Select>
				<Select
					onChange={handleSelectChange}
					value='label'
					fullWidth
				>
					<MenuItem value='label' disabled>--- エピソード ---</MenuItem>
					{elements.filter(e => e.path.startsWith('item.')).map(option)}
				</Select>
			</Grid>
		</Grid>
	);
};

export default TemplateEditor;
