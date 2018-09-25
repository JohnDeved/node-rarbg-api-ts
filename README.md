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

# List
Get a list of torrents.

```js
// (...params: Iparam[]): Promise
rargb.list().then(result => {
  // code
})
```

# Search
Search for a torrent.

```js
// (searchString: string, ...params: Iparam[]): Promise
rargb.search('silicon valley').then(result => {
  // code
})
```

## Search Imdb
Search for a torrent using a Imdb Id

```js
// (imdbId: string, ...params: Iparam[]): Promise
rargb.searchImdb('tt2575988').then(result => {
  // code
})
```

## Search Tvdb
Search for a torrent using a Tvdb Id.

```js
// (imdbId: string, ...params: Iparam[]): Promise
rargb.searchTvdb('277165').then(result => {
  // code
})
```

# Parameters
Extend your search querys.

#### possible parameters are:

- `category`
  
  will restrict results to a certain category

  Default is ALL

- `format`

  this defines what kind of results you get back

  Default is SHORT

- `limit`

  this will limit or extend the ammount of results

  Default is MEDIUM

- `min_leechers`

  this will restrict results to torrents that have a certain ammount of leechers

  Default is "0"

- `min_seeders`

  this will restrict results to torrents that have a certain ammount of seeders

  Default is "0"

- `ranked`

  this will decide if you only want to display scene torrents or not

  Default is ONLY

- `sort`

  sort parameter will sort the results by seeders,leechers,last. 
  
  Default is LAST

## Parameter Enums
For simplicity I created enums for every parameter value.

```js
rargb.enums
```

![](https://i.imgur.com/PRoH17r.png)
![](https://i.imgur.com/fwpeW6D.png)


## Default Parameters
You can set default parameters that apply to every request.

```js
  rargb.default.category = rargb.enums.CATEGORY.TV
```
![](https://i.imgur.com/ONTUlTa.png)

## Request Parameters
You can also set parameters for each Api request you do, by simply adding a json object with your wanted parameters to any Api function call like so (this will overwrite parameters set with `rargb.default`):

```js
rargb.list({ category: rargb.enums.CATEGORY.TV }
  .then(result => {
    // code
  })

rargb.search('silicon valley', { category: rargb.enums.CATEGORY.TV }
  .then(result => {
    // code
  })

rargb.list({ format: rargb.enums.FORMAT.EXTENTED }
  .then(result => {
    // code
  })
```