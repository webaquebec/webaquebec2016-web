require.config({
	baseUrl: "",
	paths: {
		'routie': 'lib/routie/routie',
		'tmpl': 'lib/blueimp-tmpl/tmpl'
	},
	
	shim: {
		'assets/template/main/Main': {
			deps: ['routie', 'tmpl']
		}
	}
	
});

require(['assets/template/main/Main'], function(Main) {
 	return new Main();
});
