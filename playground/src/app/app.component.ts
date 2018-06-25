import { Component, ViewEncapsulation } from "@angular/core";
import { LicenseManager } from "ag-grid-enterprise";

@Component({
  selector: "app",
  encapsulation: ViewEncapsulation.None,
  styleUrls: ["./app.component.scss"],
  templateUrl: "./app.component.html"
})
export class AppComponent {
  changeTheme() {
    document.body.classList.toggle("dark");
    window["theme"] = document.body.classList.contains("dark")
      ? "dark"
      : "light";

    Array.from(document.querySelectorAll(".panel-block")).forEach(e => {
      e.classList.toggle("dark");
    });
  }
}

LicenseManager.setLicenseKey("YOUR_LICENCE_HERE");
