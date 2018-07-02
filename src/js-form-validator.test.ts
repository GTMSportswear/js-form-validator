import { FormValidator } from './js-form-validator';

let inputWrap: HTMLElement;
let inputElement: HTMLInputElement;
let simptip: HTMLElement;

QUnit.module('FormValidator', {
  beforeEach: () => {
    inputWrap = document.createElement('div');
    inputWrap.classList.add('input-wrap');

    inputElement = document.createElement('input');
    simptip = document.createElement('p');
    simptip.classList.add('simptip');

    inputWrap.appendChild(inputElement);
    inputWrap.appendChild(simptip);
  }
});

QUnit.test('should pass phone validation with 7 digits', assert => {
  inputElement.setAttribute('type', 'tel');
  inputElement.setAttribute('data-validate', 'phone');
  inputElement.value = '1234567';

  assert.equal(FormValidator.Validate(inputElement), true);
});

QUnit.test('should pass phone validation with 10 digits', assert => {
  inputElement.setAttribute('type', 'tel');
  inputElement.setAttribute('data-validate', 'phone');
  inputElement.value = '1234567890';

  assert.equal(FormValidator.Validate(inputElement), true);
});

QUnit.test('should fail phone validation without 7 or 10 digits', assert => {
  inputElement.setAttribute('type', 'tel');
  inputElement.setAttribute('data-validate', 'phone');
  inputElement.value = '12345678';

  assert.equal(FormValidator.Validate(inputElement), false);

  inputElement.value = '123456';

  assert.equal(FormValidator.Validate(inputElement), false);
});

QUnit.test('should pass phone validation with 10 digits and characters', assert => {
  inputElement.setAttribute('type', 'tel');
  inputElement.setAttribute('data-validate', 'phone');
  inputElement.value = '(123) 456-7890';

  assert.equal(FormValidator.Validate(inputElement), true);
});

QUnit.test('should pass email validation with valid email', assert => {
  inputElement.setAttribute('type', 'text');
  inputElement.setAttribute('data-validate', 'email');
  inputElement.value = 'anonymous@gmail.com';

  assert.equal(FormValidator.Validate(inputElement), true);
});

QUnit.test('should fail email validation with more than 50 characters', assert => {
  inputElement.setAttribute('type', 'text');
  inputElement.setAttribute('data-validate', 'email');
  inputElement.value = 'anonymousanonymousanonymousanonymousanonymous@gmail.com';

  assert.equal(FormValidator.Validate(inputElement), false);
});

QUnit.test('should fail email validation without At sign', assert => {
  inputElement.setAttribute('type', 'text');
  inputElement.setAttribute('data-validate', 'email');
  inputElement.value = 'anonymous';

  assert.equal(FormValidator.Validate(inputElement), false);
});

QUnit.test('should fail email validation with special characters in domain', assert => {
  inputElement.setAttribute('type', 'text');
  inputElement.setAttribute('data-validate', 'email');
  inputElement.value = 'anonymous@gmail#.com';

  assert.equal(FormValidator.Validate(inputElement), false);
});

QUnit.test('should fail checkbox validation when checked state is not set', assert => {
  inputElement.setAttribute('type', 'checkbox');
  inputElement.setAttribute('data-validate', 'checkbox');

  assert.equal(FormValidator.Validate(inputElement), false);
});

QUnit.test('should fail checkbox validation when checked state set to false', assert => {
  inputElement.setAttribute('type', 'checkbox');
  inputElement.setAttribute('data-validate', 'checkbox');
  inputElement.checked = false;

  assert.equal(FormValidator.Validate(inputElement), false);
  assert.notEqual(simptip.getAttribute('data-tooltip'), null);
  assert.equal(inputWrap.classList.contains('error'), true);
});

QUnit.test('should pass checkbox validation when checked state is set to true', assert => {
  inputElement.setAttribute('type', 'checkbox');
  inputElement.setAttribute('data-validate', 'checkbox');
  inputElement.checked = true;

  assert.equal(FormValidator.Validate(inputElement), true);
  assert.equal(simptip.getAttribute('data-tooltip'), null);
  assert.equal(inputWrap.classList.contains('error'), false);
  assert.equal(inputWrap.classList.contains('approved'), true);
});
