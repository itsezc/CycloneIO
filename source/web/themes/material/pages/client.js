class Register extends React.Component {
    componentDidMount() {
        const script = document.createElement('script');

        script.src = 'http://localhost:8080/client.min.js';

        document.body.appendChild(script);

        window.PhaserGlobal = {
            hideBanner: true
        }
    }

    render() {
        return (
			<div></div>
        )
    }
}

export default Register
