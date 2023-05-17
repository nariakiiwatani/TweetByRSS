import React, { useState, useEffect, useRef } from 'react';
import { XMLParser } from 'fast-xml-parser';

type TemplateEditorProps = {
	value: string;
	rss: string;
	onChange: (value: string) => void;
};

const parser = new XMLParser({
	attributeNamePrefix: "@",
	ignoreAttributes: false
})

const TemplateEditor: React.FC<TemplateEditorProps> = ({ value, rss, onChange }) => {
	const [elements, setElements] = useState<string[]>([]);
	const textareaRef = useRef<HTMLTextAreaElement>(null);

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
			const feedData = parser.parse(rss);
			const channel = { ...feedData.rss.channel }
			if(Array.isArray(channel.item)) {
				channel.item = channel.item[0]
			}
			setElements(getElements(channel));
		} catch (error) {
			console.error(error);
		}
	}, [rss]);

	const handleButtonClick = (path: string) => {
		const position = textareaRef.current?.selectionStart || 0;
		const newValue = [value.slice(0, position), `[[${path}]]`, value.slice(position)].join('');
		onChange(newValue);
	};

	return (
		<div>
			<textarea value={value} onChange={e => onChange(e.target.value)} ref={textareaRef} />
			{elements.map((element, index) => (
				<button key={index} onClick={() => handleButtonClick(element)}>
					{element}
				</button>
			))}
		</div>
	);
};

export default TemplateEditor;
