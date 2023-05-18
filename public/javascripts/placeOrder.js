const addressInput = document.getElementById('addressInput');
const placeOrderButton = document.querySelector('.placeorder');

addressInput.addEventListener('change', function() {
  if (this.checked) {
    placeOrderButton.disabled = false;
  } else {
    placeOrderButton.disabled = true;
  }
});