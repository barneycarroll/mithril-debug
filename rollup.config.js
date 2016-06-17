module.exports = {
	entry     : './src/index.js',
	dest      : './build/index.js',
	format    : 'iife',
	plugins   : [
		require( 'rollup-plugin-buble' )(),
		require( 'rollup-plugin-commonjs' )( {
			include : './node_modules/**'
		} ),
		require( 'rollup-plugin-node-resolve' )( {
			jsnext  : true,
			main    : true
		} )
	],
	sourceMap : true
}
