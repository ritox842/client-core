import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';

@Component({
  selector: 'dato-loader',
  templateUrl: './loader.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DatoLoaderComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
