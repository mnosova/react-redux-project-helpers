const glob = require('glob');
const fs  = require('fs');

let locales = {};
const languages = ['ru', 'en', 'ua'];
glob(__dirname + '/frontend/**/*.json', {}, async (err, files) => {
  await files.forEach(async file => {
    const str = await fs.readFileSync(file, 'utf-8');
    try {
      const obj = JSON.parse(str);
      const [, filename] = file.match(/\/([A-z.]+)\.json$/);
      if(locales[filename]) {
        locales[filename] = { ...locales[filename], ...obj };
      } else {
        locales = { ...locales, ...{ [filename]: obj } };
      }
    } catch (e) {
      console.error(e);
      console.log(file);
    }
  });

  const i18n = { ru: {}, en: {}, ua: {} };
  for(const component in locales) {
    for(const key in locales[component]) {
      languages.forEach(lang => {
        if(locales[component][key][lang]) {
          if(!i18n[lang][component]) {
            i18n[lang][component] = {};
          }
          i18n[lang][component][key] = locales[component][key][lang];
        }
      });
    }
  }
  for(const lang in i18n) {
    fs.writeFileSync(`public/locales/${lang === 'ua' ? 'uk' : lang}/translation.json`, JSON.stringify(i18n[lang], null, '\t'));
  }
});

