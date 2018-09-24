import { rargb } from '.'

rargb.list().then(result => {
  console.log('👍 API::list')
}).catch(console.error)

rargb.search('silicon valley').then(result => {
  console.log('👍 API::search')
}).catch(console.error)
