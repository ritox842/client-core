import { Component, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AceAutoCompleteHTML, AceAutoCompleteJSObject, DatoAceDirective } from '../../../../../../lib';

@Component({
  selector: 'dato-ace-preview',
  templateUrl: './ace-preview.component.html',
  styleUrls: ['./ace-preview.component.scss']
})
export class AcePreviewComponent {
  htmlControl = new FormControl();
  cssControl = new FormControl();
  jsControl = new FormControl();
  @ViewChild('jsEditor')
  jsEditor: DatoAceDirective;

  @ViewChildren(DatoAceDirective)
  aces: QueryList<DatoAceDirective>;

  options = {
    enableBasicAutocompletion: false,
    enableSnippets: false,
    enableLiveAutocompletion: false
  };

  htmlMap: AceAutoCompleteHTML = {
    'da-query-table': {
      'show-total': {
        true: 1,
        false: 1
      }
    },
    'da-query': {
      field: {
        EXAMPLE: 1,
        EXAMPLETWO: 2
      },
      type: {
        none: 1,
        bullet: 1,
        number: 1,
        list: 1
      },
      delimiter: {}
    },
    'da-filter': {
      field: {},
      type: {
        none: 1,
        bullet: 1,
        number: 1,
        list: 1
      },
      delimiter: {}
    }
  };

  DAObjectMap: AceAutoCompleteJSObject = {
    DA: ['navigation', 'query', 'api', 'widget'],
    'DA.navigation': ['dashboard', 'open'],
    'DA.navigation.dashboard': ['goToPage', 'scrollToWidget', 'next', 'previous'],
    'DA.query': ['getQuery', 'hasQuery', 'getQueryResult'],
    'DA.api': ['dashboard', 'request', 'get', 'post'],
    'DA.api.dashboard': ['getPages', 'getWidgets'],
    'DA.widget': ['send', 'subscribe']
  };

  themesControl = new FormControl();
  themes = [
    {
      label: 'Monokai',
      id: 'monokai'
    },
    {
      label: 'Dracula',
      id: 'dracula'
    }
  ];

  updateFields() {
    this.htmlMap = {
      ...this.htmlMap,
      'da-query': {
        ...this.htmlMap['da-query'],
        field: {
          CLICKS: 1,
          IMPRESSIONS: 2
        }
      }
    };
  }

  updateHTML() {
    this.htmlControl.setValue(`<da-table></da-table>`);
  }

  updateCSS() {
    this.cssControl.setValue(`h1 { color: red }`);
  }

  updateJS() {
    this.jsControl.setValue(`console.log(111)`);
  }

  constructor() {}

  ngOnInit() {
    this.themesControl.valueChanges.subscribe(theme => {
      for (const ace of this.aces.toArray()) {
        ace.setTheme(theme.id);
      }
    });
  }

  ngAfterViewInit() {}

  prettify() {
    for (const ace of this.aces.toArray()) {
      ace.prettier();
    }
  }
}
