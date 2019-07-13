export const requestHotelView = (socket: any, data: any) => {
    socket.emit('renderHotelView')
}

export default requestHotelView;