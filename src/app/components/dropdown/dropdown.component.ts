import {
    Component, OnInit, ViewEncapsulation,
    OnDestroy, Input, Output,
    Renderer, EventEmitter
} from '@angular/core';
import {DomUtil} from './dom-handler.service';
import { Router } from '@angular/router';

@Component({
    selector: 'dropdown',
    template: `
        <div class="ui-dropdown-container" #container
            (mouseenter)="onDropdownHandler($event, dropdown, container)"
            (mouseleave)="onMouseLeave($event, dropdown, container)"
            (click)="onDropdownHandler($event, dropdown, container)">
            <ng-content></ng-content>
            <div class="ui-dropdown" #dropdown
                [style.display]="dropdownVisible ? 'block' : 'none'"
                [style.max-height]="_maxHeight">
                <ul class="ui-dropdown-items">
                    <li class="ui-dropdown-item" *ngFor="let item of dataSource"
                        [class.active]="item===chosen"
                        [style.min-width.px]="width">
                        <a [href]="item.url" 
                        [ngClass]="{'ui-dropdown-item-link':true,
                        'ui-dropdown-item-disabled':item.disabled}" 
                        (click)="itemClick($event,item)"
                        [style.color]="item.color">
                            <span class="ui-dropdown-item-text">{{item.label}}</span>
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    `,
    styleUrls: ['./dropdown.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class DropdownComponent implements OnInit, OnDestroy {
    // 触发方式
    @Input()
    public trigger: string;
    // 选项的宽度
    @Input()
    public width: number;
    // 数据源
    @Input()
    public dataSource: any[];
    @Input()
    public set maxHeight(data: number | string) {
        if (typeof data === 'number') {
            this._maxHeight = data + 'px';
        }
    }
    @Output()
    public selectChange: EventEmitter<any> = new EventEmitter();
    // 传递到父组件
    @Output()
    public getDropdownVisible: EventEmitter<any> = new EventEmitter();
    @Input()
    public chosen: any;

    public dropdownVisible: boolean = false;
    public _maxHeight: string;
    private isOpen: boolean = false;
    private documentClickListener: any;

    constructor(
        private renderer: Renderer,
        private router: Router
    ) { }

    public ngOnInit() {
        // pass
    }

    public ngOnDestroy() {
        this.unbindDocument();
    }

    public onMouseLeave(event: Event, dropdown: HTMLDivElement, container: Element) {
        if (!this.trigger || this.trigger === 'hover') {
            this.dropdownVisible = false;
            // 传递到父组件
            this.getDropdownVisible.emit(this.dropdownVisible);
        }
    }

    public onDropdownHandler(event: Event, dropdown: HTMLDivElement, container: Element) {
        if (!this.trigger
            || (this.trigger === 'hover' && event.type === 'mouseenter')
            || event.type === this.trigger) {
                event.stopPropagation();
                this.dropdownVisible = !this.dropdownVisible;
                DomUtil.relativePosition(dropdown, container); // disable for unknown bug
                // dropdown.style.top = '30px';
                // dropdown.style.left = '0';
                DomUtil.fadeIn(dropdown, 100);
                if (this.dropdownVisible) {
                    this.bindDocument();
                }
                // 传递到父组件
                this.getDropdownVisible.emit(this.dropdownVisible);
        }
    }

    public itemClick(event: Event, item: any)  {
        if (item.disabled) {
            event.preventDefault();
            return;
        }
        this.selectChange.emit(item);
        this.chosen = item;

        if (!item.url || item.routerLink) {
            event.preventDefault();
        }

        if (item.command) {
            let data = {
                item,
                event
            };
            if (!item.eventEmitter) {
                item.eventEmitter = new EventEmitter();
                item.eventEmitter.subscribe(item.command);
            }

            item.eventEmitter.emit(data);
        }

        if (item.routerLink) {
            this.router.navigate(item.routerLink);
        }
        this.dropdownVisible = false;
        // 传递到父组件
        this.getDropdownVisible.emit(this.dropdownVisible);
        event.stopPropagation();
    }

    private bindDocument() {
        if (!this.documentClickListener) {
            this.documentClickListener =
                DomUtil.bindBodyClick(this.renderer, (e) => {
                    this.dropdownVisible = false;
                    // 传递到父组件
                    this.getDropdownVisible.emit(this.dropdownVisible);
                    this.unbindDocument();
            });
        }
    }

    private unbindDocument() {
        if (this.documentClickListener) {
            this.documentClickListener();
            this.documentClickListener = null;
        }
    }
}
