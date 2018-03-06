import {Component, OnInit} from '@angular/core';
import {GridOptions} from 'ag-grid';
import {RowSelectionType, ToolbarAction, ToolbarActionType} from "../../../../../../lib";

@Component({
  selector: 'dato-grid-preview',
  templateUrl: './grid-preview.component.html',
  styleUrls: [ './grid-preview.component.scss' ]
})
export class GridPreviewComponent implements OnInit {

  options : GridOptions = {
    columnDefs: [
      {
        headerName: 'ID',
        field: 'id',
        width: 100
      },
      {
        headerName: 'Value',
        field: 'value',
        width: 100
      },
    ],

    rowData: []
  };

  toolbarActions : ToolbarAction[] = [
    {
      actionType: ToolbarActionType.Add,
      click: function () {
        alert('you clicked me :)');
      },
    },
    {
      actionType: ToolbarActionType.Edit,
      click: function () {
        alert('you clicked me :)');
      },
    },
    {
      actionType: ToolbarActionType.Delete,
      click: function () {
        alert('you clicked me :)');
      },
    },
    {
      actionType: ToolbarActionType.Copy,
      click: function () {
        alert('you clicked me :)');
      },
    },
    {
      text: 'cool button',
      icon: 'edit',
      showWhen: RowSelectionType.SINGLE,
      click: function () {
        alert('you clicked me :)');
      },
    }
  ];

  options2 : GridOptions;

  constructor() {

  }

  ngOnInit() {
    // add rows
    for ( let i = 0; i < 1000; i ++ ) {
      this.options.rowData.push({id: i, value: i * 5});
    }
    this.options2 = {...{}, ...this.options};
  }

  myCustomLogic( selectedRows : any[] ) {
    return selectedRows.some(( row ) => row.value === 5);
  }

}
