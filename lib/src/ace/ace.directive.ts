/**
 * @license
 * Copyright Datorama. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License 2.0 license that can be
 * found in the LICENSE file at https://github.com/datorama/client-core/blob/master/LICENSE
 */

import { Directive, ElementRef, forwardRef, Input, OnDestroy } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { HashMap } from '@datorama/utils';
import { forkJoin, fromEvent, Observable, Observer, timer } from 'rxjs';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { AceAutoCompleteHTML, AceAutoCompleteJSObject, addJSObjectCompletor, createHTMLCompletor } from './auto-complete';
import { HttpClient } from '@angular/common/http';
import { concatMap, filter, repeat, tap } from 'rxjs/operators';
import { appendScript } from '../internal/helpers';
import { AceService } from './ace.service';

declare global {
  interface Window {
    ace: any;
    js_beautify: any;
  }
}

@Directive({
  selector: '[dato-ace]',
  exportAs: 'datoAce',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatoAceDirective),
      multi: true
    }
  ]
})
export class DatoAceDirective implements OnDestroy, ControlValueAccessor {
  //@ts-ignore
  private editor: AceAjax.Editor;
  private onChange: Function;

  private defaultOptions = {
    enableBasicAutocompletion: true,
    enableLiveAutocompletion: true,
    indentedSoftWrap: false,
    fontSize: 14,
    /** make it false to disable Ace validation */
    useWorker: true,
    tabSize: 2,
    fontFamily: `Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', 'source-code-pro', monospace'`
  };

  private _options: HashMap<any> = { ...this.defaultOptions };
  private BASE_PATH = '/assets/ace';
  private _lang: string;

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
  set HTMLCompletions(attributesMap: AceAutoCompleteHTML) {
    this.waitForAce().subscribe(() => {
      this.langTools.setCompleters([createHTMLCompletor(attributesMap), ...this.getBaseCompletors(this.langTools)]);
    });
  }

  @Input()
  set JSObjectCompletions(objectMap: AceAutoCompleteJSObject) {
    this.waitForAce().subscribe(() => {
      addJSObjectCompletor(objectMap, this.getBaseCompletors(this.langTools), this.getEditor());
    });
  }

  private get langTools() {
    return window.ace.require('ace/ext/language_tools');
  }

  constructor(private host: ElementRef<HTMLElement>, private http: HttpClient, private aceService: AceService) {
    this.waitForAce().subscribe();
  }

  /**
   * We have three states:
   * 1. We didn't fetch Ace (should be invoked only on the first directive initialization).
   * 2. We're already in the process of fetching Ace, so we're invoking a `timer` waiting for Ace to be defined.
   * 3. Ace is on the window, return.
   */
  waitForAce() {
    return new Observable(observer => {
      if (window.ace) {
        this.initializeEditor(observer);
      } else {
        if (this.aceService.fetchingAce) {
          timer(50)
            .pipe(
              repeat(),
              filter(() => !!window.ace)
            )
            .subscribe(() => this.initializeEditor(observer));
        } else {
          this.loadAce(observer);
        }
      }
    });
  }

  private waitForBeauitify() {
    return new Observable(observer => {
      if (window.js_beautify) {
        observer.next(true);
        observer.complete();
      } else {
        if (this.aceService.fetchingBeautify) {
          timer(50)
            .pipe(
              repeat(),
              filter(() => !!window.js_beautify)
            )
            .subscribe(() => {
              observer.next(true);
              observer.complete();
            });
        } else {
          this.loadBeautifier(observer);
        }
      }
    });
  }

  getEditor() {
    return this.editor;
  }

  prettier() {
    this.waitForBeauitify().subscribe(() => this.runBeautify());
  }

  setTheme(theme: string) {
    this.waitForAce().subscribe(() => {
      this.editor.setTheme(`ace/theme/${theme}`);
    });
  }

  ngAfterViewInit() {
    this.waitForAce().subscribe(() => {
      this.setOptions();
      this.editor.setAutoScrollEditorIntoView(true);

      fromEvent(this.editor, 'change')
        .pipe(untilDestroyed(this))
        .subscribe(() => {
          this.onChange(this.editor.getValue());
        });

      fromEvent(this.editor.container, 'drop')
        .pipe(untilDestroyed(this))
        .subscribe(() => this.editor.clearSelection());
    });
  }

  private runBeautify() {
    const lang = this._lang === 'javascript' ? 'js' : this._lang;
    const method = window[`${lang}_beautify`];
    const beauty = method(this.editor.getValue(), { indent_size: 2, preserve_newlines: false });
    this.setValue(beauty);
  }

  private getBaseCompletors(langTools) {
    return [langTools.textCompleter, langTools.snippetCompleter, langTools.keyWordCompleter];
  }

  private createRequests(paths: string[]) {
    return paths.map(path => this.http.get(path, { responseType: 'text' }));
  }

  private loadAceWorkers() {
    const paths = [`${this.BASE_PATH}/worker-css.js`, `${this.BASE_PATH}/worker-html.js`, `${this.BASE_PATH}/worker-javascript.js`];

    return forkJoin(...this.createRequests(paths));
  }

  private loadAceScripts() {
    const paths = [`${this.BASE_PATH}/ace.js`, `${this.BASE_PATH}/ace-langtools.js`, `${this.BASE_PATH}/mode-css.js`, `${this.BASE_PATH}/mode-html.js`, `${this.BASE_PATH}/mode-javascript.js`, `${this.BASE_PATH}/theme-monokai.js`, `${this.BASE_PATH}/snippets/css.js`, `${this.BASE_PATH}/snippets/html.js`, `${this.BASE_PATH}/snippets/javascript.js`];

    return forkJoin(...this.createRequests(paths));
  }

  private loadBeautifier(observer: Observer<boolean>) {
    const paths = [`${this.BASE_PATH}/beautify/base.js`, `${this.BASE_PATH}/beautify/css.js`, `${this.BASE_PATH}/beautify/html.js`];

    this.aceService.fetchingBeautify = true;

    forkJoin(...this.createRequests(paths)).subscribe((beautifires: string[]) => {
      appendScript(beautifires.join(' '), 'beautifires');
      observer.next(true);
      observer.complete();
    });
  }

  private initializeEditor(observer: Observer<boolean>) {
    this.editor = window.ace.edit(this.host.nativeElement);
    observer.next(true);
    observer.complete();
  }

  private loadAce(observer: Observer<boolean>) {
    this.aceService.fetchingAce = true;
    this.loadAceScripts()
      .pipe(
        tap((aceSource: string[]) => {
          appendScript(aceSource.join(' '), 'ace-base');
          window.ace.config.set('basePath', '/assets/ace');
        }),
        concatMap(() => this.loadAceWorkers())
      )
      .subscribe(workers => {
        appendScript(workers.join(' '), 'ace-workers');
        this.initializeEditor(observer);
      });
  }

  private setValue(value: string) {
    this.waitForAce().subscribe(() => {
      this.editor.setValue(value);
      this.editor.clearSelection();
    });
  }

  private setOptions() {
    this.waitForAce().subscribe(() => {
      this.editor.setOptions(this._options);
    });
  }

  private setLang(lang: string) {
    this.waitForAce().subscribe(() => {
      this._lang = lang;
      this.editor.getSession().setMode(`ace/mode/${lang}`);
    });
  }

  ngOnDestroy() {}

  writeValue(value: string) {
    this.setValue(value || '');
  }

  registerOnChange(fn: Function) {
    this.onChange = fn;
  }

  registerOnTouched(fn: Function) {}

  setDisabledState(isDisabled: boolean) {}
}
