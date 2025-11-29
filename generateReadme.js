const fs = require('node:fs');
const path = require('node:path');
const { create } = require('xmlbuilder2');

const config = {
    githubUsername: 'kotleni',
    contact: {
        website: 'https://kotleni.github.io',
        email: 'yavarenikya@gmail.com',
        linkedin: 'kotleni',
        telegram: 'kotleni',
    },
};

function getCommonStyle() {
    return `
    .text { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif; }
    .title { font-weight: 700; font-size: 20px; }
    .subtitle { font-weight: 400; font-size: 14px; }
    .btn-text { font-weight: 600; font-size: 12px; text-anchor: middle; }
    
    /* Light Mode */
    .fill-text { fill: #24292e; }
    .fill-sub { fill: #586069; }
    .btn-bg { fill: #f3f4f6; stroke: #d1d5da; stroke-width: 1px; rx: 6px; }

    /* Dark Mode */
    @media (prefers-color-scheme: dark) {
        .fill-text { fill: #c9d1d9; }
        .fill-sub { fill: #8b949e; }
        .btn-bg { fill: #21262d; stroke: #30363d; }
    }
    `;
}

function createBaseSvg(width, height) {
    const doc = create().ele('svg', {
        width: width,
        height: height,
        viewBox: `0 0 ${width} ${height}`,
        xmlns: 'http://www.w3.org/2000/svg'
    });
    doc.ele('style').txt(getCommonStyle());
    return doc;
}

function saveSvg(doc, filename) {
    const xml = doc.end({ prettyPrint: true });
    fs.writeFileSync(path.join(__dirname, filename), xml);
}

function generateHeader() {
    const width = 800;
    const height = 80;
    const doc = createBaseSvg(width, height);

    // Logic
    const today = new Date();
    const nextYear = today.getFullYear() + 1;
    const diff = new Date(nextYear, 0, 1) - today;
    const daysLeft = Math.ceil(diff / (1000 * 60 * 60 * 24));

    let emoji = '⏳';
    let subText = 'Keep pushing forward.';

    if (daysLeft === 0) { emoji = '🎆'; subText = `Happy ${nextYear}!`; }
    else if (daysLeft <= 31) { emoji = '🎄'; }
    else if (daysLeft <= 60) { emoji = '❄️'; }

    const titleText = `${emoji} Days until New Year: ${daysLeft}`;

    const g = doc.ele('g');

    g.ele('text')
        .att('class', 'text title fill-text')
        .att('x', '50%').att('y', 35)
        .att('text-anchor', 'middle')
        .txt(titleText);

    // Subtitle
    g.ele('text')
        .att('class', 'text subtitle fill-sub')
        .att('x', '50%').att('y', 60)
        .att('text-anchor', 'middle')
        .txt(subText);

    saveSvg(doc, 'header.svg');
}

function generateButton(key, value) {
    const icons = {
        website: '🌍',
        email: '📫',
        linkedin: '💼',
        telegram: '💬'
    };

    let label = key.charAt(0).toUpperCase() + key.slice(1);
    let icon = icons[key] || '🔗';

    const textStr = `${icon}  ${label}`;
    const width = 24 + (textStr.length * 8);
    const height = 30;

    const doc = createBaseSvg(width, height);

    const g = doc.ele('g');

    g.ele('rect')
        .att('class', 'btn-bg')
        .att('width', width - 1) // minus stroke width
        .att('height', height - 1)
        .att('x', 0.5).att('y', 0.5);

    g.ele('text')
        .att('class', 'text btn-text fill-text')
        .att('x', width / 2).att('y', 19) // vertically centered manually
        .txt(textStr);

    const filename = `btn_${key}.svg`;
    saveSvg(doc, filename);
    return filename;
}

(async () => {
    generateHeader();

    const links = [];
    const { contact } = config;

    const getUrl = (key, val) => {
        if (key === 'email') return `mailto:${val}`;
        if (key === 'linkedin') return `https://www.linkedin.com/in/${val}/`;
        if (key === 'telegram') return `https://t.me/${val}`;
        return val;
    };

    Object.entries(contact).forEach(([key, val]) => {
        if (!val) return;

        const filename = generateButton(key, val);

        const url = getUrl(key, val);
        links.push(`<a href='${url}'><img src='${filename}'></a>`);
    });

    console.log(`<p align="center">`);
    console.log(`  <img src="./header.svg" width="100%" alt="Header" />`);
    console.log(`</p>\n`);

    console.log(`<p align="center">`);
    console.log(links.join(' ')); // Space separated buttons
    console.log(`</p>`);
})();
