import * as React from "react";

export type MottoEditProps = {
    motto: string,
    onMottoChange: (motto: string) => void,
};

type MottoEditState = {
    mottoTmp: string
};

export default class MottoEdit extends React.Component<MottoEditProps, MottoEditState> {
    constructor(props: MottoEditProps) {
        super(props);

        const initialState: MottoEditState = {
            mottoTmp: this.props.motto,
        };
        this.state = initialState;
    }
    
    render() {
        const { mottoTmp } = this.state;

        return (<input type="text" onChange={event => { this.setState({ mottoTmp: event.target.value }) }} onKeyDown={this.handleKeyDown} value={mottoTmp} autoComplete="off" maxLength={80} />);
        /*<RIEInput
                value={motto}
                change={(data: MottoEditProps) => onMottoChange(data.motto)}
                classLoading="loading"
                propName='motto'
                editProps={{ maxLength: 80 }}
            />
        );*/
    }

    handleChangeMotto = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ mottoTmp: event.target.value });
    }

    handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key !== 'Enter')
            return;

        const { onMottoChange } = this.props;
        const { mottoTmp } = this.state;

        if (mottoTmp.length > 0 || mottoTmp.length > 80) {
            onMottoChange(mottoTmp);
        }
    }
}