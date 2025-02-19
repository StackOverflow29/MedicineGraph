export class NodeDocumentManager {
  constructor() {
    this.currentNodeId = null;
    this.createModal();
  }
  
  createModal() {
    this.modal = document.createElement("div");
    this.modal.id = "node-document-modal";
    Object.assign(this.modal.style, {
      display: "none",
      position: "fixed",
      top: "0",
      left: "0",
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      zIndex: "1000",
      overflow: "auto",
      fontFamily: "'Nanum Gothic', sans-serif"
    });
    
    const content = document.createElement("div");
    content.id = "node-document-content";
    Object.assign(content.style, {
      margin: "5% auto",
      width: "80%",
      backgroundColor: "white",
      padding: "20px",
      borderRadius: "8px",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
      fontFamily: "'Nanum Gothic', sans-serif"
    });
    
    const header = document.createElement("h2");
    header.id = "node-document-header";
    header.style.marginBottom = "20px";
    content.appendChild(header);
    
    const editorContainer = document.createElement("div");
    editorContainer.id = "quill-editor";
    editorContainer.style.height = "300px";
    content.appendChild(editorContainer);
    
    const buttonContainer = document.createElement("div");
    buttonContainer.style.marginTop = "20px";
    
    const saveButton = document.createElement("button");
    saveButton.innerText = "저장";
    saveButton.style.marginRight = "10px";
    saveButton.addEventListener("click", () => this.saveDocument());
    buttonContainer.appendChild(saveButton);
    
    const closeButton = document.createElement("button");
    closeButton.innerText = "닫기";
    closeButton.addEventListener("click", () => this.closeModal());
    buttonContainer.appendChild(closeButton);
    
    content.appendChild(buttonContainer);
    this.modal.appendChild(content);
    document.body.appendChild(this.modal);
    
    // Quill 에디터 초기화 (CDN을 통해 Quill이 로드되어 있어야 합니다)
    this.quill = new Quill("#quill-editor", {
      theme: "snow",
      modules: {
        toolbar: [
          [{ header: [1, 2, 3, false] }],
          ["bold", "italic", "underline"],
          [{ list: "ordered" }, { list: "bullet" }],
          ["link", "image"],
          ["clean"]
        ]
      }
    });
  }
  
  openModal(nodeId, nodeLabel) {
    document.getElementById("node-document-header").innerText = `문서: ${nodeLabel}`;
    this.currentNodeId = nodeId;
    // localStorage에서 저장된 문서를 불러옵니다.
    const storedDoc = localStorage.getItem(`nodeDocument_${nodeId}`);
    this.quill.root.innerHTML = storedDoc || "";
    this.modal.style.display = "block";
  }
  
  saveDocument() {
    const content = this.quill.root.innerHTML;
    // localStorage에 현재 노드의 문서를 저장합니다.
    localStorage.setItem(`nodeDocument_${this.currentNodeId}`, content);
    alert("저장되었습니다.");
    this.closeModal();
  }
  
  closeModal() {
    this.modal.style.display = "none";
  }
}
