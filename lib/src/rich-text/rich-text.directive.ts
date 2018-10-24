/**
 * @license
 * Copyright Datorama. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License 2.0 license that can be
 * found in the LICENSE file at https://github.com/datorama/client-core/blob/master/LICENSE
 */

import { AfterViewInit, Directive, ElementRef, forwardRef, Input, NgZone, OnDestroy } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseCustomControl } from '../internal/base-custom-control';
import { isString } from '@datorama/utils';
import { HttpClient } from '@angular/common/http';
import { appendScript, appendStyle } from '../internal/helpers';

declare global {
  interface Window {
    tinymce: any;
    tinyMCEPreInit: any;
  }
}

const getTinymce = () => {
  return window && window.tinymce ? window.tinymce : null;
};

@Directive({
  selector: '[datoRichText]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatoRichTextDirective),
      multi: true
    }
  ]
})
export class DatoRichTextDirective extends BaseCustomControl implements OnDestroy, AfterViewInit, ControlValueAccessor {
  @Input()
  plugins: string | undefined;
  @Input()
  toolbar: string | string[];
  @Input()
  menubar: string | string[] | null;
  @Input()
  inline: boolean | undefined;
  @Input()
  options: { [key: string]: any } | undefined;
  @Input()
  width: number;
  @Input()
  height: number;

  @Input()
  autocompleteOptions = {};

  @Input()
  set disabled(val: boolean) {
    this._disabled = val;
    if (this.editor && this.editor.initialized) {
      this.editor.setMode(val ? 'readonly' : 'design');
    }
  }

  get disabled() {
    return this._disabled;
  }

  private _disabled: boolean | undefined;
  private initialValue = '';
  private editor;

  constructor(private ngZone: NgZone, private http: HttpClient, private host: ElementRef<HTMLElement>) {
    super();
  }

  ngAfterViewInit() {
    window.tinyMCEPreInit = {
      suffix: '',
      base: '/assets/rich-text',
      query: ''
    };

    /**
     * We support only one instance in load time
     */
    if (window.tinymce) {
      this.init.call(this);
    } else {
      this.loadLib().subscribe(lib => {
        appendScript(lib, 'rich-text-editor');
        this.init.call(this);
        this.loadAutoCompleteStyle();
      });
    }
  }

  private loadLib() {
    return this.http.get('/assets/rich-text/index.js', { responseType: 'text' });
  }

  private loadAutoCompleteStyle() {
    this.http.get('/assets/rich-text/plugins/autocomplete/plugin.css', { responseType: 'text' }).subscribe(style => {
      appendStyle(style, 'tinymce-autocomplete');
    });
  }

  private initEditor(_, editor) {
    this.ngZone.run(() => editor.setContent(this.initialValue));
    editor.on('setcontent', ({ content, format }: any) => format === 'html' && content && this.ngZone.run(() => this.onChange(content)));
    editor.on('change keyup undo redo', () => this.ngZone.run(() => this.onChange(editor.getContent({ format: 'raw' }))));
  }

  private deaultOptions() {
    const defaultPlugins = 'link fullscreen textcolor colorpicker image lists table textpattern autocomplete';
    const defaultToolbar = ['fontselect fontsizeselect forecolor backcolor bold italic underline link', 'alignleft aligncenter alignright alignjustify outdent indent | table numlist bullist  | image fullscreen'];

    return {
      target: this.host.nativeElement,
      width: this.width || 600,
      height: this.height || 300,
      force_br_newlines: true,
      force_p_newlines: false,
      resize: 'both',
      branding: false,
      inline: this.inline,
      readonly: this.disabled,
      plugins: this.plugins || defaultPlugins,
      toolbar: this.toolbar || defaultToolbar,
      fontsize_formats: '8px 10px 12px 14px 18px 24px 36px',
      menubar: false,
      autocomplete: this.autocompleteOptions,
      setup: editor => {
        this.editor = editor;
        editor.on('init', (e: Event) => {
          this.initEditor(e, editor);
        });
      }
    };
  }

  private init() {
    const options = {
      ...this.deaultOptions(),
      ...this.options
    };

    this.ngZone.runOutsideAngular(() => {
      getTinymce().init(options);
    });
  }

  ngOnDestroy() {
    if (getTinymce() !== null) {
      getTinymce().remove(this.editor);
    }
  }

  writeValue(value: string | null) {
    this.initialValue = value || this.initialValue;

    if (this.editor && this.editor.initialized && isString(value)) {
      this.editor.setContent(value);
    }
  }

  setDisabledState(isDisabled: boolean) {
    if (this.editor) {
      this.editor.setMode(isDisabled ? 'readonly' : 'design');
    }
  }
}
