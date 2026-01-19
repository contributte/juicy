import * as cheerio from "cheerio";
import path from "path";
import { readFile, readPackage } from "../utils";
import { NotFoundError } from "../errors";
import { Vendor } from "../app";

export async function generate(req: GenerateRequest): Promise<string> {
  try {
    // Read icon file
    var file = await readFile(path.resolve('node_modules', `@obr/linearicons/dist/${req.icon}.svg`));
  } catch (e: unknown) {
    throw new NotFoundError(Vendor.linearicons, req.icon);
  }

  // Parse SVG to AST
  const $ = cheerio.load(file.toString('utf-8'));
  const $svg = $('svg');

  // Update attributes
  $svg.attr('xmlns', 'http://www.w3.org/2000/svg');
  $svg.removeAttr('xlink');
  $svg.removeAttr('version');

  if (req.color) {
    $svg.attr('color', `#${req.color}`);
    $svg.attr('fill', `#${req.color}`);
  }

  $svg.attr('width', String(req.size));
  $svg.attr('height', String(req.size));

  // Update inner structure
  $svg.find('path').map((_index, el) => {
    if ('attribs' in el) {
      el.attribs['fill'] = 'currentColor';
    }

    return el;
  });

  // Export icon
  const svg = $.html('svg');

  return svg;
}

export async function browse(req: BrowseRequest): Promise<BrowseResponse> {
  const pkg = path.resolve('node_modules', `@obr/${req.vendor}`);
  const files = await readPackage(`**/*.svg`, `${pkg}/dist`);

  const icons = files
    .map(i => path.parse(i).name)
    .map(i => `${req.url}/linear/${i}`);

  return {
    vendor: req.vendor,
    count: icons.length,
    icons
  }
}
