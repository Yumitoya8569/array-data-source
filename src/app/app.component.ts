import { Component, OnInit } from '@angular/core';
import { ArrayDataSource } from 'ng-array-data-source';


export interface ScoreData {
    id: number,
    name: string,
    score: number,
    class: string
}

const SCORE_DATA: ScoreData[] = [
    { id: 1, name: 'Abel', score: 80, class: 'A' },
    { id: 2, name: 'Archie', score: 68, class: 'B' },
    { id: 3, name: 'Donald', score: 72, class: 'A' },
    { id: 4, name: 'Eliza', score: 51, class: 'B' },
    { id: 5, name: 'Kelly', score: 77, class: 'A' },
    { id: 6, name: 'Aggie', score: 50, class: 'C' },
    { id: 7, name: 'Rita', score: 66, class: 'B' },
    { id: 8, name: 'Mark', score: 77, class: 'B' },
    { id: 9, name: 'Russ', score: 66, class: 'C' },
    { id: 10, name: 'Tommy', score: 66, class: 'A' },
    { id: 11, name: 'Eliza', score: 80, class: 'B' },
    { id: 12, name: 'Amos', score: 68, class: 'C' },
    { id: 13, name: 'Donald', score: 72, class: 'A' },
    { id: 14, name: 'Alexis', score: 51, class: 'C' },
    { id: 15, name: 'Julia', score: 77, class: 'C' },
    { id: 16, name: 'Sally', score: 50, class: 'A' },
    { id: 17, name: 'Teddy', score: 66, class: 'A' },
    { id: 18, name: 'Noel', score: 77, class: 'B' },
    { id: 19, name: 'Lucy', score: 66, class: 'A' },
    { id: 20, name: 'Mary', score: 66, class: 'B' },
];

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    multi = false;
    fuzzy = true;
    ignoreCase = false;
    dataSource!: ArrayDataSource<ScoreData>;


    constructor() {
    }

    ngOnInit(): void {
        this.dataSource = new ArrayDataSource(SCORE_DATA);
    }
}

