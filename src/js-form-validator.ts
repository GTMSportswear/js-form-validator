import { closest } from './github/gtmsportswear/js-utilities@1.0.0/js-utilities';

export class FormValidator {
  
  /**
   * Validates a given input if validation attributes are present.
   * Validation attributes for inputs:
   *  - data-validate: type of validation rule to run against input
   *  - data-validate_message: message to display if rule returns false
   *  - data-empty_message: message to display if input is empty
   *  - data-empty_allowed: determines if an empty value is allowed or not
   *  - data-validate_message_id: used to put the validation message in a specific element
   * @param input
   * @return boolean True if validated, false otherwise.
   */
  public static validate(input: HTMLInputElement): boolean {
    if (undefined === input || null === input) return false;

    const type = input.getAttribute('data-validate'),
          wrap = closest(input, '.input-wrap'),
          inputId = input.getAttribute('data-validate_message_id');

    let inputValue = input.value,
        valid = 0,
        tooltip = '',
        invalidMsg = input.getAttribute('data-validate_message'),
        emptyMsg = input.getAttribute('data-empty_message');
    
    const allowEmptyAttribute = input.getAttribute('data-empty_allowed');
    let allowEmpty = (null !== allowEmptyAttribute && allowEmptyAttribute === '1');

    // check to see if we have both messages, if not, fill in other.
    if (null === invalidMsg && null !== emptyMsg && emptyMsg.length > 0)
      invalidMsg = emptyMsg;
    else if (null === emptyMsg && invalidMsg !== null && invalidMsg.length > 0)
      emptyMsg = invalidMsg;
    else if (null === emptyMsg && null === invalidMsg)
      emptyMsg = invalidMsg = 'Error';

    // if we are dealing with a checkbox, need to get on/off instead of value
    if (type === 'checkbox')
      inputValue = input.checked ? 'on' : 'off';

    if (type === 'checkbox-list') {
      const inputs = input.querySelectorAll('input[type="checkbox"]');
      let numChecked = 0;

      if (inputs.length <= 0) return false;

      Array.prototype.forEach.call(inputs, (i: HTMLInputElement) => {
        if (this.validate_rule('checkbox', i.checked))
          numChecked++;
      });

      if (numChecked > 0)
        valid = 1;
    }
    else {
      if (allowEmpty && !inputValue.length)
        valid = 1;
      else
        valid = this.validate_rule(type, inputValue);
    }
    
    if (valid > 0) {
      if (null === inputId) {
        wrap.classList.remove('error');
        wrap.querySelector('[class^="simptip"]').removeAttribute('data-tooltip');

        if (input.getAttribute('data-show_success') !== 'false')
          wrap.classList.add('approved');
      }
      else {
        const tt = document.getElementById(inputId);
        if (null !== tt) tt.removeAttribute('data-tooltip');
      }

      return true;
    }
    else {
      if (null === inputId) {
        wrap.classList.add('error');
        wrap.classList.remove('approved');
      }

      if (valid === 0)
        tooltip = invalidMsg;
      else
        tooltip = emptyMsg;
    }
    if (null === inputId) {
      const st = wrap.querySelector('[class^="simptip"]');
      if (null !== st) st.setAttribute('data-tooltip', tooltip);
    }
    else {
      const tt = document.getElementById(inputId);
      if (null !== tt) tt.setAttribute('data-tooltip', tooltip);
    }

    return false;
  }
  
  /**
   * Validates an entire form. Iterates through each element on the
   * given container and checks for the data-validate property. If
   * it exists, it will then perform validation on that element.
   * @param form Form node to validate
   * @return boolean True on complete validation, false otherwise.
   */
  public static validateForm(form: HTMLElement): boolean {
    if (undefined === form || null === form) return false;
    
    let invalidCount = 0;

    Array.prototype.forEach.call(form.querySelectorAll('[data-validate]'), input => {
      if (!this.validate(input))
        invalidCount++;
    });

    return invalidCount === 0;
  }

  /*
   * This method will allow you to set a error message directly
   * on an input without going through the validation process.
   */
  public static setInputError(input: HTMLElement, errorMsg: string): void {
    if (undefined === input || null === input) return;

    const wrap = closest(input, '.input-wrap');
    
    wrap.querySelector('[class^="simptip"]').setAttribute('data-tooltip', errorMsg);
    wrap.classList.add('error');
    wrap.classList.remove('approved');
  }

  /**
   * This method allows removal of validation styling without a page reload.
   * Useful for async environments.
   * @param input
   */
  public static removeInputFeedback(input: HTMLElement): void {
    if (undefined === input || null === input) return;
    let inputNode = <HTMLInputElement>input;

    const wrap = closest(input, '.input-wrap');
    if (undefined === wrap || null == wrap) return;

    wrap.classList.remove('error');
    wrap.classList.remove('approved');
    inputNode.value = '';
  }

