export default function localizeTextField(field, lang) {
    if (typeof field === 'string') {
        return field.replace(/{name.*?}/, `{${lang}}`);
    }
    const str = JSON.stringify(field);
    if (Array.isArray(field)) {
        return JSON.parse(str.replace(/"coalesce",\["get","name.*?"]/g, `"coalesce",["get","${lang}"]`));
    }
    return JSON.parse(str.replace(/{name.*?}/g, `{${lang}}`));
}
//# sourceMappingURL=localizeTextField.js.map