import * as cheerio from "cheerio";
import path from "path";
import { readFile, lowercase, readPackage } from "../utils";
import { NotFoundError } from "../errors";
import { Vendor } from "../app";

// const SPECS = [
//   'buildings',
//   'business',
//   'communication',
//   'design',
//   'development',
//   'device',
//   'document',
//   'editor',
//   'finance',
//   'health',
//   'logos',
//   'map',
//   'media',
//   'others',
//   'system',
//   'user',
//   'weather',
// ];

export async function generate(req: GenerateRequest): Promise<string> {
  try {
    // Read icon file
    var file = await readFile(path.resolve('node_modules', `@obr/remixicon/dist/${lowercase(req.spec)}/${req.icon}.svg`));
  } catch (e: unknown) {
    throw new NotFoundError(Vendor.remixicon, `${req.spec}/${req.icon}`);
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
      return parsed.dir + path.sep + parsed.name;
    })
    .map(i => `${req.url}/remix/${i}`);

  return {
    vendor: req.vendor,
    count: icons.length,
    icons
  }
}
