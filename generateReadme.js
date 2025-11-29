const fs = require('node:fs');
const path = require('node:path');
const { create } = require('xmlbuilder2');

const config = {
    name: 'KOTLENI',
    role: 'Full Stack Developer',
    location: 'Kharkiv, Ukraine',
    contact: {
        website: 'kotleni.io',
        email: 'yavarenikya@gmail.com',
        linkedin: 'kotleni',
        telegram: 'kotleni',
    },
    stats: [
        { label: 'Experience', value: '1+ Years' },
        { label: 'Projects', value: '40+' },
        { label: 'Commits', value: '2.5k' }
    ]
};

const assetsDir = path.join(__dirname, 'assets');
if (!fs.existsSync(assetsDir)) fs.mkdirSync(assetsDir);

function addDefs(root) {
    const defs = root.ele('defs');

    // Soft Drop Shadow (iOS Style)
    const shadow = defs.ele('filter').att('id', 'softShadow').att('x', '-20%').att('y', '-20%').att('width', '140%').att('height', '140%');
    shadow.ele('feDropShadow').att('dx', 0).att('dy', 4).att('stdDeviation', 10).att('flood-color', '#000000').att('flood-opacity', 0.08);

    // Button Shadow
    const btnShadow = defs.ele('filter').att('id', 'btnShadow').att('x', '-20%').att('y', '-20%').att('width', '140%').att('height', '140%');
    btnShadow.ele('feDropShadow').att('dx', 0).att('dy', 2).att('stdDeviation', 4).att('flood-color', '#000000').att('flood-opacity', 0.1);

    // Mesh Gradient
    const grad = defs.ele('linearGradient').att('id', 'meshGrad').att('x1', '0%').att('y1', '0%').att('x2', '100%').att('y2', '100%');
    grad.ele('stop').att('offset', '0%').att('stop-color', '#F2F2F7'); // iOS Light Gray
    grad.ele('stop').att('offset', '100%').att('stop-color', '#FFFFFF');

    // Accent Gradient (Blue)
    const accent = defs.ele('linearGradient').att('id', 'accentGrad').att('x1', '0%').att('y1', '0%').att('x2', '100%').att('y2', '100%');
    accent.ele('stop').att('offset', '0%').att('stop-color', '#007AFF');
    accent.ele('stop').att('offset', '100%').att('stop-color', '#00C7BE');
}

function getStyles() {
    return `
    .text { font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
    .name { font-weight: 700; font-size: 28px; fill: #1C1C1E; letter-spacing: -0.5px; }
    .role { font-weight: 500; font-size: 16px; fill: #8E8E93; }
    .stat-val { font-weight: 600; font-size: 18px; fill: #1C1C1E; }
    .stat-label { font-weight: 500; font-size: 12px; fill: #8E8E93; text-transform: uppercase; letter-spacing: 0.5px; }
    .location { font-weight: 400; font-size: 13px; fill: #aeaeb2; }
    .card-bg { fill: url(#meshGrad); stroke: #E5E5EA; stroke-width: 1px; }
    .icon-circle { fill: url(#accentGrad); }
    .icon-text { fill: #FFFFFF; font-weight: 700; font-size: 24px; }
    
    .btn-bg { fill: #FFFFFF; stroke: #E5E5EA; stroke-width: 0.5px; transition: 0.2s; }
    .btn-text { font-weight: 600; font-size: 14px; fill: #1C1C1E; }
    `;
}

function createSvg(width, height) {
    const doc = create().ele('svg', {
        width, height, viewBox: `0 0 ${width} ${height}`,
        xmlns: 'http://www.w3.org/2000/svg'
    });
    addDefs(doc);
    doc.ele('style').txt(getStyles());
    return doc;
}

function generateHeader() {
    const width = 800;
    const height = 200;
    const doc = createSvg(width, height);

    // Main Card Container (Rounded Rectangle)
    const card = doc.ele('rect')
        .att('class', 'card-bg')
        .att('x', 10).att('y', 10)
        .att('width', width - 20).att('height', height - 20)
        .att('rx', 24)
        .att('filter', 'url(#softShadow)');

    // Avatar / Icon (Left)
    const g = doc.ele('g').att('transform', 'translate(50, 50)');

    g.ele('circle')
        .att('class', 'icon-circle')
        .att('cx', 40).att('cy', 40).att('r', 40);

    g.ele('text')
        .att('class', 'text icon-text')
        .att('x', 40).att('y', 49)
        .att('text-anchor', 'middle')
        .txt(config.name.substring(0, 2));

    // Text Info
    const textGroup = doc.ele('g').att('transform', 'translate(150, 75)');
    textGroup.ele('text').att('class', 'text name').txt(config.name);
    textGroup.ele('text').att('class', 'text role').att('y', 25).txt(config.role);

    // Location with small dot
    const locGroup = textGroup.ele('g').att('transform', 'translate(0, 55)');
    locGroup.ele('circle').att('cx', 4).att('cy', -4).att('r', 3).att('fill', '#34C759'); // Green dot
    locGroup.ele('text').att('class', 'text location').att('x', 15).txt(config.location);

    // Stats Widget (Right Side)
    const statsStart = 500;
    config.stats.forEach((stat, i) => {
        const x = statsStart + (i * 90);
        const sg = doc.ele('g').att('transform', `translate(${x}, 90)`);

        // Vertical divider
        if (i > 0) {
            doc.ele('line')
                .att('x1', x - 20).att('y1', 80).att('x2', x - 20).att('y2', 120)
                .att('stroke', '#E5E5EA').att('stroke-width', 1);
        }

        sg.ele('text').att('class', 'text stat-val').att('text-anchor', 'middle').txt(stat.value);
        sg.ele('text').att('class', 'text stat-label').att('y', 20).att('text-anchor', 'middle').txt(stat.label);
    });

    fs.writeFileSync(path.join(assetsDir, 'header.svg'), doc.end({ prettyPrint: true }));
}

function generateButton(key, value) {
    const icons = { website: 'Safari', email: 'Mail', linkedin: 'in', telegram: 'Chat' };
    const label = icons[key] || key;

    const width = 110;
    const height = 40;
    const doc = createSvg(width, height);

    const g = doc.ele('g');

    // Pill Shape
    g.ele('rect')
        .att('class', 'btn-bg')
        .att('x', 2).att('y', 2)
        .att('width', width - 4).att('height', height - 4)
        .att('rx', 18)
        .att('filter', 'url(#btnShadow)');

    // Text
    g.ele('text')
        .att('class', 'text btn-text')
        .att('x', width / 2).att('y', 25)
        .att('text-anchor', 'middle')
        .txt(label);

    const filename = `btn_${key}.svg`;
    fs.writeFileSync(path.join(assetsDir, filename), doc.end({ prettyPrint: true }));
    return filename;
}

(async () => {
    generateHeader();

    const links = [];
    const getUrl = (key, val) => {
        if (key === 'email') return `mailto:${val}`;
        if (key === 'linkedin') return `https://www.linkedin.com/in/${val}/`;
        if (key === 'telegram') return `https://t.me/${val}`;
        return val;
    };

    Object.entries(config.contact).forEach(([key, val]) => {
        if (!val) return;
        const filename = generateButton(key, val);
        links.push(`<a href='${getUrl(key, val)}'><img src='./assets/${filename}' height='40'></a>`);
    });

    console.log(`<p align="center">`);
    console.log(`  <img src="./assets/header.svg" width="100%" alt="Header" />`);
    console.log(`</p>\n`);
    console.log(`<p align="center">`);
    console.log(links.join(' '));
    console.log(`</p>`);
})();
