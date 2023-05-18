import { AppBar, Toolbar, Typography, IconButton, Link, Box, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import TwitterIcon from '@mui/icons-material/Twitter';
import { useTranslation } from '../hooks/useTranslation'


const Header = () => {
	const {locale, changeLanguage} = useTranslation()
	const handleChangeLanguage = (event: SelectChangeEvent<string>) => {
		changeLanguage(event.target.value)
	}
	return (
		<AppBar position="static">
			<Toolbar>
				<Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
					Make Tweet From RSS
				</Typography>
				<Box>
					<Select
						value={locale}
						onChange={handleChangeLanguage}
					>
						<MenuItem value="en">🇺🇸 English</MenuItem>
						<MenuItem value="ja">🇯🇵 日本語</MenuItem>
					</Select>
				</Box>
				<IconButton color="inherit" component={Link} href="https://github.com/nariakiiwatani/TweetByRSS">
					<GitHubIcon />
				</IconButton>
				<IconButton color="inherit" component={Link} href="https://twitter.com/nariakiiwatani">
					<TwitterIcon />
				</IconButton>
				<Link href="https://www.buymeacoffee.com/nariakiiwatani" target="_blank">
					<img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style={{ height: '28px', width: '101px', marginLeft: '10px' }} />
				</Link>
			</Toolbar>
		</AppBar>
	);
}

export default Header;
