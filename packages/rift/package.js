/*------------------------------------------------------------
------------------------------------------------------------*/
Package.describe({
  summary: 'Manage Connections to Multiple DDP Servers',
  internal: false
});

Package.on_use(function(api){
  api.use('meteor', 'client');
  api.use('deps', 'client');
  api.export('Rift');
  // api.add_files('shared.js', ['client', 'server']);
  // api.add_files('server.js', 'server');
  api.add_files('RiftClient.js', 'client');
});

