export default (template, data) =>
    template.replace(/{{([^{{]+)}}/g, (_, key) => (typeof data[key.trim()] !== undefined ? `${data[key.trim()]}` : ''));
