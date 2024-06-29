chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (request.action === 'placeBet') {
	  const betAmountInput = document.querySelector('input[name="bet_value"]');
	  if (betAmountInput) {
		betAmountInput.value = request.amount;
	  }
  
	  const placeBetButton = document.querySelector('button[name="submit_bet"]');
	  if (placeBetButton) {
		placeBetButton.click();
	  }
	}
  });