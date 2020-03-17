enum HealthStatus {
    Healthy = 1,
    Sick,
    Immune
}

export class Node {
    x = 0
    y = 0
    size = 5
    status = HealthStatus.Healthy

    constructor(x: number, y: number, size: number) {
        this.x = x
        this.y = y
        this.size = size
    }   
}

