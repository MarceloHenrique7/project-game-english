const input = document.querySelector('.login-input');
const password = document.querySelector('.password-input');
const button = document.querySelector('.button-input-disabled')

function validateInput() {
    if (input.value.length > 4 && password.value.length > 4) {
        button.classList.remove('button-input-disabled');
        button.classList.add('button-input-enabled');
    } else {
        button.classList.remove('button-input-enabled');
        button.classList.add('button-input-disabled');
    }
}
   

input.addEventListener('input', validateInput);
password.addEventListener('input', validateInput);

