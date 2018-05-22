/**
 * @license
 * Copyright Datorama. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License 2.0 license that can be
 * found in the LICENSE file at https://github.com/datorama/client-core/blob/master/LICENSE
 */

import { ChangeDetectionStrategy, Component, EmbeddedViewRef, Input, OnInit, TemplateRef } from '@angular/core';
import { ContentType } from '../dialog/config/dialog.options';

export enum RenderMethod {
  Component = 'Component',
  Template = 'Template',
  Text = 'Text'
}

@Component({
  selector: 'dato-dynamic-content',
  templateUrl: './dynamic-content.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DatoDynamicContentComponent {
  private _content: ContentType;

  @Input()
  set content(contentType: ContentType) {
    this._content = contentType;
    this.setRenderMethod();
  }
  get content(): ContentType {
    return this._content;
  }

  renderMethod = RenderMethod.Text;

  constructor() {}

  private setRenderMethod() {
    if (typeof this.content === 'string') {
      this.renderMethod = RenderMethod.Text;
    } else if (this.content instanceof TemplateRef) {
      this.renderMethod = RenderMethod.Template;
    } else {
      this.renderMethod = RenderMethod.Component;
    }
  }
}
