import { IncomingMessage } from "http";
import { PDFOptions } from "puppeteer-core";
import { toBoolean } from "./casts";

export function parseRequest(req: IncomingMessage): Promise<string> {
  return new Promise(resolve => {
    let body: string = "";

    req.on("data", chunk => {
      body += chunk.toString();
    });
    req.on("end", () => {
      resolve(body);
    });
  });
}

export function parseJsonRequest(req: IncomingMessage): Promise<PostRequest> {
  return new Promise(resolve => {
    let body: string = "";

    req.on("data", chunk => {
      body += chunk.toString();
    });
    req.on("end", () => {
      resolve(JSON.parse(body));
    });
  });
}

export function parsePdfOptions(query: QueryParams): PDFOptions {
  const options: PDFOptions = {};

  // if (query.path !== undefined) {
  //   options.path = query.path;
  // }

  if (query.scale !== undefined) {
    options.scale = Number.parseFloat(query.scale);
  }

  if (query.displayHeaderFooter !== undefined) {
    options.displayHeaderFooter = toBoolean(query.displayHeaderFooter);
  }

  if (query.headerTemplate !== undefined) {
    options.headerTemplate = query.headerTemplate;
  }

  if (query.footerTemplate !== undefined) {
    options.footerTemplate = query.footerTemplate;
  }

  if (query.printBackground !== undefined) {
    options.printBackground = toBoolean(query.printBackground);
  }

  if (query.landscape !== undefined) {
    options.landscape = toBoolean(query.landscape);
  }

  if (query.pageRanges !== undefined) {
    options.pageRanges = query.pageRanges;
  }

  if (query.format !== undefined) {
    options.format = query.format;
  }

  if (query.width !== undefined) {
    options.width = Number.parseInt(query.width);
  }

  if (query.height !== undefined) {
    options.height = Number.parseInt(query.height);
  }

  if (query.preferCSSPageSize !== undefined) {
    options.preferCSSPageSize = toBoolean(query.preferCSSPageSize);
  }

  if (query.marginTop !== undefined) {
    options.margin = options.margin || {};
    options.margin.top = Number.parseInt(query.marginTop);
  }

  if (query.marginRight !== undefined) {
    options.margin = options.margin || {};
    options.margin.right = Number.parseInt(query.marginRight);
  }

  if (query.marginBottom !== undefined) {
    options.margin = options.margin || {};
    options.margin.bottom = Number.parseInt(query.marginBottom);
  }

  if (query.marginLeft !== undefined) {
    options.margin = options.margin || {};
    options.margin.left = Number.parseInt(query.marginLeft);
  }

  return options;
}
