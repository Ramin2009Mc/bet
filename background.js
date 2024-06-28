let frozenTabs = []
let freezeInterval

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (request.action === 'startFreezing') {
		startFreezing(request.url, request.amount)
	} else if (request.action === 'stopFreezing') {
		stopFreezing()
	} else if (request.action === 'openFrozenTab') {
		openFrozenTab()
	}
})

function startFreezing(url, amount) {
	freezeInterval = setInterval(() => {
		chrome.tabs.create({ url }, tab => {
			const freezeStartTime = Date.now()
			setTimeout(() => {
				chrome.tabs.update(tab.id, {
					url: `chrome://discards/?action=freeze&id=${tab.id}`,
				})
				frozenTabs.push({ tabId: tab.id, freezeStartTime })
			}, 3000) // Adjust timing as needed
		})
	}, 5000)
}

function stopFreezing() {
	clearInterval(freezeInterval)
	frozenTabs.forEach(tab => {
		chrome.tabs.remove(tab.tabId)
	})
	frozenTabs = []
}

function openFrozenTab() {
	const now = Date.now()
	const suitableTab = frozenTabs.find(tab => {
		const freezeTime = now - tab.freezeStartTime
		return freezeTime >= 7000 && freezeTime <= 12000
	})

	if (suitableTab) {
		chrome.tabs.update(suitableTab.tabId, { active: true })
		frozenTabs = frozenTabs.filter(tab => tab.tabId !== suitableTab.tabId)
	}
}
