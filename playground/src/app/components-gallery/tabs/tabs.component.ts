import {
  AfterViewInit,
  Attribute,
  Component,
  OnInit,
  QueryList,
  ViewChildren
} from "@angular/core";
import { TabComponent } from "../tab/tab.component";
import { delay } from "helpful-decorators";

export const enum TABS {
  HTML = 0,
  TS = 1,
  SASS = 2
}

@Component({
  selector: "dato-tabs",
  templateUrl: "./tabs.component.html",
  styleUrls: ["./tabs.component.scss"]
})
export class TabsComponent implements OnInit, AfterViewInit {
  @ViewChildren(TabComponent) tabs: QueryList<TabComponent>;

  private active = 0;

  private showElements = [TABS.HTML, TABS.TS, TABS.SASS];

  constructor(@Attribute("show") private show: string) {}

  ngOnInit() {
    if (this.show) {
      const showStrArr = this.show.split(",");
      const showArr = [];
      showStrArr.forEach(item => {
        switch (item.trim().toLowerCase()) {
          case "html":
            showArr.push(TABS.HTML);
            break;
          case "ts":
          case "js":
            showArr.push(TABS.TS);
            break;
          case "sass":
          case "css":
            showArr.push(TABS.SASS);
            break;
        }
      });

      this.showElements = showArr;
      if (this.showElements.length) {
        // select the first visible tab
        this.active = this.showElements[0];
      }
    }
  }

  setActive(number: number) {
    this.active = number;
    this.tabs.forEach(tab => (tab.active = false));
    const activeIndex = this.showElements.indexOf(number);
    this.tabs.toArray()[activeIndex].active = true;
  }

  get HTMLActive() {
    return this.active === TABS.HTML;
  }

  get TSActive() {
    return this.active === TABS.TS;
  }

  get SASSActive() {
    return this.active === TABS.SASS;
  }

  get HTMLVisible() {
    return this.showElements.includes(TABS.HTML);
  }

  get TSVisible() {
    return this.showElements.includes(TABS.TS);
  }

  get SASSVisible() {
    return this.showElements.includes(TABS.SASS);
  }

  @delay()
  ngAfterViewInit() {
    this.tabs.first.active = true;
  }
}
