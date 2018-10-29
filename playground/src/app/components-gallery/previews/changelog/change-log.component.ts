import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { parseMarkdown } from './parsemd';

@Component({
  selector: 'dato-change-log',
  templateUrl: './change-log.component.html',
  styleUrls: ['./change-log.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ChangeLogComponent implements OnInit {
  changelog$: Observable<string>;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const changelogUrl = 'https://raw.githubusercontent.com/datorama/client-core/master/CHANGELOG.md';
    this.changelog$ = this.http.get(changelogUrl, { responseType: 'text' }).pipe(
      map((response: string) => {
        return parseMarkdown(response);
        //return response.replace(/\n/gm, '<br/>');
      })
    );
  }
}
