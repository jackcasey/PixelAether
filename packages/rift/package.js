/*------------------------------------------------------------
------------------------------------------------------------*/
Package.describe({
  summary: 'Manage Connections to Multiple DDP Servers',
  internal: false
});

Package.on_use(function(api){
  api.use('meteor', 'client');
  api.use('deps', 'client');
  api.use('url-tools', ['client', 'server']);
  api.export('Rift');
  api.add_files('Portal.js', 'client');
  api.add_files('Rift.js', 'client');
});

