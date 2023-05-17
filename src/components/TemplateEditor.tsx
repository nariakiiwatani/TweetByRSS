import React, { useState, useEffect, useRef } from 'react';

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

	const handleButtonClick = (path: string) => {
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
	const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		handleButtonClick(event.target.value);
	};
	const option = (element: { path: string, value: any }, index: number) => (
		<option key={index} value={element.path}>
			{element.path}: {element.value}
		</option>
	)
	return (
		<div>
			<div>
				<textarea value={value} onChange={e => setValue(e.target.value)} ref={textareaRef} />
			</div>
			<h3>RSSの内容を追加</h3>
			<select onChange={handleSelectChange} value={0}>
				<option>--- 番組情報 ---</option>
				{elements.filter(e => !e.path.startsWith('item.')).map(option)}
			</select>
			<select onChange={handleSelectChange} value={0}>
				<option>--- エピソード ---</option>
				{elements.filter(e => e.path.startsWith('item.')).map(option)}
			</select>
		</div>
	);
};

export default TemplateEditor;
