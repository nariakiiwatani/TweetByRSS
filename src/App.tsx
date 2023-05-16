import React, { useState, useEffect } from 'react';

// 型定義
export type RSSFeed = {
	url: string;
	template: string;
};

function App() {
	// ステートの設定
	const [feed, setFeed] = useState<RSSFeed>({ url: '', template: '' });
	const [selectedElement, setSelectedElement] = useState<string>('');
	const [previewText, setPreviewText] = useState<string>('');

	useEffect(() => {
		// TODO: localStorageからデータを取得し、ステートをセットする
	}, []);

	return (
		<div className="App">
			{/* TODO: 各コンポーネントをここに作成 */}
		</div>
	);
}

export default App;
