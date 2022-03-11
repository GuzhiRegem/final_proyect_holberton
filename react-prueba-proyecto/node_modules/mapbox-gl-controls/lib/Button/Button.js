class Button {
    constructor() {
        this.node = document.createElement('button');
        this.node.type = 'button';
        this.icon = null;
    }
    setIcon(icon) {
        this.icon = icon;
        this.node.appendChild(icon);
    }
    setText(text) {
        this.node.textContent = text;
    }
    onClick(callback) {
        this.node.addEventListener('click', callback);
    }
    addClassName(className) {
        this.node.classList.add(className);
    }
    removeClassName(className) {
        this.node.classList.remove(className);
    }
}
export default Button;
//# sourceMappingURL=Button.js.map