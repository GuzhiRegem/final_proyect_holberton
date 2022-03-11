export default function getLanguageField(lang) {
    if (lang === 'mul') {
        return 'name';
    }
    return `name_${lang}`;
}
//# sourceMappingURL=getLanguageField.js.map