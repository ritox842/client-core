import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewEncapsulation
} from "@angular/core";

@Component({
  selector: "dato-tabs-preview",
  templateUrl: "./tabs-preview.component.html",
  encapsulation: ViewEncapsulation.None,
  styleUrls: ["./tabs-preview.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TabsPreviewComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
