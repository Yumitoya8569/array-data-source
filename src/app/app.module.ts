import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { ArrayDataSourceModule } from 'ng-array-data-source';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        ArrayDataSourceModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
