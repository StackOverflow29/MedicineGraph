import { mainGraphData, subGraphData } from './data/graphData.js';
import { NodeDocumentManager } from './nodeDocument.js';

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
      interaction: {
        hover: false
      }
    };

    // 메인 데이터의 노드와 엣지를 초기 배열로 생성
    const initialNodes = [...mainGraphData.nodes];
    const initialEdges = [...mainGraphData.edges];

    // subGraphData의 branch(하위) 노드를 hidden 상태로 추가 (나중에 토글하여 표시)
    for (let parent in subGraphData) {
      const subData = subGraphData[parent];
      subData.nodes.forEach(node => {
        initialNodes.push({ 
          ...node, 
          hidden: true, 
          isBranch: true, 
          parent: parseInt(parent)
        });
      });
      subData.edges.forEach((edge, index) => {
        initialEdges.push({ 
          ...edge, 
          hidden: true, 
          isBranch: true, 
          id: `${parent}_edge_${index}`, 
          parent: parseInt(parent)
        });
      });
      // 메인 노드와 branch의 첫 번째 노드를 연결하는 엣지 추가
      if (subData.nodes.length > 0) {
        initialEdges.push({
          from: parseInt(parent),
          to: subData.nodes[0].id,
          hidden: true,
          isBranch: true,
          id: `${parent}_parent_edge`,
          parent: parseInt(parent)
        });
      }
    }
    
    // 각 노드에 대해 category에 따라 크기, 글자색 및 배경색 적용
    initialNodes.forEach(node => {
      // 글자 스타일 (모두 하얀색)
      node.font = { color: "white", size: 14 };
      
      // category에 따른 크기 및 색상 지정
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

    // DataSet 생성 및 네트워크 구성
    this.nodes = new vis.DataSet(initialNodes);
    this.edges = new vis.DataSet(initialEdges);

    this.network = new vis.Network(
      this.container,
      { nodes: this.nodes, edges: this.edges },
      options
    );

    this.setupEventListeners();
  }
  
  setupEventListeners() {
    // 기존 클릭 이벤트: 메인 노드를 클릭하면 branch 토글
    this.network.on('click', (params) => {
      if (params.nodes.length > 0) {
        const clickedNodeId = params.nodes[0];
        const clickedNode = this.nodes.get(clickedNodeId);
        if (clickedNode && !clickedNode.isBranch) {
          const branchNodes = this.nodes.get({
            filter: (node) => node.isBranch && node.parent == clickedNodeId
          });
          if (branchNodes.length > 0) {
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
          }
        }
      }
    });

    // 더블클릭 이벤트: 해당 노드의 문서를 보여주는 모달 창 호출
    this.network.on('doubleClick', (params) => {
      if (params.nodes.length > 0) {
        const nodeId = params.nodes[0];
        const node = this.nodes.get(nodeId);
        // 모달 창을 열어 문서를 보여줌
        this.nodeDocManager.openModal(nodeId, node.label);
      }
    });

    // Escape 키를 누르면 모든 branch를 숨김
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
  }
}
