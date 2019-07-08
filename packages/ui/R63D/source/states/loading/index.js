import React from 'react';

export default class Loading extends React.Component {

    constructor(props){
        super(props);

        const images = [
            'http://habboemotion.com/resources/images/large_hotels/view_ru_wide.png',
            'http://habboemotion.com/resources/images/large_hotels/view_ru_wide.png',
            'http://habboemotion.com/resources/images/large_hotels/view_fr_wide.png'
        ];

        this.photo = images[Math.floor(Math.random() * images.length)];
        this.state = {
            percent: 0
        };
    }

    componentWillMount() {

        this.interval = setInterval(() => {

            if(this.state.percent == 100){
                this.props.onFinishLoading();
                return clearInterval(this.interval);
            }

            this.setState({
                percent: this.state.percent + 10
            });
        }, 500)
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    render(){
        return (
            <div className="loading">

                <div className="loading-photo">
                    <img src={this.photo} />
                </div>

                <h2>Please wait while Habbay is loading</h2>

                <div className="loading-progress">
                    <div className="progress-bar" style={{ width: this.state.percent + '%' }}></div>
                </div>

                <small>{this.state.percent}%</small>
            </div>
        )
    }
}