  /**
   * Searches for all inputs with a data-validate class and adds validation event listeners.
   * @param context node to search upon.
   */
  public static addEventListeners(context: HTMLElement): void {
    if (undefined === context || null === context)
      context = document.body;
    
    const nodeList: HTMLElement[] = [];
    Array.prototype.forEach.call(context.querySelectorAll('input, select, textarea'), (el: HTMLElement) => {
      'input[type="submit"], input[type="button"], input[type="radio"]';
      if (el.tagName.toLowerCase() === 'input') {
        let type = el.getAttribute('type');

        if (null !== type) {
          type = type.toLocaleLowerCase();

          if (type === 'submit' || type === 'button' || type === 'radio')
            return;
        }
      }
      nodeList.push(el);
    });

    nodeList.forEach(node => {
      node.addEventListener('focus', e => {
        this.focusEvent(<HTMLElement>e.currentTarget);
      });
      node.addEventListener('blur', e => {
        this.blurEvent(<HTMLElement>e.currentTarget);
      });
    });

    // event to remove tooltips when the input gets focused and then to revalidate when blurred
    Array.prototype.forEach.call(context.querySelectorAll('input[data-validate], textarea[data-validate], select[data-validate]'), (input: HTMLElement) => {
      input.addEventListener('blur', e => {
        this.validate(<HTMLInputElement>e.currentTarget);
      });
      input.addEventListener('focus', function (e) {
        const wrap = closest(this, '.input-wrap'),
          wrapTip = wrap.querySelector('[class^="simptip"]');
        wrap.classList.remove('error');
        wrap.classList.remove('approved');

        if (null !== wrapTip)
          wrapTip.removeAttribute('data-tooltip');
      });
    });
    
    // focus on wrap select
    Array.prototype.forEach.call(context.querySelectorAll('.input-wrap'), (input: HTMLElement) => {
      input.addEventListener('click', function (e) {
        Array.prototype.forEach.call(this.querySelectorAll('input,select,textarea'), (el: HTMLElement) => {
          let type = el.getAttribute('type');

          if (null !== type) {
            type = type.toLocaleLowerCase();

            if (type === 'checkbox' || type === 'hidden' || type === 'file')
              return;

            el.focus();
          }
        });
      });
    });
  }

  /*
   * Event Listeners for Fancy Forms
   * These will go through on every page and look for
   * designated form inputs and fields and apply event
   * listeners to them.
   *
   * Make sure if any new logic is added to fancy forms,
   * to add a new event listener to this method or else
   * it will not get called on every page.
   */
  private static focusEvent(input: HTMLElement): void {
    closest(input, '.input-wrap').classList.add('active');
  }

  private static blurEvent(input: HTMLElement): void {
    closest(input, '.input-wrap').classList.remove('active');
  }

  /* All validate functions return an integer return:
      1: Validates true and is not empty.
      0: Not empty, but invalid.
      -1: empty
  */
  private static validate_rule(type, value): number {
    let status = 0;

    switch (type) {
      case 'email':
        if (!value.length) return -1;
        else if (value.length > 50) return 0;
        status = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value) ? 1 : 0;
        break;

      case 'password_old':
        status = value.length > 0 ? 1 : -1;
        break;

      case 'password':
        if (!value.length) return -1;
        status = /^(?=.*[a-zA-Z])(?=.*\d).{8,50}$/.test(value) ? 1 : 0;
        break;

      case 'name':
        if (!value.length) return -1;
        status = /^[A-Z0-9\-\,\.\'\& ]{2,36}$/i.test(value) ? 1 : 0;
        break;

      case 'dropdown':
        status = (undefined !== value && null !== value && value !== '0' && value.length > 0) ? 1 : 0;
        break;

      case 'addressStreet':
        status = (/^[0-9a-z\.\-\,\#\%\&\*\+\' ]+$/i.test(value)) ? 1 : 0;
        break;

      case 'addressStreetNoPO':
        if (this.validate_rule('addressStreet', value) === 1)
          status = (value.toLowerCase().split('.').join('').indexOf('po box') >= 0) ? 0 : 1;
        break;

      case 'city':
        if (!value.length) return -1;
        status = /^[A-Z0-9\#\'\&\.\- ]{2,20}$/i.test(value) ? 1 : 0;
        break;

      case 'zip':
        status = /^[0-9]{5}(\-|\+)?([0-9]{4})?$/.test(value) ? 1 : 0;
        break;

      case 'zip--canada':
        status = /^[ABCEGHJKLMNPRSTVXY]{1}\d{1}[A-Z]{1} *\d{1}[A-Z]{1}\d{1}$/.test(value) ? 1 : 0;
        break;

      case 'phone':
        let vals = value.split('x');
        for (let i = 0, l = vals.length; i < l; i++)
          vals[i] = vals[i].replace(/\D/g, '');
        value = vals.join('x').replace(/^1/, ''); // remove leading 1 if added, only for US
        status = /^[0-9x]{7,16}$/.test(value) ? 1 : 0;
        break;

      case 'file':
        status = value.length > 0 ? 1 : 0;
        break;

      case 'text':
        if (!value.length) status = -1;
        status = /^[A-Z0-9\-\.\,\'\"\_\(\)\*\&\^\%\$\#\@\!\+\[\]\=\{\}\:\;\?\\\/<> ]+$/im.test(value) ? 1 : 0;
        break;

      case 'checkbox':
        status = value;
        break;

      case 'creditcard':
        // will check against VISA, Discover, Amex, and MasterCard
        status = /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|6(?:0110[0-9]|011[2-4][0-9]|01174|0117[7-9]|0118[6-9]|0119[0-9]|4[4-9][0-9]{3}|5[0-9]{4})[0-9]{10})$/.test(value) ? 1 : 0;
        break;

      case 'creditcard-cvs':
        status = /^[0-9]{3,5}$/.test(value) ? 1 : 0;
        break;

      case 'ponumber':
        status = /^[0-9a-z \,\.\-\%\$\#\@\&\(\)\_]+$/i.test(value) ? 1 : 0;
        break;

      case 'promocode':
        status = /^[0-9a-z]+$/i.test(value) ? 1 : 0;
        break;

      default:
        status = 0;
    }
    return status;
  }
}