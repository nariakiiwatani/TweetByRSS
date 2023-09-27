import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { LanguageProvider } from './hooks/useTranslation.tsx'
import { BrowserRouter } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<React.StrictMode>
		<BrowserRouter>
			<LanguageProvider>
				<App />
			</LanguageProvider>
		</BrowserRouter>
	</React.StrictMode>,
)
