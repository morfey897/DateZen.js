import strip from 'strip-comments';

export function stripCommentsPlugin() {
  return {
    name: 'strip-comments',
    setup(build) {
      build.onLoad({ filter: /\.[jt]s$/ }, async (args) => {
        const fs = await import('fs/promises');
        const contents = await fs.readFile(args.path, 'utf8');
        const clean = strip(contents);
        return { contents: clean, loader: 'ts' };
      });
    },
  };
}
