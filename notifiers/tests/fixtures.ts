import { Types } from "npm:komodo_client";

export const AwsBuilderTerminationFailed: Types.Alert & {data: {type: "AwsBuilderTerminationFailed"}} = {
    level: Types.SeverityLevel.Ok,
    ts: Date.now(),
    resolved: true,
    target: {
        type: "Server",
        id: "MyServer"
    },
    data: {
        type: "AwsBuilderTerminationFailed",
        data: {
            instance_id: "MyInstance",
            message: "some message"
        },
    },
};


export const ServerCPU: Types.Alert & {data: {type: "ServerCpu"}} = {
    level: Types.SeverityLevel.Critical,
    ts: Date.now(),
    resolved: true,
    target: {
        type: "Server",
        id: "MyServer"
    },
    data: {
        type: "ServerCpu",
        data: {
            percentage: 87.187123,
            id: "Something",
            name: "MyInstance"
        }
    },
};

export const ServerDisk: Types.Alert & {data: {type: "ServerDisk"}} = {
    level: Types.SeverityLevel.Critical,
    ts: Date.now(),
    resolved: true,
    target: {
        type: "Server",
        id: "MyServer"
    },
    data: {
        type: "ServerDisk",
        data: {
            used_gb: 97.1234,
            total_gb: 99.9665,
            path: "/my/cool/path",
            id: "Something",
            name: "MyInstance"
        }
    },
};

export const ServerMem: Types.Alert & {data: {type: "ServerMem"}} = {
    level: Types.SeverityLevel.Critical,
    ts: Date.now(),
    resolved: true,
    target: {
        type: "Server",
        id: "MyServer"
    },
    data: {
        type: "ServerMem",
        data: {
            used_gb: 97.1234,
            total_gb: 99.9665,
            id: "Something",
            name: "MyInstance"
        }
    },
};

export const StackImageUpdateAvailable: Types.Alert & {data: {type: "StackImageUpdateAvailable"}} = {
    level: Types.SeverityLevel.Ok,
    ts: Date.now(),
    resolved: true,
    target: {
        type: "Server",
        id: "MyServer"
    },
    data: {
        type: "StackImageUpdateAvailable",
        data: {
            id: "Something",
            name: "MyInstance",
            server_id: "1234",
            server_name: "MyServer",
            service: "MyService",
            image: "latest"
        }
    },
};

export const StackAutoUpdated: Types.Alert & {data: {type: "StackAutoUpdated"}} = {
    level: Types.SeverityLevel.Ok,
    ts: Date.now(),
    resolved: true,
    target: {
        type: "Stack",
        id: "675f2b0370fff236be04d528"
    },
    data: {
        type: "StackAutoUpdated",
        data: {
            id: "675f2b0370fff236be04d528",
            name: "MyStack",
            server_id: "1234",
            server_name: "MyServer",
            images: [ "redacted/redacted:latest" ]
        }
    },
};