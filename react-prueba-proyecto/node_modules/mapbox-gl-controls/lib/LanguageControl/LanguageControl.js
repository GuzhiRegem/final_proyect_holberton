import getLanguageField from './getLanguageField';
import localizeTextField from './localizeTextField';
import Base from '../Base/Base';
const SUPPORTED_LANGUAGES = ['en', 'es', 'fr', 'de', 'ru', 'zh', 'pt', 'ar', 'ja', 'ko', 'mul'];
export default class LanguageControl extends Base {
    constructor(options) {
        var _a, _b, _c;
        super();
        this.supportedLanguages = (_a = options === null || options === void 0 ? void 0 : options.supportedLanguages) !== null && _a !== void 0 ? _a : SUPPORTED_LANGUAGES;
        this.language = options === null || options === void 0 ? void 0 : options.language;
        this.getLanguageField = (_b = options === null || options === void 0 ? void 0 : options.getLanguageField) !== null && _b !== void 0 ? _b : getLanguageField;
        this.excludedLayerIds = (_c = options === null || options === void 0 ? void 0 : options.excludedLayerIds) !== null && _c !== void 0 ? _c : [];
        this.styleChangeListener = this.styleChangeListener.bind(this);
    }
    onAddControl() {
        this.map.on('styledata', this.styleChangeListener);
    }
    onRemoveControl() {
        this.map.off('styledata', this.styleChangeListener);
    }
    styleChangeListener() {
        this.map.off('styledata', this.styleChangeListener);
        this.setLanguage(this.language);
    }
    setLanguage(lang = this.browserLanguage()) {
        const language = this.supportedLanguages.indexOf(lang) < 0 ? 'mul' : lang;
        const style = this.map.getStyle();
        const languageField = this.getLanguageField(language);
        const layers = style.layers.map((layer) => {
            if (layer.type !== 'symbol')
                return layer;
            if (!layer.layout || !layer.layout['text-field'])
                return layer;
            if (this.excludedLayerIds.indexOf(layer.id) !== -1)
                return layer;
            const textField = layer.layout['text-field'];
            const textFieldLocalized = localizeTextField(textField, languageField);
            return Object.assign(Object.assign({}, layer), { layout: Object.assign(Object.assign({}, layer.layout), { 'text-field': textFieldLocalized }) });
        });
        this.map.setStyle(Object.assign(Object.assign({}, style), { layers }));
    }
    browserLanguage() {
        const language = navigator.languages ? navigator.languages[0] : navigator.language;
        const parts = language.split('-');
        const languageCode = parts.length > 1 ? parts[0] : language;
        if (this.supportedLanguages.indexOf(languageCode) > -1)
            return languageCode;
        return 'mul';
    }
}
//# sourceMappingURL=LanguageControl.js.map