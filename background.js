let frozenTabs = [];
let freezeInterval;
const freezeDelay = 3000;  // 3 seconds delay before freezing a tab
const checkInterval = 5000;  // 5 seconds interval for freezing tabs
const maxTabs = 10;  // Maximum number of tabs allowed

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'startFreezing') {
        startFreezing(request.url, request.amount);
    } else if (request.action === 'stopFreezing') {
        stopFreezing();
    } else if (request.action === 'openFrozenTab') {
        openFrozenTab();
    }
});

function startFreezing(url, amount) {
    if (frozenTabs.length < maxTabs) {
        freezeInterval = setInterval(() => {
            chrome.tabs.create({ url }, tab => {
                setTimeout(() => {
                    chrome.tabs.update(tab.id, {
                        url: `chrome://discards/?action=freeze&id=${tab.id}`
                    }).catch(error => console.error('Failed to update tab:', error));
                    frozenTabs.push({ tabId: tab.id, freezeStartTime: Date.now() });
                }, freezeDelay);
            });
        }, checkInterval);
    }
}
function stopFreezing() {
    clearInterval(freezeInterval);
    const now = Date.now();
    frozenTabs.forEach(tab => {
        const lifeTime = now - tab.freezeStartTime;
        if (lifeTime > 12000) {  // 12 seconds
            chrome.tabs.remove(tab.tabId).catch(error => console.error('Failed to remove tab:', error));
        }
    });
    frozenTabs = frozenTabs.filter(tab => (Date.now() - tab.freezeStartTime) <= 12000);
}

function openFrozenTab() {
    const now = Date.now();
    const suitableTab = frozenTabs.find(tab => {
        const freezeTime = now - tab.freezeStartTime;
        return freezeTime >= 7000 && freezeTime <= 12000;
    });

    if (suitableTab) {
        chrome.tabs.update(suitableTab.tabId, { active: true }).catch(error => console.error('Failed to activate tab:', error));
        frozenTabs = frozenTabs.filter(tab => tab.tabId !== suitableTab.tabId);
    }
}
