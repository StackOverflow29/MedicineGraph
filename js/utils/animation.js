export const zoomToNode = (network, nodeId, callback) => {
    const position = network.getPosition(nodeId);
    
    network.moveTo({
        position: { x: position.x, y: position.y },
        scale: 2.0,
        animation: {
            duration: 1000,
            easingFunction: 'easeInOutQuad'
        }
    });

    if (callback) {
        setTimeout(callback, 1000);
    }
};

export const zoomOut = (network, callback) => {
    network.moveTo({
        scale: 1.0,
        animation: {
            duration: 1000,
            easingFunction: 'easeInOutQuad'
        }
    });

    if (callback) {
        setTimeout(callback, 1000);
    }
};