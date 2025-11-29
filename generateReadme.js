const fs = require('node:fs');
const path = require('node:path');
const { v4 } = require('uuid')
const { create } = require('xmlbuilder2');

const config = {
    contact: {
        website: 'kotleni.github.io',
        email: 'yavarenikya@gmail.com',
        linkedin: 'kotleni',
        telegram: 'kotleni',
    }
};

const assetsDir = path.join(__dirname, 'assets');
if (!fs.existsSync(assetsDir)) fs.mkdirSync(assetsDir);

function getStyles() {
    return `
    .text { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif; }
    .btn-bg { fill: #f6f8fa; stroke: #d0d7de; stroke-width: 1px; rx: 6px; }
    .btn-text { fill: #24292e; font-size: 14px; font-weight: 600; }
    
    @media (prefers-color-scheme: dark) {
        .btn-bg { fill: #21262d; stroke: #30363d; }
        .btn-text { fill: #c9d1d9; }
    }
    `;
}

function createSvg(width, height) {
    const doc = create().ele('svg', {
        width, height, viewBox: `0 0 ${width} ${height}`,
        xmlns: 'http://www.w3.org/2000/svg'
    });
    doc.ele('style').txt(getStyles());
    return doc;
}

function generateButton(key, value) {
    const icons = { website: 'Website', email: 'Mail', linkedin: 'LinkedIn', telegram: 'Telegram' };
    const label = icons[key] || key;

    const width = 110;
    const height = 32;
    const doc = createSvg(width, height);

    const g = doc.ele('g');
    g.ele('rect').att('class', 'btn-bg').att('x', 0.5).att('y', 0.5).att('width', width - 1).att('height', height - 1);
    g.ele('text').att('class', 'text btn-text').att('x', width / 2).att('y', 21).att('text-anchor', 'middle').txt(label);

    const filename = `btn_${key}.svg`;
    fs.writeFileSync(path.join(assetsDir, filename), doc.end({ prettyPrint: true }));
    return filename;
}

(async () => {
    const links = [];
    const getUrl = (key, val) => {
        if (key === 'email') return `mailto:${val}`;
        if (key === 'linkedin') return `https://www.linkedin.com/in/${val}/`;
        if (key === 'telegram') return `https://t.me/${val}`;
        if (key === 'website') return `https://${val}`;
        return val;
    };

    Object.entries(config.contact).forEach(([key, val]) => {
        if (!val) return;
        const filename = generateButton(key, val);
        links.push(`<a href='${getUrl(key, val)}'><img src='./assets/${filename}' height='32'></a>`);
    });

    console.log(`<!-- ${v4()} -->`);
    console.log(`<p align="center">`);
    console.log(links.join(' '));
    console.log(`</p>`);
})();
