const sharp = require("sharp");
const { slugify } = require("./utils");

const OUTPUT_DIR = "./static/images/social/";

const CONTEXT = process.env.CONTEXT || "local";

async function create(name, values, postFix) {
  const fileName = postFix ? slugify(name) + "-" + postFix : slugify(name);
  const returnFileName = "/images/social/" + fileName + ".png";
  // only create on branch deploys / production
  if (CONTEXT !== "production" && CONTEXT !== "branch-deploy")
    return returnFileName;
  var svg = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
    <svg width="1200" height="630" viewBox="0 0 1200 630" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="1200" height="630" fill="black"/>
<line x1="258" y1="277.5" x2="942" y2="277.5" stroke="white"/>
<line x1="258" y1="426.5" x2="942" y2="426.5" stroke="white"/>
<text fill="white" xml:space="preserve" style="white-space: pre" font-family="Helvetica Neue" font-size="58" font-weight="bold" letter-spacing="0.03em"><tspan x="258" y="256.4">${name}</tspan></text>
<text fill="white" xml:space="preserve" style="white-space: pre" font-family="Maple" font-size="16" letter-spacing="0.04em"><tspan x="490" y="370">of defendants did not have </tspan><tspan x="490" y="394">legal representation</tspan></text>
<text fill="white" xml:space="preserve" style="white-space: pre" font-family="Maple" font-size="16" letter-spacing="0.04em"><tspan x="258" y="370">lawsuits from January </tspan><tspan x="258" y="394">2020 to December 2020</tspan></text>
<text fill="white" xml:space="preserve" style="white-space: pre" font-family="Maple" font-size="16" letter-spacing="0.04em"><tspan x="732" y="370">of lawsuits resulted in </tspan><tspan x="732" y="394">default judgments&#10;</tspan></text>
<text fill="#EA4A2E" xml:space="preserve" style="white-space: pre" font-family="Helvetica Neue" font-size="48" font-weight="bold" letter-spacing="0.01em"><tspan x="258" y="340.76">${values[0]}</tspan></text>
<text fill="#EA4A2E" xml:space="preserve" style="white-space: pre" font-family="Helvetica Neue" font-size="48" font-weight="bold" letter-spacing="0.04em"><tspan x="490" y="340.76">${values[1]}</tspan></text>
<text fill="#EA4A2E" xml:space="preserve" style="white-space: pre" font-family="Helvetica Neue" font-size="48" font-weight="bold" letter-spacing="0.04em"><tspan x="732" y="340.76">${values[2]}</tspan></text>
</svg>`;
  var buf = new Buffer.from(svg);
  await sharp(buf).toFile(OUTPUT_DIR + fileName + ".png");
  return "/images/social/" + fileName + ".png";
}

module.exports = create;
