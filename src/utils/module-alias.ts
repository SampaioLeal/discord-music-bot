import * as path from 'path'
import moduleAlias from 'module-alias'

const files = path.resolve(__dirname, '..', '..')

moduleAlias.addAliases({
  '@src': path.join(files, 'src'),
  '@test': path.join(files, 'test'),
  '@utils': path.join(files, 'src', 'utils'),
  '@enums': path.join(files, 'src', 'enums'),
  '@logger': path.join(files, 'src', 'logger'),
  '@typings': path.join(files, 'src', 'typings')
})
