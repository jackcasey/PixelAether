/*------------------------------------------------------------
------------------------------------------------------------*/
Package.describe({
  summary: 'Manipulate URLs',
  internal: false
});

Package.on_use(function(api){
  api.export('stripUrl');
  api.add_files('urlTools.js', ['client', 'server']);
});

