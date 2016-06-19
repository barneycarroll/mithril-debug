import m from 'mithril'

import on     from '../utils/on'
import box    from '../utils/box'
import dragon from '../utils/drag'

const locate = ( x, y ) => [
  Math.round( x / window.innerWidth ),
  Math.round( y / window.innerHeight )
]

const styles = {
  controls : {
    transition : '.15s ease-in-out',
    position   : 'fixed',
    background : '#fff',
    border     : '1px solid',
    color      : '#444'
  },

  shadow : {
    transition : '.15s ease-in-out',
    background : '#ccf',
    opacity    : '0',
    position   : 'absolute',
    height     : '100%',
    width      : '100%',
    zIndex     : '-1'
  },

  shadow_active : {
    padding    : ' 50vh  50vw',
    margin     : '-50vh -50vw',
    opacity    : '.5'
  },

  handle : `
    padding    : .5em 1em;
    cursor     : -webkit-grab;
    cursor     : grab;
    border     : 1px solid;
  `,

  loupe : {
    padding    : '.5em 1em',
    border     : '1px solid'
  },

  loupe_active : {
    color      : '#ccf'
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

      dragging   : false,
      inspecting : false,

      inspection : { top : 0, left : 0, width : '100%' },

      hover : e => {
        this.dragging = true
        this.controls = locate( e.pageX, e.pageY )

        m.redraw()
      },

      place : e => {
        this.dragging = false

        m.redraw()
      }
    } )
  },

  view : ctrl =>
    m( '.Widget', {
      config( el, init, ctxt ){
        ctxt.onunload = on( window, {
          mouseover : e =>
            ctrl.inspection = box( e.target ),

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
          left      : ctrl.controls[ 0 ] ?  '100%' : '0%',
          top       : ctrl.controls[ 1 ] ?  '100%' : '0%',
          transform : `translate( ${
                      ctrl.controls[ 0 ] ? '-100%' : '0%'
                    },${
                      ctrl.controls[ 1 ] ? '-100%' : '0%'
                    } )`
        }
      },
        m( '.shadow', {
          style : {
            ...styles.shadow,
            ...( ctrl.dragging && styles.shadow_active )
          }
        } ),

        m( '.handle', {
          config( el, init, ctxt ){
            ctxt.onunload = dragon( el, {
              drag : ctrl.hover,
              drop : ctrl.place
            } )
          },

          style : styles.handle
        },
          m.trust( '&hellip;' )
        ),

        m( '.loupe', {
          onclick(){
            ctrl.inspecting = !ctrl.inspecting
          },

          style : {
            ...styles.loupe,
            ...( ctrl.inspecting && styles.loupe_active )
          }
        },
          'Inspect'
        )
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
      } )
    )
}
