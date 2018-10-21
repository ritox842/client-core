/**
 * @license
 * Copyright Datorama. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License 2.0 license that can be
 * found in the LICENSE file at https://github.com/datorama/client-core/blob/master/LICENSE
 */

import { ChangeDetectionStrategy, Component, ElementRef, forwardRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { HashMap } from '@datorama/utils';
import { asapScheduler, fromEvent, Observable, of, timer } from 'rxjs';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { mapTo } from 'rxjs/operators';
import { addCompletor } from './auto-complete';
//import * as ace from 'brace';
//import 'brace/mode/javascript';
//import 'brace/theme/monokai';

declare const ace: AceAjax.Ace;

@Component({
  selector: 'dato-ace',
  templateUrl: './ace.component.html',
  styleUrls: ['./ace.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatoAceComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DatoAceComponent implements OnInit, OnDestroy, ControlValueAccessor {
  @ViewChild('container')
  container: ElementRef<HTMLElement>;
  private editor: AceAjax.Editor;
  private onChange: Function;
  private value: string;

  private defaultOptions = {
    enableBasicAutocompletion: true,
    enableSnippets: true,
    enableLiveAutocompletion: true,
    indentedSoftWrap: false,
    fontSize: 16,
    tabSize: 2,
    fontFamily: "'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', 'source-code-pro', monospace"
  };

  private _options: HashMap<any> = { ...this.defaultOptions };

  @Input()
  set theme(theme: string) {
    this.setTheme(theme);
  }

  @Input()
  set lang(lang: string) {
    this.setLang(lang);
  }

  @Input()
  set options(options: HashMap<any>) {
    this._options = { ...this.defaultOptions, ...options };
    this.setOptions();
  }

  @Input()
  set completions(attributesMap) {
    let langTools = (window as any).ace.require('ace/ext/language_tools');
    langTools.addCompleter(addCompletor(attributesMap));
  }

  constructor() {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.editor = ace.edit(this.container.nativeElement);
    this.setValue(this.value);
    this.setOptions();

    fromEvent(this.editor, 'change')
      .pipe(untilDestroyed(this))
      .subscribe(() => this.onChange(this.editor.getValue()));

    fromEvent(this.editor.container, 'drop')
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        this.editor.clearSelection();
      });
  }

  getEditor() {
    return this.editor;
  }

  private setValue(value: string) {
    this.editor.setValue(value);
    this.editor.clearSelection();
  }

  private setOptions() {
    this.waitForEditor().subscribe(() => this.editor.setOptions(this._options));
  }

  private setTheme(theme: string) {
    this.waitForEditor().subscribe(() => this.editor.setTheme(`ace/theme/${theme}`));
  }

  private setLang(lang: string) {
    this.waitForEditor().subscribe(() => this.editor.getSession().setMode(`ace/mode/${lang}`));
  }

  private waitForEditor(): Observable<boolean> {
    if (this.editor) return of(true);

    return timer(0, asapScheduler).pipe(mapTo(true));
  }

  ngOnDestroy() {}

  writeValue(value: string) {
    this.value = value || '';
    if (this.editor) {
      this.setValue(value);
    }
  }

  registerOnChange(fn: Function) {
    this.onChange = fn;
  }

  registerOnTouched(fn: Function) {}

  setDisabledState(isDisabled: boolean) {}
}
