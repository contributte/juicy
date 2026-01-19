import * as cheerio from "cheerio";
import path from "path";
import { readFile, readPackage } from "../utils";
import { NotFoundError } from "../errors";
import { Vendor } from "../app";

export async function generate(req: GenerateRequest): Promise<string> {
  try {
    // Read icon file
    var file = await readFile(path.resolve('node_modules', `@obr/ikonate/dist/${req.icon}.svg`));
  } catch (e: unknown) {
    throw new NotFoundError(Vendor.ikonate, req.icon);
  }

  // Parse SVG to AST
  const $ = cheerio.load(file.toString('utf-8'));
  const $svg = $('svg');

  // Update attributes
  $svg.removeAttr('role');
  $svg.removeAttr('aria-labelledby');

  if (req.color) {
    $svg.attr('color', `#${req.color}`);
    $svg.attr('stroke', `#${req.color}`);
  } else {
    $svg.attr('color', `#000000`);
    $svg.attr('stroke', `#000000`);
  }

  $svg.attr('fill', 'none');
  $svg.attr('stroke-width', String((req.stroke || 1) * (24/req.size)));
  $svg.attr('stroke-linecap', 'round'); // round|square
  $svg.attr('stroke-linejoin', 'round'); // round|miter
  $svg.attr('width', String(req.size));
  $svg.attr('height', String(req.size));

  // Update inner structure
  $svg.find('title').remove('title');

  // Export icon
  const svg = $.html('svg');

  return svg;
}

export async function browse(req: BrowseRequest): Promise<BrowseResponse> {
  const pkg = path.resolve('node_modules', `@obr/${req.vendor}`);
  const files = await readPackage(`**/*.svg`, `${pkg}/dist`);

  const icons = files
    .map(i => path.parse(i).name)
    .map(i => `${req.url}/ikonate/${i}`);

  return {
    vendor: req.vendor,
    count: icons.length,
    icons
  }
}
