import * as cheerio from "cheerio";
import fs from "fs/promises";
import path from "path";

const USERNAME = "";
const PASSWORD = "";

const url = process.argv[2];

console.log("");
console.log("Grabbing - " + url);
console.log("");

async function main() {
  fetchNode(url);
}

main();

async function fetchNode(url) {
  var headers = new Headers({
    Authorization: `Basic ${btoa(USERNAME + ":" + PASSWORD)}`,
  });

  const res = await fetch(url, { headers: headers });

  // download files

  const node = url.split("/").slice(-1)[0];

  if (node?.includes(".")) {
    const buffer = await res.arrayBuffer();

    await fs.mkdir(path.join(url.slice(23, -node.length)), { recursive: true });

    fs.writeFile(
      path.join(url.slice(23, -node.length), node),
      Buffer.from(buffer)
    );
    return;
  }

  const html = await res.text();
  const $ = cheerio.load(html);

  const hrefs = $(".link a")
    .slice(1)
    .map(function () {
      // console.log($(this).attr("href"));
      return $(this).attr("href");
    })
    .toArray();

  hrefs.forEach((href) => {
    fetchNode(url + "/" + href);
  });
}
