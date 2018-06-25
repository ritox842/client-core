import { Component, OnInit } from "@angular/core";

@Component({
  selector: "dato-side-nav",
  templateUrl: "./side-nav.component.html",
  styleUrls: ["./side-nav.component.scss"]
})
export class SideNavComponent implements OnInit {
  constructor() {}

  ngOnInit() {}

  changeTheme() {
    if (window["theme"] === "dark") {
      Array.from(document.querySelectorAll(".panel-block")).forEach(e => {
        e.classList.toggle("dark");
      });
    }
  }
}
