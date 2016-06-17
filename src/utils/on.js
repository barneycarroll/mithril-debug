// Event listener wrapper which returns a function to unbind the supplied handler(s)

// Overloads:
// * on( el, { keyN : handlerN... } )
// * on( [ elN, key, handler ]... )
// * on( [ elN, { keyN : handlerN } ]... )

export default function on( el, key, handler, capture = false ){
       if( el instanceof Array ){
    const offs = [ ...arguments ].map( x => on( ...x ) )

    return () =>
      offs.map( x => x() )
  }
  else if( typeof key === 'string' ){
    if( key.match( /\s+/ ) )
      return key.split( /\s+/ ).map( key =>
        on( el, key, handler, capture )
      )

    el.addEventListener( key, handler, capture )

    return () =>
      el.removeEventListener( key, handler, capture )
  }
  else {
    const offs = []
    const hash = key

    for( const key in hash )
      if( hash.hasOwnProperty( key ) )
        offs.push( on( el, key, hash[ key ], capture ) )

    return () =>
      offs.map( x => x() )
  }
}
