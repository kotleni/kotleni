const crypto = require('crypto');

const USERNAME = 'kotleni';
const CACHED_UUID = crypto.randomUUID();

const statsImage = `
<picture>
  <source
    srcset="https://github-readme-stats.vercel.app/api?username=${USERNAME}&theme=dark&show_icons=false&hide_border=true&hide_title=true&cached=${CACHED_UUID}"
    media="(prefers-color-scheme: dark)"
  />
  <source
    srcset="https://github-readme-stats.vercel.app/api?username=${USERNAME}&show_icons=false&hide_border=true&hide_title=true&cached=${CACHED_UUID}"
    media="(prefers-color-scheme: light), (prefers-color-scheme: no-preference)"
  />
  <img align=center src="https://github-readme-stats.vercel.app/api?username=${USERNAME}&show_icons=false&hide_border=true&hide_title=true&cached=${CACHED_UUID}" />
</picture>`;

const topLangsImage = `
<picture>
  <source
    srcset="https://github-readme-stats.vercel.app/api/top-langs/?username=${USERNAME}&hide_border=true&theme=dark&layout=compact&cached=${CACHED_UUID}"
    media="(prefers-color-scheme: dark)"
  />
  <source
    srcset="https://github-readme-stats.vercel.app/api/top-langs/?username=${USERNAME}&hide_border=true&layout=compact&cached=${CACHED_UUID}"
    media="(prefers-color-scheme: light), (prefers-color-scheme: no-preference)"
  />
  <img align=center src="https://github-readme-stats.vercel.app/api/top-langs/?username=${USERNAME}&hide_border=true&layout=compact&cached=${CACHED_UUID}" />
</picture>`;

const committersBadge = `
<a href="https://committers.top/ukraine#${USERNAME}">
  <img src="https://user-badge.committers.top/ukraine/${USERNAME}.svg?cached=${CACHED_UUID}" />
</a>`;

const contactInfo = `
### Contact me
- 📫 **Email**: [yavarenikya@gmail.com](mailto:yavarenikya@gmail.com)
- 🧭 **LinkedIn**: [linkedin.com/kotleni](https://www.linkedin.com/in/kotleni/)
- 💬 **Telegram**: [@kotleni](https://t.me/kotleni)`;

const readmeContent = `
${statsImage}
${topLangsImage}
<br>
${committersBadge}
${contactInfo}
`;

console.log(readmeContent.trim());