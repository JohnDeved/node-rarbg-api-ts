import { rargb } from '.'

rargb.list('20').then(result => {
  if (result.torrent_results[0].download) {
    console.log('👍 API::list')
  } else {
    console.log('👎 API::list')
  }
})

rargb.search('silicon valley').then(result => {
  if (result.torrent_results[0].download) {
    console.log('👍 API::search')
  } else {
    console.log('👎 API::search')
  }
})
