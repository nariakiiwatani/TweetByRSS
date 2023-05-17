// SelectItem.tsx
import React, { useState, useEffect } from 'react';

type SelectItemProps = {
	rss: any;
	onChange: (index: number) => void;
};

const SelectItem: React.FC<SelectItemProps> = ({ rss, onChange }) => {
	const [selectedItemIndex, setSelectedItemIndex] = useState(0);
	const [channel, setChannel] = useState<any>([]);

	useEffect(() => {
		if (!rss) return;
		try {
			const channel = { ...rss.channel }
			if(channel.item && !Array.isArray(channel.item)) {
				channel.item = [channel.item]
			}
			setChannel(channel);
		} catch (error) {
			console.error(error);
		}
	}, [rss, selectedItemIndex]);

	const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const selectedIndex = Number(e.target.value);
		setSelectedItemIndex(selectedIndex);
		onChange(selectedIndex);
	};

	return (
		<select value={selectedItemIndex} onChange={handleChange}>
			{channel?.item && channel.item.map((item:any, index:number) => (
				<option key={index} value={index}>
					{item.title}
				</option>
			))}
		</select>
	);
};

export default SelectItem;
