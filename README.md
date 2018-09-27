# Installation
download the module
```
npm i rarbg-api-ts
```

include it in your project
```js
// node way
const { rarbg } = require('rarbg-api-ts')

// es6 way
import { rarbg } from 'rargn-api-ts'
```

want to extend the api with your own functions? no problem, just import the "Rargb" class.
```js
// node way
const { rarbg, Rargb } = require('tvmaze-api-ts')
 
// es6 way
import { rarbg, Rargb } from 'tvmaze-api-ts'
 
class Myrarbg extends Rargb {
  // code
}
 
const myrarbg = new Myrarbg()
```

# made with ♥️ and typescript
I added complete type support for all json api returns.

![](https://i.imgur.com/ug4QeyG.png)

# List
Get a list of torrents.

```js
// (...params: Iparam[]): Promise
rarbg.list().then(result => {
  // code
})
```

# Search
Search for a torrent.

```js
// (searchString: string, ...params: Iparam[]): Promise
rarbg.search('silicon valley').then(result => {
  // code
})
```

## Search Imdb
Search for a torrent using a Imdb Id

```js
// (imdbId: string, ...params: Iparam[]): Promise
rarbg.searchImdb('tt2575988').then(result => {
  // code
})
```

## Search Tvdb
Search for a torrent using a Tvdb Id.

```js
// (imdbId: string, ...params: Iparam[]): Promise
rarbg.searchTvdb('277165').then(result => {
  // code
})
```

# Parameters
Extend your search querys.

**possible parameters are:**

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
rarbg.enums
```

![](https://i.imgur.com/PRoH17r.png)
![](https://i.imgur.com/fwpeW6D.png)


## Default Parameters
You can set default parameters that apply to every request.

```js
  rarbg.default.category = rarbg.enums.CATEGORY.TV
```
![](https://i.imgur.com/ONTUlTa.png)

## Request Parameters
You can also set parameters for each Api request you do, by simply adding a json object with your wanted parameters to any Api function call like so (this will overwrite parameters set with `rarbg.default`):

```js
rarbg.list({ category: rarbg.enums.CATEGORY.TV })
  .then(result => {
    // code
  })

rarbg.search('silicon valley', { category: rarbg.enums.CATEGORY.TV })
  .then(result => {
    // code
  })

rarbg.list({ format: rarbg.enums.FORMAT.EXTENDED })
  .then((torrents: ItorrentExtended[]) => {
    // code
  })
```

# Limits
The rargb api is limited to 1 request per 2 seconds per ip.
Dont worry tho, rarbg-api-ts will automaticly keep you within this limit.

It will also automaticly request api tokens for you and replace them once they expire.