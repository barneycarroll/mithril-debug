import m      from 'mithril'
import on     from '../utils/on'
import box    from '../utils/box'
import dragon from '../utils/drag'

const rect   = el =>
  el.getBoundingClientRect()

const locate = ( x, y ) => [
  Math.round( x / window.innerWidth ),
  Math.round( y / window.innerHeight )
]

const styles = {
  controls : {
    position   : 'fixed',
    background : '#fff',
    border     : '1px solid',
    color      : '#eee'
  },

  handle : {
    padding    : '.5em 1em',
    border     : '1px solid'
  },

  loupe : {
    padding    : '.5em 1em',
    border     : '1px solid'
  },

  loupe_active : {
    color      : '#ccf'
  },

  shadow : {
    transition : '.15s ease-in-out',
    opacity    : '0',
    boxShadow  : 'rgba( 0, 0, 0, .5 ) 0 0 50vh 50vh',
    width      : '0',
    height     : '0'
  },

  screen : {
    position   : 'fixed'
  },

  screen_active : {
    background : 'red'
  }
}

export default {
  controller : function(){
    Object.assign( this, {
      controls : [ 1, 0 ],
      shadow   : [ 1, 0 ],

      dragging   : false,
      inspecting : false,

      inspection : { top : 0, left : 0, width : '100%' },

      hover : e => {
        this.dragging = true
        this.shadow = locate( e.pageX, e.pageY )

        m.redraw()
      },

      place : e => {
        this.dragging = false
        this.controls = [ ...this.shadow ]

        m.redraw()
      }
    } )
  },

  view : ctrl =>
    m( '.Widget', {
      config( el, init, ctxt ){
        ctxt.onunload = on( window, {
          mouseover : e =>
            ctrl.inspection = rect( e.target ),

          click     : e => {
            if( ctrl.inspecting ){
              e.preventDefault()

              ctrl.inspecting = false
            }
          }
        }, true )
      }
    },
      m( '.controls', {
        style : {
          ...styles.controls,
          ...( ctrl.controls[ 0 ] ? { right  : 0 } : { left : 0 } ),
          ...( ctrl.controls[ 1 ] ? { bottom : 0 } : { top  : 0 } )
        }
      },
        m( '.handle', {
          config( el, init, ctxt ){
            ctxt.onunload = dragon( el, {
              drag : ctrl.hover,
              drop : ctrl.place
            } )
          },

          style : styles.handle
        } ),

        m( '.loupe', {
          onclick(){
            ctrl.inspecting = !ctrl.inspecting
          },

          style : {
            ...styles.loupe,
            ...( ctrl.inspecting && styles.loupe_active )
          }
        } )
      ),

      m( '.screen', {
        style : {
          ...styles.screen,
          ...ctrl.screen,
          ...( ctrl.inspecting && styles.screen_active ),

          top   : ctrl.inspection.top,
          left  : ctrl.inspection.left,
          width : ctrl.inspection.width
        }
      } ),

      m( '.shadow', {
        style : {
          ...styles.shadow,

          opacity : ctrl.dragging ? 1 : 0,
          left    : ctrl.shadow[ 0 ] * 100 + '%',
          top     : ctrl.shadow[ 1 ] * 100 + '%'
        }
      } )
    )
}
