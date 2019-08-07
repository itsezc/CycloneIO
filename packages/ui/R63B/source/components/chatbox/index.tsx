import React, { Component } from 'react'

export default class ChatBox extends Component<any, any> {

    private Socket: SocketIOClient.Socket

    constructor(props: any) {
        super(props)

        this.Socket = props.socket

        this.state = {
            isOpen: false,
            chatbox: ''
        }

        this.updateChat = this.updateChat.bind(this)
        this.sendChat = this.sendChat.bind(this)
    }

    toggleOpen(){
        this.setState({
            isOpen: !this.state.isOpen
        })
    }

    updateChat(e: any) {
		this.setState({ chatbox: e.target.value })
	}

	sendChat(event: any) {
        
        event.preventDefault()

		this.Socket.emit('sendRoomChat', {
            roomId: 'cjy1pitya00ik0772bhv2sglx',
			from: this.Socket.id,
			body: this.state.chatbox
        })
        this.setState({ chatbox: '' })    
    } 


    render(){
        return (
            <div className='chat-box'>

                <div className='chat-style-picker'>

                    <div className='chat-style-picker-button' onClick={this.toggleOpen.bind(this)}>
                        <i className='icon icon-carret-down'></i>
                        <i className='icon icon-messages'></i>

                        <div className='chat-style-picker-arrow'></div>
                    </div>

                    <div className={'chat-style-picker-content' + (this.state.isOpen ?  ' is-open' : '')}>
                        list of styles
                    </div>
                </div>

                <form 
                    onSubmit={this.sendChat}
                >
                    <input 
                        type='text'
                        className='chat-input'
                        placeholder='Type here to say something...'
                        autoFocus
                        spellCheck={false}
                        value={this.state.chatbox}
                        onChange={this.updateChat}
                    />
                </form>

                <button className='btn-r63b btn-action btn-blue'>
                    <i className='icon icon-help'></i>
                </button>
            </div>
        )
    }
}