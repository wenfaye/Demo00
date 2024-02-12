const useWebSocket = (callback) => {

    // console.log('useWebSocket')
    // const socket = new WebSocket('ws://192.168.1.218:9527/webSocket/1700126941964');
    const socket = new WebSocket(`ws://${window.location.host}/webSocket/1700126941964`);
    socket.onmessage = function (event) {
        if (event.data) {
            const socketData = JSON.parse(event.data);
            const { type } = socketData;
            if (type == 'audit' || type == 'unlink') {
                callback()
            }
        }

    }

    socket.onopen = function () {
        console.log("socket连接成功")
    }
        ,
        socket.onerror = function () {
            console.log("socket连接失败")
        }
        ,
        socket.onclose = function (e) {
            console.log("socket连接断开")
        }
}


export default useWebSocket