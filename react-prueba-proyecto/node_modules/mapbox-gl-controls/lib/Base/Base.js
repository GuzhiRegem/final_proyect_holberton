class Base {
    constructor() {
        this.node = document.createElement('div');
        this.node.classList.add('mapboxgl-ctrl');
        this.node.classList.add('mapboxgl-ctrl-group');
        this.node.classList.add('mapbox-control');
    }
    addButton(button) {
        this.node.appendChild(button.node);
    }
    addClassName(className) {
        this.node.classList.add(className);
    }
    removeClassName(className) {
        this.node.classList.remove(className);
    }
    onAddControl() {
        // extend
    }
    onRemoveControl() {
        // extend
    }
    onAdd(map) {
        this.map = map;
        this.onAddControl();
        return this.node;
    }
    onRemove() {
        this.onRemoveControl();
        this.node.parentNode.removeChild(this.node);
        this.map = undefined;
    }
}
export default Base;
//# sourceMappingURL=Base.js.map