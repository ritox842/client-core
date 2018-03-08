import {Component, OnInit} from '@angular/core';
import {GridOptions} from 'ag-grid';
import {RowSelectionType, ToolbarAction, ToolbarActionType} from "../../../../../../lib";
import {timer} from "rxjs/observable/timer";
import {mapTo} from "rxjs/operators";

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

  ngOnInit() {
    this.options2 = {...this.options};
    this.options2.rowData = [{
      id: 1,
      value: 'one'
    }]
  }

  ready( grid ) {
    this.asyncRows().subscribe(res => {
      grid.api.setRowData(res);
    });
  }

  asyncRows() {
    let rows = [];
    for ( let i = 0; i < 1000; i ++ ) {
      rows.push({id: i, value: i * 5});
    }
    return timer(3000).pipe(mapTo(rows))

  }

  myCustomLogic( selectedRows : any[] ) {
    return selectedRows.some(( row ) => row.value === 5);
  }

}
