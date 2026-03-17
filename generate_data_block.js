const fs = require('fs');
const shops = JSON.parse(fs.readFileSync('final_shops.json', 'utf8'));

let shopsDataBlock = "const shopsData = [\n";
shops.forEach(s => {
  shopsDataBlock += `  { "name": "${s.name}", "address": "${s.address}", "mobile": "${s.mobile}" },\n`;
});
shopsDataBlock += "];";

fs.writeFileSync('shops_data_block.txt', shopsDataBlock);
console.log('Generated shops_data_block.txt');
