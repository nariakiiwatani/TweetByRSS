export default {
	index: {
		select_channel: {
			en: 'Select Channel',
			ja: '番組を選択'
		},
		delete_channel: {
			en: 'delete',
			ja: '番組を削除'
		},
		input_rss: {
			en: 'Enter RSS Feed URL',
			ja: 'RSSフィードのURLを入力'
		},
		edit_template: {
			en: 'Edit Your Tweet',
			ja: 'ツイート内容を編集'
		},
		select_episode: {
			en: 'Select Episode to Use',
			ja: '反映するエピソードを選択'
		},
		preview: {
			en: 'Preview',
			ja: 'プレビュー'
		},
		confirm_delete: {
			en: 'Are you sure you want to delete this template?',
			ja: '本当にこのテンプレートを削除しますか？'
		},
		remove_tags: {
			en: 'Remove HTML Tags',
			ja: 'HTMLタグを除外'
		}
	},
	editor: {
		insert_from_rss: {
			en: 'Insert from RSS',
			ja: 'RSSから挿入'
		},
		channel: {
			en: 'Channel',
			ja: '番組情報'
		},
		episode: {
			en: 'Episode',
			ja: 'エピソード'
		}
	},
	tweet: {
		button: {
			en: 'Tweet',
			ja: 'ツイート'
		},
		reply: {
			label: {
				en: 'in reply to (optional)',
				ja: '返信先ツイート(オプション)'
			},
			helper: {
				en: (id:string|null, error:boolean) => error ? 'This is not an ID or a URL' : id ? `reply to: ${id}` : 'Enter Tweet ID or URL',
				ja: (id:string|null, error:boolean) => error ? 'IDやURLではないと思われる' : id ? `返信先ID: ${id}` : 'ツイートのURLかIDを入力'
			}
		}
	},
	preview: {
		limit: {
			en: 'Characters in Twitter posts (probably)',
			ja: 'Twitter投稿時の文字数(たぶん)'
		}
	},
	copy: {
		button: {
			en: 'Copy to Clipboard',
			ja: 'クリップボードにコピー'
		},
		pending: {
			en: 'Copying to clipboard...',
			ja: 'クリップボードにコピー中...'
		},
		success: {
			en: 'Copied to clipboard!',
			ja: 'コピーしました！'
		},
		fail: {
			en: 'Failed to copy text.',
			ja: 'コピーに失敗しました。'
		}
	}
};
