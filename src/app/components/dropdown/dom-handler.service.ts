export class DomUtil {
    // 添加class
    public static addClass(element: any, className: string): void {
        if (element.classList) {
            let styles: string[] = className.split(' ');
            for (let style of styles) {
                element.classList.add(style);
            }
        } else {
            let styles: string[] = className.split(' ');
            for (let style of styles) {
                element.className += ' ' + style;
            }
        }
    }

    // 移除class
    public static removeClass(element: any, className: string): void {
        if (element.classList) {
            element.classList.remove(className);
        } else {
            element.className = element.className.replace(new RegExp('(^|\\b)'
                + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
        }
    }

    // 判断class
    public static hasClass(element: any, className: string): boolean {
        if (element.classList) {
            return element.classList.contains(className);
        } else {
            return new RegExp('(^| )' + className + '( |$)', 'gi').test(element.className);
        }
    }

    // 查找指定父元素
    public static parent(el: any, find: any): any {
        let parentEl = el.parentElement;
        let findName = '';
        let sttr = '';
        if (find.indexOf('.') !== -1) {
            sttr = 'className';
            findName = find.replace('.', '');
        } else if (find.indexOf('#') !== -1) {
            sttr = 'id';
            findName = find.replace('#', '');
        }

        if (parentEl[sttr].indexOf(findName) !== -1) {
            return parentEl;
        } else {
            return this.parent(parentEl, find);
        }
    }

    // 查找出本身的兄弟元素
    public static siblings(element: any): any {
        let res: any = Array.prototype.filter.call(
            element.parentNode.children,
            (child) => {
                return child !== element;
            });

        return res;
    }

    // 查找所有子元素
    public static find(element: any, selector: string): any[] {
        return element.querySelectorAll(selector);
    }

    // 查找第一个子元素
    public static findSingle(element: any, selector: string): any {
        return element.querySelector(selector);
    }

    // 获取页面宽高
    public static getViewport(): any {
        let win = window;
        let d = document;
        let e = d.documentElement;
        let g = d.getElementsByTagName('body')[0];
        let w = win.innerWidth || e.clientWidth || g.clientWidth;
        let h = win.innerHeight || e.clientHeight || g.clientHeight;

        return {
            width: w,
            height: h
        };
    }

    // 获取隐藏元素
    public static getHiddenElementDimensions(element: any): any {
        let dimensions: any = {};
        element.style.visibility = 'hidden';
        element.style.display = 'block';
        dimensions.width = element.offsetWidth;
        dimensions.height = element.offsetHeight;
        element.style.display = 'none';
        element.style.visibility = 'visible';

        return dimensions;
    }

    // 控制元素位置
    public static relativePosition(element: any, target: any): void {
        let elementDimensions = element.offsetParent ?
            {
                width: element.outerWidth,
                height: element.outerHeight
            } : this.getHiddenElementDimensions(element);
        let targetHeight = target.offsetHeight;
        let targetWidth = target.offsetWidth;
        let targetOffset = target.getBoundingClientRect();
        let viewport = this.getViewport();
        let top;
        let left;

        if (elementDimensions.height < viewport.height
            && (targetOffset.top + targetHeight + elementDimensions.height)
            > viewport.height) {
            top = -1 * (elementDimensions.height);
        } else {
            top = targetHeight;
        }
        if (elementDimensions.width < viewport.width
            && (targetOffset.left + elementDimensions.width)
            > viewport.width) {
            left = targetWidth - elementDimensions.width;
        } else {
            left = 0;
        }

        element.style.top = top + 'px';
        element.style.left = left + 'px';
    }

    // 透明度渐显
    public static fadeIn(element, duration: number, callback?: Function): void {
        element.style.opacity = 0;

        let last = +new Date();
        let opacity = 0;
        let tick = () => {
            opacity = +element.style.opacity + (new Date().getTime() - last) / duration;
            element.style.opacity = opacity;
            last = +new Date();

            if (+opacity < 1) {
                if (window.requestAnimationFrame) {
                    window.requestAnimationFrame(tick);
                } else {
                    setTimeout(tick, 16);
                }
            } else {
                if (callback) {
                    callback(element);
                }
            }
        };

        tick();
    }
    // 透明度渐隐
    public static fadeOut(element, ms: number, callback?: Function): void {
        let opacity = 1;
        let interval = 50;
        let duration = ms;
        let gap = interval / duration;

        let fading = setInterval(() => {
            opacity = opacity - gap;

            if (opacity <= 0) {
                opacity = 0;
                clearInterval(fading);
                if (callback) {
                    callback(element);
                }
            }

            element.style.opacity = opacity;
        }, interval);
    }

    public static bindBodyClick(renderer, handler) {
        if (renderer.listenGlobal) {
            let documentClickListener = renderer.listenGlobal('body', 'click', (e) => {
                // console.log('click');
                if (handler) {
                    handler.call(null, e);
                }
            });
        } else {
            let documentClickListener = renderer.listen('body', 'click', (e) => {
                // console.log('click');
                if (handler) {
                    handler.call(null, e);
                }
            });
        }
    }
}
