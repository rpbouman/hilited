class HilitedPeripherals {
  
  #hilited = undefined;
    
  get #container(){
    const hilitedElementEditor = this.#hilited.element;
    const container = hilitedElementEditor.parentNode;
    return container;
  }
  
  get #lengthEl(){
    const container = this.#container;
    const lengthEl = container.querySelector('output[name=length]');
    return lengthEl;
  }
  
  get #linesEl(){
    const container = this.#container;
    const linesEl = container.querySelector('output[name=lines]');
    return linesEl;
  }

  get #lineEl(){
    const container = this.#container;
    const lineEl = container.querySelector('output[name=line]');
    return lineEl;
  }

  get #columnEl(){
    const container = this.#container;
    const columnEl = container.querySelector('output[name=column]');
    return columnEl;
  }
  
  get #positionEl(){
    const container = this.#container;
    const positionEl = container.querySelector('output[name=position]');
    return positionEl;
  }

  get #gutterEl(){
    const container = this.#container;
    const gutter = container.querySelector('.hilited-gutter'); 
    return gutter;
  }
      
  #changeHandler = (event) => {
    this.#updateLengthAndLines(
      event.detail.text.length + 1, 
      event.detail.lineCount
    );
  }

  #updateLengthAndLines(length, lines){
    this.#lengthEl.textContent = length;
    this.#linesEl.textContent = lines;
  }
  
  #selectionHandler = (event) => {
    this.#lineEl.textContent = event.detail.line;
    this.#columnEl.textContent = event.detail.column;
    this.#positionEl.textContent = event.detail.position;
  }
  
  #resizeHandler = (event) => {
    this.#syncGutterLines(event);
  }
  
  #syncGutterLines(event){
    const hilitedElementEditor = this.#hilited.element;
    const height = hilitedElementEditor.offsetHeight;
    const gutter = this.#gutterEl;
    let last = gutter.lastElementChild;
    let childHeight = last ? last.offsetTop + last.clientHeight : 0;
    while (childHeight < height) {
      const child = document.createElement('div');
      child.textContent = String.fromCharCode(160);
      gutter.appendChild(child);
      childHeight = child.offsetTop + child.clientHeight;
    }
    while (
      (last = gutter.lastElementChild) &&
      (last.offsetTop + last.clientHeight) > height
    ){
      gutter.removeChild(last);
    }
  }
  
  destroy(){
    hilitedElementEditor.removeEventListener('hilited:change', this.#changeHandler);
    hilitedElementEditor.removeEventListener('hilited:select', this.#selectionHandler);
    hilitedElementEditor.removeEventListener('hilited:resize', this.#resizeHandler);
  }  

  constructor(options){
    this.#hilited = options.hilited;
    const hilitedElementEditor = this.#hilited.element;
    // seed initial display state
    this.#updateLengthAndLines(
      hilited.getText().length + 1, 
      hilited.getLineCount()
    );
    this.#syncGutterLines();

    hilitedElementEditor.addEventListener('hilited:change', this.#changeHandler);
    hilitedElementEditor.addEventListener('hilited:select', this.#selectionHandler);
    hilitedElementEditor.addEventListener('hilited:resize', this.#resizeHandler);
    hilitedElementEditor.focus();
  }
}