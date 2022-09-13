const fs = require("fs");
const path = require("path");
const config = require("./config");

const filterByFamily = (item) => {
  const { family } = item;
  return family === config.family;
};

const mapIcon = ({ name }) => name;

const prefixes = {
  regular: "far",
  solid: "fas",
  brand: "fab",
  light: "fal",
};

const icons = Array.from(
  new Set(
    config.categories
      .reduce((acc, curr) => {
        const category = require(`./categories/${curr}`);
        const filtered = category.filter(filterByFamily);
        return [...acc, ...filtered];
      }, [])
      .map(mapIcon)
  )
);

console.log(icons.length, "icons will be included in the subset");

const outFile = path.join(__dirname, "out", `${config.projectName}.yml`);
const result = `
projectName: ${config.projectName}
version: ${config.version}
icons:
${icons
  .map((iconName) => {
    return `  - ${iconName}:\n      - ${config.weight}`;
  })
  .join("\n")}
`;

fs.writeFileSync(outFile, result);

console.log("config was written to", outFile);

const outJson = path.join(__dirname, "out", `${config.projectName}.json`);
const result2 = JSON.stringify(
  icons.map((icon) => {
    return {
      name: icon,
      prefix: prefixes[config.weight],
    };
  }),
  null,
  2
);

fs.writeFileSync(outJson, result2);

console.log("JSON was written to", outJson);
