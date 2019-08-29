import * as React from "react";
import GenericSplash from './GenericSplash';

type ErrorProps = {
    errorText: string,
};
class ErrorSplash extends React.Component<ErrorProps> {

    render() {
        const { errorText } = this.props;
        return (
            <GenericSplash>
                <p>{errorText}</p>
            </GenericSplash>
        );
    }
}

export default ErrorSplash;
