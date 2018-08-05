import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation
} from "@angular/core";

@Component({
  selector: "dato-carousel-preview",
  templateUrl: "./carousel-preview.component.html",
  styleUrls: ["./carousel-preview.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class CarouselPreviewComponent {
  items: { icon: string }[] = [
    { icon: "edit" },
    { icon: "delete" },
    { icon: "duplicate" },
    { icon: "datosearch" },
    { icon: "pin" }
  ];
}
