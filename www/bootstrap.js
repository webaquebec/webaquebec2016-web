require.config({
	baseUrl: "",
	paths: {
		'routie': 'lib/routie/routie',
		'tmpl': 'lib/blueimp-tmpl/tmpl'
	},
	
	shim: {
		'assets/waq/main/Main': {
			deps: ['routie', 'tmpl']
		}
	}
	
});

require(['assets/waq/main/Main'], function(Main) {
 	return new Main();
});
