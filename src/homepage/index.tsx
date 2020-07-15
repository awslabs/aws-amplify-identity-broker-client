import React, { Component } from "react";
// THIS LINE HAS TO BE AT THE END OF IMPORTS:
var Config = require("Config");

class HomePage extends Component {

    render() {
        return (
            <React.Fragment>
                Homepage of {Config.websiteName}
            </React.Fragment>
        )
    }
}

export default HomePage;