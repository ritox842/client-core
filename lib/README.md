## Installation
`npm i @datorama/core`

#### Style
`@import ~@datorama/core/bundle.css`

#### TS
```ts
import { DatoCoreModule } from '@datorama/core';

@NgModule({
   imports: [
     DatoCoreModule.forRoot()
   ]
})
export class AppModule {
}
``