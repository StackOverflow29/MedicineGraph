export const mainGraphData = {
    nodes: [
        { id: 1, label: "Project A" },
        { id: 2, label: "Project B" },
        { id: 3, label: "Project C" }
    ],
    edges: [
        { from: 1, to: 2 },
        { from: 2, to: 3 },
        { from: 3, to: 1 }
    ]
};

export const subGraphData = {
    1: {
        nodes: [
            { id: 'a1', label: 'Task A1' },
            { id: 'a2', label: 'Task A2' },
            { id: 'a3', label: 'Task A3' }
        ],
        edges: [
            { from: 'a1', to: 'a2' },
            { from: 'a2', to: 'a3' }
        ]
    },
    2: {
        nodes: [
            { id: 'b1', label: 'Task B1' },
            { id: 'b2', label: 'Task B2' }
        ],
        edges: [
            { from: 'b1', to: 'b2' }
        ]
    },
    3: {
        nodes: [
            { id: 'c1', label: 'Task C1' },
            { id: 'c2', label: 'Task C2' },
            { id: 'c3', label: 'Task C3' }
        ],
        edges: [
            { from: 'c1', to: 'c2' },
            { from: 'c2', to: 'c3' },
            { from: 'c3', to: 'c1' }
        ]
    }
};