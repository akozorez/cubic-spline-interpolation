import React from 'react';
import Plotter from './Plotter';

class App extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
    }

    render() {
        const plotters = () => [2, 1, 0.5, 0.25].map((el, index) => (
            <Plotter
                fnText={"6*x^2*cos(x)"}
                xGrid={[-10, 10]}
                xGridTurn={el}
                index={index}
                key={index}
            />
        ));
        return (
            <div id="app" className="container">
                <div className="row">
                    {plotters()}
                </div>
            </div>
        );
    }
}

export default App;
