import { Component, ChangeDetectionStrategy, Input } from "@angular/core";

@Component({
  selector: "da-custom-toast",
  template: `I'm a custom component, my name is {{data?.name}}`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomToastComponent {
  @Input() data;
}
