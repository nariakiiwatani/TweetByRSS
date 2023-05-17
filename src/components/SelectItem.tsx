import React, { useState, useEffect } from 'react';
import { FormControl, Select, MenuItem, SelectChangeEvent } from '@mui/material';

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

	const handleChange = (event: SelectChangeEvent<string>) => {
		const selectedIndex = Number(event.target.value);
		setSelectedItemIndex(selectedIndex);
		onChange(selectedIndex);
	};

	return (
		<FormControl fullWidth>
		<Select
			onChange={handleChange}
			defaultValue='0'
		>
			{channel?.item && channel.item.map((item:any, index:number) => (
				<MenuItem key={index} value={index}>
					{item.title}
				</MenuItem>
			))}
		</Select>
		</FormControl>);
};

export default SelectItem;
