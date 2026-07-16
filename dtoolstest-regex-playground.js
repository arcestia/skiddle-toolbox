// Simulate the regex playground JS logic in Node

const TEMPLATES = {
  email: {
    pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$',
    flags: 'gm',
    test: 'hello@example.com\ninvalid-email@\nanother.user+tag@domain.co.uk'
  },
  url: {
    pattern: '^(https?:\/\/)?(www\.)?([a-zA-Z0-9-]+)\.([a-zA-Z]{2,})(\/[a-zA-Z0-9-_./?%&=]*)?$',
    flags: 'gm',
    test: 'https://www.google.com/search?q=regex\nhttp://example.org/path/to/page\ninvalid_url'
  },
  phone: {
    pattern: '\(?(\d{3})\)?[-. ]?(\d{3})[-. ]?(\d{4})',
    flags: 'g',
    test: 'Call me at (123) 456-7890 or 987-654-3210.\nWork number is 555.123.4567.'
  },
  html: {
    pattern: '<([a-z1-6]+)([^>]*)>(.*?)</\1>',
    flags: 'gi',
    test: '<div>Hello <b>world</b>!</div>\n<p class="text">Paragraph content</p>'
  },
  ipv4: {
    pattern: '\b(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\b',
    flags: 'g',
    test: 'IP addresses detected: 192.168.1.1, 10.0.0.254, 999.999.999.999 (invalid)'
  }
};

console.log('Template test string raw values:');
for (const [key, t] of Object.entries(TEMPLATES)) {
  const converted = t.test.replace(/\n/g, '\n');
  console.log(`  ${key}: has ${(converted.match(/\n/g) || []).length} newlines after conversion`);
  console.log(`    raw: ${JSON.stringify(t.test)}`);
  console.log(`    converted: ${JSON.stringify(converted)}`);
}

console.log('\nJoin with "\\n":');
const matches = [['a'], ['b']];
console.log(matches.map(m => m[0]).join('\n'));

console.log('\nPHP snippet:');
const pattern = 'test';
const flags = 'g';
console.log('$pattern = "' + pattern + '/' + flags + '";');

console.log('\nJS snippet join with "\\n":');
const jsLines = ['line1', 'line2'];
console.log(JSON.stringify(jsLines.join('\n')));
