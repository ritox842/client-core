/**
 * @license
 * Copyright Datorama. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License 2.0 license that can be
 * found in the LICENSE file at https://github.com/datorama/client-core/blob/master/LICENSE
 */

import { Directive, ElementRef, forwardRef, Inject, Input, OnDestroy, AfterViewInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { HashMap } from '@datorama/utils';
import { forkJoin, fromEvent, Observable, Observer, timer } from 'rxjs';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { AceAutoCompleteHTML, AceAutoCompleteJSObject, addJSObjectCompletor, createHTMLCompletor } from './auto-complete';
import { HttpClient } from '@angular/common/http';
import { concatMap, filter, repeat, take, tap } from 'rxjs/operators';
import { appendScript } from '../internal/helpers';
import { AceService } from './ace.service';
import { CoreConfig, DATO_CORE_CONFIG } from '../config';

declare global {
  interface Window {
    ace: any;
    js_beautify: any;
  }
}

@Directive({
  selector: '[datoAce]',
  exportAs: 'datoAce',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatoAceDirective),
      multi: true
    }
  ]
})
export class DatoAceDirective implements OnDestroy, ControlValueAccessor, AfterViewInit {
  disabled = false;
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
    showPrintMargin: false,
    tabSize: 2,
    fontFamily: `Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', 'source-code-pro', monospace'`
  };

  private _options: HashMap<any> = { ...this.defaultOptions };
  private BASE_PATH: string;
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
    return this.ace.require('ace/ext/language_tools');
  }

  private get ace() {
    return window.ace;
  }

  constructor(private host: ElementRef<HTMLElement>, private http: HttpClient, private aceService: AceService, @Inject(DATO_CORE_CONFIG) private config: CoreConfig) {
    this.BASE_PATH = this.config.paths.editor;
    this.waitForAce().subscribe(() => {
      this.ace.config.set('themePath', `${this.config.paths.editor}/themes`);
      this.editor.setOption('enableEmmet', true);
    });
  }

  /**
   * We have three states:
   * 1. We didn't fetch Ace (should be invoked only on the first directive initialization).
   * 2. We're already in the process of fetching Ace, so we're invoking a `timer` waiting for Ace to be defined.
   * 3. Ace is on the window, return.
   */
  waitForAce(): Observable<any> {
    if (window.ace) {
      this.initializeEditor();
      return timer(0);
    } else {
      if (this.aceService.fetchingAce) {
        return timer(50).pipe(
          repeat(),
          filter(() => !!window.ace),
          tap(() => {
            this.initializeEditor();
          }),
          take(1)
        );
      } else {
        return this.loadAce();
      }
    }
  }

  private waitForBeauitify(): Observable<any> {
    if (window.js_beautify) {
      return timer(0);
    } else {
      if (this.aceService.fetchingBeautify) {
        return timer(50).pipe(
          repeat(),
          filter(() => !!window.js_beautify),
          take(1)
        );
      } else {
        return this.loadBeautifier();
      }
    }
  }

  getEditor() {
    return this.editor;
  }

  prettier() {
    this.waitForBeauitify().subscribe(() => this.runBeautify());
  }

  setTheme(theme: string) {
    this.waitForAce().subscribe(() => {
      this.ace.config.set('themePath', `${this.config.paths.editor}/themes`);
      this.editor.setTheme(`ace/theme/${theme}`);
    });
  }

  ngAfterViewInit() {
    this.waitForAce().subscribe(() => {
      this.setOptions();
      this.editor.setAutoScrollEditorIntoView(true);

      fromEvent(this.editor, 'change')
        .pipe(untilDestroyed(this))
        .subscribe(() => this.onChange(this.editor.getValue()));

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
    return paths.map(path => this.http.get(`${this.BASE_PATH}/${path}`, { responseType: 'text' }));
  }

  private loadAceWorkers() {
    const paths = [`worker-css.js`, `worker-html.js`, `worker-javascript.js`];

    return forkJoin(...this.createRequests(paths));
  }

  private loadAceScripts() {
    // `snippets/css.js`, `snippets/html.js`, `snippets/javascript.js`
    const paths = [`ace.js`, `ace-langtools.js`, `emmet-lib.js`, `emmet.js`, `mode-css.js`, `mode-html.js`, `mode-javascript.js`];

    return forkJoin(...this.createRequests(paths));
  }

  private loadBeautifier() {
    const paths = [`beautify/base.js`, `beautify/css.js`, `beautify/html.js`];

    this.aceService.fetchingBeautify = true;

    return forkJoin(...this.createRequests(paths)).pipe(
      tap((beautifires: string[]) => {
        appendScript(beautifires.join(' '), 'beautifires');
      })
    );
  }

  private initializeEditor() {
    if (!this.editor) {
      this.editor = this.ace.edit(this.host.nativeElement);
    }
  }

  private loadAce() {
    this.aceService.fetchingAce = true;

    return this.loadAceScripts().pipe(
      tap((aceSource: string[]) => {
        appendScript(aceSource.join(' '), 'ace-base');
        this.ace.config.set('basePath', this.config.paths.editor);
      }),
      concatMap(() => this.loadAceWorkers()),
      tap(workers => {
        appendScript(workers.join(' '), 'ace-workers');
        this.initializeEditor();
      })
    );
  }

  private setValue(value: string) {
    this.waitForAce().subscribe(() => {
      this.editor.setValue(value);
      this.editor.clearSelection();
    });
  }

  private setOptions() {
    this.waitForAce().subscribe(() => this.editor.setOptions(this._options));
  }

  private setLang(lang: string) {
    this.waitForAce().subscribe(() => {
      this._lang = lang;
      this.editor.getSession().setMode(`ace/mode/${lang}`);
    });
  }

  ngOnDestroy() {
    this.editor && this.editor.destroy();
    this.editor = null;
  }

  writeValue(value: string) {
    this.setValue(value || '');
  }

  registerOnChange(fn: Function) {
    this.onChange = fn;
  }

  registerOnTouched(fn: Function) {}

  setDisabledState(isDisabled: boolean) {
    this.disabled = isDisabled;
  }
}
