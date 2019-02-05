import React, {Component} from "react";
import ApiPicker from "./ApiPicker";

class Choose extends Component {
  render() {
    const{clientId, scopes} = this.props;
    return (
      <div className="choose-page">
        <div className="choose-page__btn select-btn">
          <ApiPicker
            clientId={clientId}
            scopes={scopes}
          />
        </div>
        <div className="choose-page__btn upload-btn">
          <button type="button" className="btn btn-secondary btn-lg">Upload template</button>
        </div>
      </div>
    );
  }
}

export default Choose;
