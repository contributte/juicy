import * as cheerio from "cheerio";
import path from "path";
import { readFile, lowercase, readPackage } from "../utils";
import { NotFoundError } from "../errors";
import { Vendor } from "../app";

export async function generate(req: GenerateRequest): Promise<string> {
  try {
    // Read icon file
    var file = await readFile(path.resolve('node_modules', `@obr/fontawesome/dist/${lowercase(req.spec)}/${req.icon}.svg`));
  } catch (e: unknown) {
    throw new NotFoundError(Vendor.fontawesome, `${req.spec}/${req.icon}`);
  }

  // Parse SVG to AST
  const $ = cheerio.load(file.toString('utf-8'));
  const $svg = $('svg');

  // Update attributes
  if (req.color) {
    $svg.attr('color', `#${req.color}`);
    $svg.attr('fill', `#${req.color}`);
  }

  $svg.attr('width', String(req.size));
  $svg.attr('height', String(req.size));

  // Export icon
  const svg = $.html('svg');

  return svg;
}

export async function browse(req: BrowseRequest): Promise<BrowseResponse> {
  const pkg = path.resolve('node_modules', `@obr/${req.vendor}`);
  const files = await readPackage(`**/*.svg`, `${pkg}/dist`);

  const icons = files
    .map(i => {
      const parsed = path.parse(i);
      let prefix: string = 'fa';

      if (parsed.dir === 'solid') {
        prefix = 'fa/s';
      } else if (parsed.dir === 'regular') {
        prefix = 'fa/r';
      } else if (parsed.dir === 'brands') {
        prefix = 'fa/b';
      }

      return `${req.url}/${prefix}/${parsed.name}`;
    });

  return {
    vendor: req.vendor,
    count: icons.length,
    icons
  }
}
