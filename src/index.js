import m      from 'mithril'
import widget from './view/widget'

m.mount(
  document.head.appendChild(
    document.createElement( 'div' )
  ),

  {
    view : ctrl => [
      m( 'style', 'head { display: block }' ),
      m( widget )
    ]
  }
)

m.mount( document.body, {
  view : () => [
    m( 'h1', 'Hi!' )
  ]
} )
