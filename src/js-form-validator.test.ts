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

  assert.ok(FormValidator.Validate(inputElement));
});

QUnit.test('should pass phone validation with 10 digits', assert => {
  inputElement.setAttribute('type', 'tel');
  inputElement.setAttribute('data-validate', 'phone');
  inputElement.value = '1234567890';

  assert.ok(FormValidator.Validate(inputElement));
});

QUnit.test('should fail phone validation without 7 or 10 digits', assert => {
  inputElement.setAttribute('type', 'tel');
  inputElement.setAttribute('data-validate', 'phone');
  inputElement.value = '12345678';

  assert.notOk(FormValidator.Validate(inputElement));

  inputElement.value = '123456';

  assert.notOk(FormValidator.Validate(inputElement));
});

QUnit.test('should pass phone validation with 10 digits and characters', assert => {
  inputElement.setAttribute('type', 'tel');
  inputElement.setAttribute('data-validate', 'phone');
  inputElement.value = '(123) 456-7890';

  assert.ok(FormValidator.Validate(inputElement));
});

QUnit.test('should pass email validation with valid email', assert => {
  inputElement.setAttribute('type', 'text');
  inputElement.setAttribute('data-validate', 'email');
  inputElement.value = 'anonymous@gmail.com';

  assert.ok(FormValidator.Validate(inputElement));
});

QUnit.test('should fail email validation with more than 50 characters', assert => {
  inputElement.setAttribute('type', 'text');
  inputElement.setAttribute('data-validate', 'email');
  inputElement.value = 'anonymousanonymousanonymousanonymousanonymous@gmail.com';

  assert.notOk(FormValidator.Validate(inputElement));
});

QUnit.test('should fail email validation without At sign', assert => {
  inputElement.setAttribute('type', 'text');
  inputElement.setAttribute('data-validate', 'email');
  inputElement.value = 'anonymous';

  assert.notOk(FormValidator.Validate(inputElement));
});

QUnit.test('should fail email validation with special characters in domain', assert => {
  inputElement.setAttribute('type', 'text');
  inputElement.setAttribute('data-validate', 'email');
  inputElement.value = 'anonymous@gmail#.com';

  assert.notOk(FormValidator.Validate(inputElement));
});

QUnit.test('should fail checkbox validation when checked state is not set', assert => {
  inputElement.setAttribute('type', 'checkbox');
  inputElement.setAttribute('data-validate', 'checkbox');

  assert.notOk(FormValidator.Validate(inputElement));
});

QUnit.test('should fail checkbox validation when checked state set to false', assert => {
  inputElement.setAttribute('type', 'checkbox');
  inputElement.setAttribute('data-validate', 'checkbox');
  inputElement.checked = false;

  assert.notOk(FormValidator.Validate(inputElement));
  assert.notEqual(simptip.getAttribute('data-tooltip'), null);
  assert.ok(inputWrap.classList.contains('error'));
});

QUnit.test('should pass checkbox validation when checked state is set to true', assert => {
  inputElement.setAttribute('type', 'checkbox');
  inputElement.setAttribute('data-validate', 'checkbox');
  inputElement.checked = true;

  assert.ok(FormValidator.Validate(inputElement));
  assert.equal(simptip.getAttribute('data-tooltip'), null);
  assert.notOk(inputWrap.classList.contains('error'));
  assert.ok(inputWrap.classList.contains('approved'));
});

QUnit.test('should pass checkbox validation when checked state is not set and allowed empty attribute is set', assert => {
  inputElement.setAttribute('type', 'checkbox');
  inputElement.setAttribute('data-validate', 'checkbox');
  inputElement.setAttribute('data-empty_allowed', '1');

  assert.ok(FormValidator.Validate(inputElement));
  assert.equal(simptip.getAttribute('data-tooltip'), null);
  assert.notOk(inputWrap.classList.contains('error'));
  assert.ok(inputWrap.classList.contains('approved'));
});
