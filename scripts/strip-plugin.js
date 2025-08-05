import strip from 'strip-comments';

function stripPlugin() {
  return {
    name: 'strip-plugin',
    setup(build) {
      build.onLoad({ filter: /\.[tj]s$/ }, async (args) => {
        const fs = await import('fs/promises');
        const contents = await fs.readFile(args.path, 'utf8');
        const clean = strip(contents);
        return { contents: clean, loader: 'ts' };
      });
    },
  };
}

export default stripPlugin;
