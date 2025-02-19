import { mainGraphData, subGraphData } from './data/graphData.js';
import { NodeDocumentManager } from './nodeDocument.js';

// NetworkManager.js 상단에 추가
const vis = window.vis;

export class NetworkManager {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    // NodeDocumentManager 인스턴스 생성
    this.nodeDocManager = new NodeDocumentManager();
    this.initNetwork();
  }
  
  initNetwork() {
    const options = {
      nodes: {
        shape: 'circle',
        font: { size: 14 },
        borderWidth: 2,
        shadow: true
      },
      physics: {
        solver: 'forceAtlas2Based',
        forceAtlas2Based: {
          gravitationalConstant: -50,
          centralGravity: 0.01,
          springLength: 100,
          springConstant: 0.08,
          damping: 0.4,
          avoidOverlap: 1  // 이 옵션을 통해 노드 간 겹침을 줄입니다.
        },
        maxVelocity: 50,
        timestep: 0.35,
        stabilization: { iterations: 150 }
      },
      interaction: {
        hover: false
      }
    };
  
    // 초기 노드와 엣지 생성 로직은 그대로 유지
    const initialNodes = [...mainGraphData.nodes];
    const initialEdges = [...mainGraphData.edges];
  
    // subGraphData 처리 등 추가 코드...
  
    // 각 노드에 대해 스타일 적용
    initialNodes.forEach(node => {
      node.font = { color: "white", size: 14 };
      if (node.category === "disease") {
        node.size = 30; 
        node.color = { background: "red", border: "darkred" };
      } else if (node.category === "therapy") {
        node.size = 20; 
        node.color = { background: "green", border: "darkgreen" };
      } else {
        node.size = 25; 
        node.color = { background: "blue", border: "darkblue" };
      }
    });
  
    // vis DataSet 생성 및 네트워크 구성
    this.nodes = new window.vis.DataSet(initialNodes);
    this.edges = new window.vis.DataSet(initialEdges);
  
    this.network = new window.vis.Network(
      this.container,
      { nodes: this.nodes, edges: this.edges },
      options
    );
  
    this.setupEventListeners();
    this.setupContextMenu();
  }
  
  setupEventListeners() {
    // 일반 클릭 이벤트: branch 토글
    this.network.on('click', (params) => {
      if (params.nodes.length > 0) {
        const clickedNodeId = params.nodes[0];
        console.log('클릭한 노드 ID: ', clickedNodeId)
        const clickedNode = this.nodes.get(clickedNodeId);
        if (clickedNode && !clickedNode.isBranch) {
          const branchNodes = this.nodes.get({
            filter: (node) => node.isBranch && node.parent == clickedNodeId
          });
          console.log('토글 대상 하위 노드들:', branchNodes);
          if (branchNodes.length > 0) {
            // 물리 시뮬레이션을 잠시 비활성화
            this.network.setOptions({ physics: { enabled: false } });
            
            const currentlyHidden = branchNodes[0].hidden;
            branchNodes.forEach(node => {
              this.nodes.update({ id: node.id, hidden: !currentlyHidden });
            });
            const branchEdges = this.edges.get({
              filter: (edge) => edge.isBranch && edge.parent == clickedNodeId
            });
            branchEdges.forEach(edge => {
              this.edges.update({ id: edge.id, hidden: !currentlyHidden });
            });
            
            // 약간의 지연 후 물리 시뮬레이션을 다시 활성화하고 네트워크 재렌더링
            setTimeout(() => {
              this.network.setOptions({ physics: { enabled: true } });
              this.network.redraw();
            }, 100); // 지연 시간은 상황에 따라 조절
          }
        }
      }
    });
    
    // 더블클릭: 문서 모달 호출
    this.network.on('doubleClick', (params) => {
      if (params.nodes.length > 0) {
        const nodeId = params.nodes[0];
        const node = this.nodes.get(nodeId);
        this.nodeDocManager.openModal(nodeId, node.label);
      }
    });

    // Escape 키: 모든 branch 숨김
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        const branchNodes = this.nodes.get({
          filter: (node) => node.isBranch
        });
        branchNodes.forEach(node => {
          if (!node.hidden) {
            this.nodes.update({ id: node.id, hidden: true });
          }
        });
        const branchEdges = this.edges.get({
          filter: (edge) => edge.isBranch
        });
        branchEdges.forEach(edge => {
          if (!edge.hidden) {
            this.edges.update({ id: edge.id, hidden: true });
          }
        });
      }
    });

    // 우클릭 이벤트: 사용자 정의 컨텍스트 메뉴 표시
