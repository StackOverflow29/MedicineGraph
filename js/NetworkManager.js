import { mainGraphData, subGraphData } from './data/graphData.js';
import { zoomToNode, zoomOut } from './utils/animation.js';

export class NetworkManager {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.subNetworksContainer = document.getElementById('sub-networks');
        this.currentSubNetwork = null;
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
                hover: true
            }
        };

        this.network = new vis.Network(
            this.container,
            mainGraphData,
            options
        );

        this.setupEventListeners();
    }

    setupEventListeners() {
        this.network.on('doubleClick', (params) => {
            if (params.nodes.length > 0) {
                const nodeId = params.nodes[0];
                this.showSubNetwork(nodeId);
            }
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && this.currentSubNetwork) {
                this.hideSubNetwork();
            }
        });
    }

    showSubNetwork(nodeId) {
        const subData = subGraphData[nodeId];
        if (!subData) return;

        // 서브 네트워크 컨테이너 생성
        const subContainer = document.createElement('div');
        subContainer.className = 'sub-network';
        this.subNetworksContainer.appendChild(subContainer);

        // 서브 네트워크 초기화
        const subNetwork = new vis.Network(
            subContainer,
            subData,
            this.network.options
        );

        // 줌 애니메이션 실행
        zoomToNode(this.network, nodeId, () => {
            subContainer.classList.add('active');
        });

        this.currentSubNetwork = {
            container: subContainer,
            network: subNetwork
        };
    }

    hideSubNetwork() {
        if (!this.currentSubNetwork) return;

        this.currentSubNetwork.container.classList.remove('active');
        zoomOut(this.network, () => {
            this.currentSubNetwork.container.remove();
            this.currentSubNetwork = null;
        });
    }
}