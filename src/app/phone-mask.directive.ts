import { Directive, Input, ElementRef, Renderer2, OnInit, OnDestroy } from '@angular/core';
import { NgControl } from '@angular/forms';
import { Subscription } from 'rxjs';

@Directive({
    selector: '[formControlName][phoneMask]'
})
export class PhoneMaskDirective implements OnInit, OnDestroy {

    private _preValue: string;
    private sub: Subscription = new Subscription();

    @Input()
    set preValue(value: string) {
        this._preValue = value;
    }

    constructor(private el: ElementRef,
                private _phoneControl: NgControl,
                private renderer: Renderer2) { }

    ngOnInit() {
        this.phoneValidate();
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    phoneValidate() {
        this.sub = this._phoneControl.control.valueChanges.subscribe(data => {
            if (data) {
                const preInputValue: string = this._preValue ? this._preValue : '';
                const lastChar: string = preInputValue.substr(preInputValue.length - 1);
                let newVal: string = data.replace(/\D/g, '');
    
                let start = this.el.nativeElement.selectionStart;
                let end = this.el.nativeElement.selectionEnd;
    
                if (data.length < preInputValue.length) {
                    if (preInputValue.length < start) {
                        if (lastChar === ')') {
                            newVal = newVal.substr(0, newVal.length - 1);
                        }
                    }
                    if (newVal.length === 0) {
                        newVal = '+7 ';
                    } else if (newVal.length <= 4) {
                        newVal = newVal.replace(/^(\d{0,1})(\d{0,3})/, '+$1 ($2');
                    } else if (newVal.length <= 7) {
                        newVal = newVal.replace(/^(\d{0,1})(\d{0,3})(\d{0,3})/, '+$1 ($2) $3');
                    } else if (newVal.length <= 9) {
                        newVal = newVal.replace(/^(\d{0,1})(\d{0,3})(\d{0,3})(\d{0,2})/, '+$1 ($2) $3-$4');
                    } else {
                        newVal = newVal.replace(/^(\d{0,1})(\d{0,3})(\d{0,3})(\d{0,2})(.*)/, '+$1 ($2) $3-$4-$5');
                    }
    
                    this._phoneControl.control.setValue(newVal, { emitEvent: false });
                    this.renderer.selectRootElement(this.el).nativeElement.setSelectionRange(start, end);
                } else {
                    const removedD = data.charAt(start);
                    if (newVal.length === 0) {
                        newVal = '+7 ';
                    } else if (newVal.length <= 4) {
                        newVal = newVal.replace(/^(\d{0,1})(\d{0,3})/, '+$1 ($2');
                    } else if (newVal.length <= 7) {
                        newVal = newVal.replace(/^(\d{0,1})(\d{0,3})(\d{0,3})/, '+$1 ($2) $3');
                    } else if (newVal.length <= 9) {
                        newVal = newVal.replace(/^(\d{0,1})(\d{0,3})(\d{0,3})(\d{0,2})/, '+$1 ($2) $3-$4');
                    } else {
                        newVal = newVal.replace(/^(\d{0,1})(\d{0,3})(\d{0,3})(\d{0,2})(.*)/, '+$1 ($2) $3-$4-$5');
                    }
                    if (preInputValue.length >= start) {
                        if (removedD === '(' || removedD === '-' || removedD === ' ') {
                            start += 1;
                            end += 1;
                        } else if (removedD === ')') {
                            start += 2;
                            end += 2;
                        }
                        this._phoneControl.control.setValue(newVal, { emitEvent: false });
                        this.renderer.selectRootElement(this.el).nativeElement.setSelectionRange(start, end);
                    } else {
                        this._phoneControl.control.setValue(newVal, { emitEvent: false });
                        this.renderer.selectRootElement(this.el).nativeElement.setSelectionRange(start + 2, end + 2);
                    }
                }
            }
        });
    }

}
