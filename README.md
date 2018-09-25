# Installation
download the module
```
npm i rargb-api-ts
```

include it in your project
```js
// node way
const { rargb } = require('rargb-api-ts')

// es6 way
import { rargb } from 'rargn-api-ts'
```

want to extend the api with your own functions? no problem, just import the "Tvmaze" class.
```
// node way
const { rargb, Rargb } = require('tvmaze-api-ts')
 
// es6 way
import { rargb, Rargb } from 'tvmaze-api-ts'
 
class MyRargb extends Rargb {
  // code
}
 
const myRargb = new MyRargb()
```

# made with ♥️ and typescript
I added complete type support for all json api returns.

![](https://i.imgur.com/ug4QeyG.png)