document.getElementById('startButton').addEventListener('click', () => {
	const url = document.getElementById('betUrl').value
	const amount = document.getElementById('betAmount').value
	chrome.runtime.sendMessage({ action: 'startFreezing', url, amount })
})

document.getElementById('stopButton').addEventListener('click', () => {
	chrome.runtime.sendMessage({ action: 'stopFreezing' })
})

document.getElementById('openButton').addEventListener('click', () => {
	chrome.runtime.sendMessage({ action: 'openFrozenTab' })
})
