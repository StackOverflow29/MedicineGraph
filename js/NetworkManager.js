import { mainGraphData, subGraphData } from './data/graphData.js';

export class NetworkManager {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.initNetwork();
  }
  
  initNetwork() {
    const options = {
      nodes: {
        shape: 'circle',
        size: 30,
        font: { size: 14 },
        borderWidth: 2,
        shadow: true
      },
      interaction: {
        hover: false
      }
    };

    // 초기 노드 및 엣지 배열 생성 (메인 데이터)
    const initialNodes = [...mainGraphData.nodes];
    const initialEdges = [...mainGraphData.edges];

    // subGraphData의 branch들을 초기 데이터에 추가 (hidden: true로 설정)
    for (let parent in subGraphData) {
      const subData = subGraphData[parent];
      // branch 노드: hidden, isBranch, parent 속성 추가
      subData.nodes.forEach(node => {
        initialNodes.push({ ...node, hidden: true, isBranch: true, parent: parent });
      });
      // branch 엣지: hidden, isBranch, parent 속성 추가 (고유 id 사용)
      subData.edges.forEach((edge, index) => {
        initialEdges.push({ 
          ...edge, 
          hidden: true, 
          isBranch: true, 
          id: `${parent}_edge_${index}`, 
          parent: parent 
        });
      });
      // 상위 노드와 branch의 첫 번째 노드를 연결하는 엣지도 추가
      if (subData.nodes.length > 0) {
        initialEdges.push({
          from: parseInt(parent), // mainGraphData의 상위 노드 id는 숫자라고 가정
          to: subData.nodes[0].id,
          hidden: true,
          isBranch: true,
          id: `${parent}_parent_edge`,
          parent: parent
        });
      }
    }

    // DataSet 생성
    this.nodes = new vis.DataSet(initialNodes);
    this.edges = new vis.DataSet(initialEdges);

    // 네트워크 생성
    this.network = new vis.Network(
      this.container,
      { nodes: this.nodes, edges: this.edges },
      options
    );

    this.setupEventListeners();
  }
  
  setupEventListeners() {
    // 클릭 이벤트: 메인 노드를 클릭하면 해당 branch의 hidden 속성을 토글
    this.network.on('click', (params) => {
      if (params.nodes.length > 0) {
        const clickedNodeId = params.nodes[0];
        // 클릭한 노드가 메인 노드인지 확인 (branch는 isBranch: true)
        const clickedNode = this.nodes.get(clickedNodeId);
        if (clickedNode && !clickedNode.isBranch) {
          // 해당 메인 노드에 연결된 branch 노드들을 찾음
          const branchNodes = this.nodes.get({
            filter: (node) => node.isBranch && node.parent == clickedNodeId
          });
          if (branchNodes.length > 0) {
            // 현재 branch의 hidden 상태를 체크하여 토글
            const currentlyHidden = branchNodes[0].hidden;
            branchNodes.forEach(node => {
              this.nodes.update({ id: node.id, hidden: !currentlyHidden });
            });
            // branch 엣지들도 동일하게 업데이트
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

    // 필요에 따라 Escape 키를 누르면 모든 branch를 숨깁니다.
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
