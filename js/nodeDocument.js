export class NodeDocumentManager{
  constructor() {
    // 초기 documents 객체는 사용하지 않고, 서버에서 직접 읽어올 예정
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
    // 서버에서 해당 노드의 문서를 불러옴
    fetch(`/api/node/${nodeId}`)
      .then(res => res.json())
      .then(data => {
        this.quill.root.innerHTML = data.document || "";
        this.modal.style.display = "block";
      })
      .catch(err => {
        console.error(err);
        this.quill.root.innerHTML = "";
        this.modal.style.display = "block";
      });
  }
  
  saveDocument() {
    const content = this.quill.root.innerHTML;
    fetch(`/api/node/${this.currentNodeId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ document: content })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        alert("저장되었습니다.");
        this.closeModal();
      } else {
        alert("저장에 실패했습니다.");
      }
    })
    .catch(err => {
      console.error(err);
      alert("서버 오류 발생");
    });
  }
  
  closeModal() {
    this.modal.style.display = "none";
  }
}
