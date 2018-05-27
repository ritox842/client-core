import { TemplateRef, Type } from '@angular/core';

export type ContentType<T = any> = TemplateRef<T> | Type<T> | string;
