function RSSDropdown({ setSelectedElement }: { setSelectedElement: (element: string) => void }) {
	// TODO: RSS要素を取得し、ドロップダウンリストを作成する
	return <select onChange={(e) => setSelectedElement(e.target.value)} />;
}
export default RSSDropdown

