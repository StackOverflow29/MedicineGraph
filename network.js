// 노드 데이터 정의
const nodes = new vis.DataSet([
    { id: 1, label: "Node 1" },
    { id: 2, label: "Node 2" },
    { id: 3, label: "Node 3" },
    { id: 4, label: "Node 4" },
    { id: 5, label: "Node 5" }
]);

// 엣지(연결선) 데이터 정의
const edges = new vis.DataSet([
    { from: 1, to: 3 },
    { from: 1, to: 2 },
    { from: 2, to: 4 },
    { from: 2, to: 5 },
    { from: 3, to: 5 }
]);

// 네트워크 옵션 설정
const options = {
    nodes: {
        shape: 'circle',
        size: 30,
        font: {
            size: 14
        }
    },
    edges: {
        width: 2,
        smooth: {
            type: 'continuous'
        }
    },
    physics: {
        stabilization: true,
        barnesHut: {
            gravitationalConstant: -80000,
            springConstant: 0.001,
            springLength: 200
        }
    }
};

// 컨테이너 요소 가져오기
const container = document.getElementById('network-container');

// 네트워크 생성
const network = new vis.Network(container, {
    nodes: nodes,
    edges: edges
}, options);

// 이벤트 핸들러 추가
network.on('click', function(properties) {
    if (properties.nodes.length > 0) {
        const nodeId = properties.nodes[0];
        console.log('클릭된 노드:', nodeId);
    }
});

// 네트워크가 안정화되었을 때의 이벤트
network.on('stabilizationIterationsDone', function() {
    console.log('네트워크 안정화 완료');
});