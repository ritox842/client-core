import { Pipe, PipeTransform } from "@angular/core";
import { locale } from "./locale";

@Pipe({
  name: "translate"
})
export class TranslatePipe implements PipeTransform {
  constructor() {}

  transform(value, interpolateParams?) {
    return locale[value] || value;
  }
}
