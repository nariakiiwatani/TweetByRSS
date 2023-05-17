import React, { useState, useEffect, useRef } from 'react';

type TemplateEditorProps = {
	value: string;
	rss: any;
	onChange: (value: string) => void;
};

const TemplateEditor: React.FC<TemplateEditorProps> = ({ value: propsValue, rss, onChange }) => {
	const [value, setValue] = useState(propsValue);
	const [elements, setElements] = useState<string[]>([]);
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	useEffect(() => {
		if (value !== propsValue) {
			setValue(propsValue);
		}
	}, [propsValue]);

	useEffect(() => {
		onChange(value);
	}, [value, onChange]);

	const getElements = (obj: any, path: string = ''): string[] => {
		return Object.entries(obj)
			.reduce((elements, [key, value]) => {
				const newPath = key.startsWith("@") ? `${path}${key}` : path ? `${path}.${key}` : key;
				if (typeof value === 'object' && value !== null) {
					return [...elements, ...getElements(value as any, newPath)];
				}
				return [...elements, newPath];
			}, [] as string[]);
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

	return (
		<div>
			<textarea value={value} onChange={e => setValue(e.target.value)} ref={textareaRef} />
			{elements.map((element, index) => (
				<button key={index} onClick={() => handleButtonClick(element)}>
					{element}
				</button>
			))}
		</div>
	);
};

export default TemplateEditor;
