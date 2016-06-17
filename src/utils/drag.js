import on from './on'

const noop = () => {}

export default ( el, {
  drag  = noop,
  drop  = noop,
  start = noop
} ) => {
  let down = false
  let move = false

  return on(
    [ el,     {
      mousedown : () => {
        down = true
      }
    } ],

    [ window, {
      mousemove : e => {
        if( down ){
          if( !move )
            start( e )

          move = true

          drag( e )
        }
      },

      mouseup   : e => {
        down = false

        if( move ){
          move = false

          drop( e )

          e.preventDefault()
        }
      }
    } ]
  )
}