// 우클릭 이벤트 리스너 (NetworkManager.js)
    this.container.addEventListener('contextmenu', (event) => {
      event.preventDefault();

      // 컨테이너의 위치를 기준으로 포인터 좌표 계산
      const rect = this.container.getBoundingClientRect();
      const pointer = {
          x: event.clientX - rect.left,
          y: event.clientY - rect.top
      };

      const nodeId = this.network.getNodeAt(pointer);
      if (nodeId) {
        this.showContextMenu(nodeId, event.pageX, event.pageY);
      } else {
        this.hideContextMenu();
      }
    });

  }

  // 사용자 정의 컨텍스트 메뉴 생성 및 설정
  setupContextMenu() {
    this.contextMenu = document.createElement('div');
    this.contextMenu.id = 'custom-context-menu';
    Object.assign(this.contextMenu.style, {
      position: 'absolute',
      backgroundColor: 'white',
      border: '1px solid #ccc',
      padding: '5px 0',
      boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
      zIndex: '2000',
      display: 'none'
    });

    const options = [
      { label: '노드 삭제', action: () => this.deleteNode(this.contextMenu.nodeId) },
      { label: '하위 노드 추가', action: () => this.addSubNode(this.contextMenu.nodeId) },
      { label: '노드 이름 수정', action: () => this.renameNode(this.contextMenu.nodeId) }
    ];

    options.forEach(opt => {
      const item = document.createElement('div');
      item.textContent = opt.label;
      item.style.padding = '5px 20px';
      item.style.cursor = 'pointer';
      item.addEventListener('mouseover', () => item.style.backgroundColor = '#f0f0f0');
      item.addEventListener('mouseout', () => item.style.backgroundColor = '');
      item.addEventListener('click', () => {
        this.hideContextMenu();
        opt.action();
      });
      this.contextMenu.appendChild(item);
    });

    document.body.appendChild(this.contextMenu);
    document.addEventListener('click', () => this.hideContextMenu());
  }

  showContextMenu(nodeId, x, y) {
    this.contextMenu.nodeId = nodeId;
    this.contextMenu.style.left = x + 'px';
    this.contextMenu.style.top = y + 'px';
    this.contextMenu.style.display = 'block';
  }

  hideContextMenu() {
    this.contextMenu.style.display = 'none';
  }

  // 노드 삭제: 해당 노드와 연결된 엣지도 제거
  deleteNode(nodeId) {
    this.nodes.remove({ id: nodeId });
    const connectedEdges = this.edges.get({
      filter: (edge) => edge.from === nodeId || edge.to === nodeId
    });
    connectedEdges.forEach(edge => this.edges.remove({ id: edge.id }));
  }

  // 하위 노드 추가: 새 노드를 생성하고 부모와 연결하는 엣지 추가
  addSubNode(parentNodeId) {
    const newNodeLabel = prompt("새 하위 노드의 이름을 입력하세요:", "새 노드");
    if (!newNodeLabel) return;
    const newNodeId = Date.now(); // 고유 ID 생성 (간단)
    this.nodes.add({
      id: newNodeId,
      label: newNodeLabel,
      hidden: false,
      isBranch: true,
      parent: parentNodeId,
      font: { color: "white", size: 14 },
      size: 25,
      color: { background: "blue", border: "darkblue" }
    });
    this.edges.add({
      id: `${parentNodeId}_${newNodeId}`,
      from: parentNodeId,
      to: newNodeId,
      hidden: false,
      isBranch: true,
      parent: parentNodeId
    });
  }

  // 노드 이름 수정: prompt로 새 이름 입력 후 업데이트
  renameNode(nodeId) {
    const currentNode = this.nodes.get(nodeId);
    const newLabel = prompt("새 노드 이름을 입력하세요:", currentNode.label);
    if (!newLabel) return;
    this.nodes.update({ id: nodeId, label: newLabel });
  }
}
