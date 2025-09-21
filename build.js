const esbuild = require('esbuild');
const fs = require('fs');

async function build(){
  await esbuild.build({
    entryPoints:['src/index.jsx'],
    bundle:true,
    outfile:'dist/index.js',
    loader:{'.js':'jsx','.jsx':'jsx'},
    platform:'browser'
  });
  fs.copyFileSync('public/index.html','dist/index.html');
}
build().catch(()=>process.exit(1));
