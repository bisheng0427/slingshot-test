export enum WS_ACTION {
    GET_LIST = 'getList',
    GET_INFO = 'getInfo',
    ADD = 'add',
    UPDATE = 'update',
    DELETE = 'delete',
    SPAWN_MINER = 'spawnMiner',
}

export enum WS_TYPE {
    MINER = 'miner',
    MINER_HISTORY = 'minerHistory',
    PLANET = 'planet',
    ASTEROID = 'asteroid',
}

export enum MINER_STATUS {
    IDLE = 0,
    TRAVELING = 1,
    MINING = 2,
    TRANSFERING = 3,
}

export enum ASTEROID_STATUS {
    HAS_MINERAL = 1,
    DEPLETED = 0,
}