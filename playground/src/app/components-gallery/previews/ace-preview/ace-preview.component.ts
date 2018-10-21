import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DatoAceComponent } from '../../../../../../lib';

@Component({
  selector: 'dato-ace-preview',
  templateUrl: './ace-preview.component.html',
  styleUrls: ['./ace-preview.component.scss']
})
export class AcePreviewComponent implements OnInit {
  htmlControl = new FormControl();
  cssControl = new FormControl();
  jsControl = new FormControl();
  @ViewChild('jsEditor')
  jsEditor: DatoAceComponent;

  options = {
    enableBasicAutocompletion: false,
    enableSnippets: false,
    enableLiveAutocompletion: false
  };

  attributeMap = {
    'da-table': {
      type: {
        table: 1,
        list: 1,
        bullet: 1
      }
    },
    'da-counter': {}
  };

  updateHTML() {
    this.htmlControl.setValue(`<da-table></da-table>`);
  }

  updateCSS() {
    this.cssControl.setValue(`h1 { color: red }`);
  }

  updateJS() {
    this.htmlControl.setValue(`console.log(111)`);
  }

  ngAfterViewInit() {
    var staticWordCompleter = {
      getCompletions: function(editor, session, pos, prefix, callback) {
        // DA.navigation.dashboard.goToPage
        // DA.navigation.open
        var token = session.getTokenAt(pos.row, pos.column);
        console.log(token);
        //debugger;
        callback(
          null,
          [].map(function(word) {
            return {
              caption: word,
              value: word,
              meta: 'static'
            };
          })
        );
      }
    };
    this.jsEditor.getEditor().completers.push(staticWordCompleter);
  }
}
