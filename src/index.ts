#!/usr/bin/env node

import yargs from "yargs";
import fs from "fs";
import render, { Format } from "./renderer";

const args = yargs(process.argv.slice(2))
  .scriptName("dbml-renderer")
  .usage("Usage: $0 [options]")
  .example("$0 -i schema.dbml", "Render the given file and output to stdout")
  .alias("h", "help")
  .option("input", {
    demandOption: true,
    alias: "i",
    type: "string",
    description: "DBML file",
    coerce: (arg) => {
      if (!fs.existsSync(arg)) {
        throw new Error(`Could not find file '${arg}'`);
      }

      return fs.readFileSync(arg, "utf-8");
    },
  })
  .option("format", {
    alias: "f",
    type: "string",
    choices: ["dot", "svg"],
    default: "svg",
    description: "Output format",
    coerce: (arg) => arg as Format,
  })
  .option("output", {
    alias: "o",
    type: "string",
    default: "-",
    description: "Output file",
    coerce: (arg) => {
      return arg === "-"
        ? console.log
        : (content: string) => fs.writeFileSync(arg, content);
    },
  }).argv;

args.output(render(args.input, args.format));
