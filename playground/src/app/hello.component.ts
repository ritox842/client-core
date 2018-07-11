import { Component } from "@angular/core";

@Component({
  selector: "hello",
  template: `
    Hello
  `
})
export class HelloComponent {
  ngOnInit() {
    console.log("HelloComponent ngOnInit");
  }

  ngOnDestroy() {
    console.log("HelloComponent ngOnDestroy");
  }
}
