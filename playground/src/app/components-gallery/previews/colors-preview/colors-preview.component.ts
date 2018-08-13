import { Component, ViewEncapsulation } from "@angular/core";
import { light } from "../../../../../../lib/src/palette";

@Component({
  selector: "dato-colors-preview",
  templateUrl: "./colors-preview.component.html",
  styleUrls: ["./colors-preview.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class ColorsPreviewComponent {
  colors = Object.keys(light);
  theme = "light";
  someCondition = true;

  group: any = this.colors.reduce((acc, color) => {
    const [type] = color.split("-");
    acc[type] = acc[type] || [];

    acc[type].push({
      color,
      hex: light[color]
    });
    return acc;
  }, {});

  changeTheme() {
    this.theme = this.theme === "light" ? "dark" : "light";
  }
}
