import React, { useState, useEffect } from 'react';
import { FormControl, Select, MenuItem, SelectChangeEvent } from '@mui/material';

type SelectItemProps = {
	value: number;
	rss: any;
	onChange: (index: number) => void;
};

const SelectItem: React.FC<SelectItemProps> = ({ value, rss, onChange }) => {
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
	}, [rss, setChannel]);

	const handleChange = (event: SelectChangeEvent<string>) => {
		const selectedIndex = Number(event.target.value);
		onChange(selectedIndex);
	};

	return (
		<FormControl fullWidth>
		<Select
			onChange={handleChange}
			value={`${value}`}
		>
			{channel?.item ? channel.item.map((item:any, index:number) => (
				<MenuItem key={index} value={index}>
					{item.title}
				</MenuItem>
			)) : <MenuItem value='0'>---</MenuItem>}
		</Select>
		</FormControl>);
};

export default SelectItem;
