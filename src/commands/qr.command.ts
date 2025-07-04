import fs from "fs";
import encodeQR from "qr";
import { ArgumentsCamelCase } from "yargs";
import getAbsolutePath from "../helpers/get-absolute-path";

interface QrCommandArgs {
  content: string;
  output?: string;
}

export default function qrCommand(args: ArgumentsCamelCase<QrCommandArgs>) {
  if (!args.output) {
    const ascii = encodeQR(args.content, "term");
    console.log(ascii);
    return;
  }
  const svgBytes = encodeQR(args.content, "svg");
  const absolutePath = getAbsolutePath(args.output);
  fs.writeFileSync(absolutePath, svgBytes);
}
