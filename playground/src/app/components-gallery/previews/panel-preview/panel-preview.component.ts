import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { DatoPanel } from '../../../../../../lib';
import { PanelDemoAkitaComponent, PanelDemoComponent } from './panel-demo.component';

@Component({
  selector: 'dato-panel-preview',
  templateUrl: './panel-preview.component.html',
  styleUrls: ['./panel-preview.component.scss']
})
export class PanelPreviewComponent implements OnInit {
  @ViewChild('demo')
  tpl: TemplateRef<any>;

  constructor(private panelService: DatoPanel) {}

  open() {
    this.panelService.open(PanelDemoComponent).subscribe(() => console.log('closed'));
  }

  close() {
    this.panelService.close();
  }

  openSmall() {
    this.panelService
      .open(this.tpl, {
        relativeTo: '.custom-relative',
        height: 200,
        offset: { left: 62 }
      })
      .subscribe(() => console.log('closed'));
  }

  ngOnInit(): void {}

  open2() {
    this.panelService.open(PanelDemoAkitaComponent).subscribe(() => console.log('closed'));
  }

  open3() {
    this.panelService
      .open(PanelDemoComponent, {
        backdrop: {
          enabled: true,
          selector: '[data-relative="backdrop"]'
        }
      })
      .subscribe(() => console.log('closed'));
  }

  ngOnDestroy() {
    this.panelService.close();
  }
}
