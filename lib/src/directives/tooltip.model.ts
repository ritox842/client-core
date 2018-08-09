import { default as Popper } from 'popper.js';

export type TooltipOptions = {
    placement: Popper.Placement,
    container: HTMLElement,
    title: string | HTMLElement,
    html: boolean,
    offset: string | number,
    trigger: TooltipTrigger,
    delay: number,
    template: string;
    popperOptions?;
};

export type TooltipTrigger = 'click' | 'hover' | 'focus';