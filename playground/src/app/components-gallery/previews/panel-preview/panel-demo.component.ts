import { Component } from "@angular/core";
import { DatoPanel } from "../../../../../../lib";

@Component({
  selector: "test-component",
  template: `

    <dato-panel-header>
      Hello
    </dato-panel-header>
    <dato-panel-content>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit
      <p>
        voluptates? Cupiditate doloremque doloribus ducimus
      </p>
      <p>
        iste maiores maxime modi nemo similique,
      </p>
    </dato-panel-content>
    <dato-panel-footer>
      <dato-button datoType="secondary" (click)="close()">Cancel</dato-button>
      <dato-button (click)="close()">OK</dato-button>
    </dato-panel-footer>

  `
})
export class PanelDemoComponent {
  constructor(private panel: DatoPanel) {}

  close() {
    this.panel.close();
  }
}

@Component({
  template: `

    <dato-panel-header>
      Akita!!!!
    </dato-panel-header>
    <dato-panel-content>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit
      <p>
        voluptates? Cupiditate doloremque doloribus ducimus
      </p>
      <p>
        iste maiores maxime modi nemo similique,
      </p>
    </dato-panel-content>
    <dato-panel-footer>
      <dato-button datoType="secondary" (click)="close()">Cancel</dato-button>
      <dato-button (click)="close()">OK</dato-button>
    </dato-panel-footer>

  `
})
export class PanelDemoAkitaComponent {
  constructor(private panel: DatoPanel) {}

  close() {
    this.panel.close();
  }
}
