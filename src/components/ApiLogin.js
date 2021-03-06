import React, { Component, Fragment } from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from "prop-types";
import '../index.scss';
import ReactLoading from 'react-loading';

import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  root: {
    flexGrow: 1,
    marginTop: `${theme.spacing.unit * 2}px`,
  },
  margin: {
    margin: theme.spacing.unit,
  },
  extendedIcon: {
    marginRight: theme.spacing.unit,
  },
  marginIcon: {
    marginRight: theme.spacing.unit,
  },
  marginAuto: {
    margin:"auto",
    padding: `${theme.spacing.unit * 2}px`,
  }
});

class ApiLogin extends Component {
  constructor(props) {
    super(props);

    this.handleClientLoad = this.handleClientLoad.bind(this);
    this.initClient = this.initClient.bind(this);
    this.updateSigninStatus = this.updateSigninStatus.bind(this);
    this.handleAuthClick = this.handleAuthClick.bind(this);
    this.homeOrSteps = this.homeOrSteps.bind(this);
  }

  componentDidMount() {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.defer = true;
    script.src = 'https://apis.google.com/js/api.js';
    script.onload = this.handleClientLoad;
    script.onreadystatechange = this.handleClientLoad;
    const tag = document.getElementsByTagName('script')[0];
    tag.parentNode.insertBefore(script, tag);
  }

  handleClientLoad() {
    window.gapi.load('client:auth2', this.initClient);
  }

  initClient() {
    window.gapi.client
      .init({
        discoveryDocs: this.props.discoveryDocs,
        clientId: this.props.clientId,
        scope: this.props.scopes
      })
      .then(() => {
        window.gapi.auth2.getAuthInstance().isSignedIn.listen(this.updateSigninStatus);
        this.updateSigninStatus(window.gapi.auth2.getAuthInstance().isSignedIn.get());
      });
  }

  updateSigninStatus(isSignedIn) {
    this.props.updateStateLogin(isSignedIn);
  }

  handleAuthClick() {
    window.gapi.auth2.getAuthInstance().signIn();
  }

  homeOrSteps(){
    if(this.props.signIn !== true){
      return  <ReactLoading type={'spinningBubbles'} color={'#990099'} height={100} width={100} className={this.props.classes.marginAuto}/>
    } else {
      return <Redirect to= '/steps/choose' />
    }
  }

  render() {
    const { classes, loadingHome, signIn } = this.props;

    if (!loadingHome){
      if(!signIn){
        return (
        <div className={classes.root}>
          <Button
            variant="outlined"
            size="medium"
            color="secondary"
            className={classes.margin}
            onClick={this.handleAuthClick}>
            <i className={`fab fa-google ${classes.marginIcon}`}></i>
            <span>Sign in with Google</span>
          </Button>
        </div>
        )
      }else{
        return <Redirect to= '/steps/choose' />
      }
    }else {
      return(
        <Fragment>
          {this.homeOrSteps()}
        </Fragment>
      )
    }
  }
}

ApiLogin.propTypes = {
  discoveryDocs: PropTypes.arrayOf(PropTypes.string).isRequired,
  clientId: PropTypes.string.isRequired,
  scopes: PropTypes.string.isRequired,
  updateStateLogin: PropTypes.func.isRequired,
  signIn: PropTypes.bool.isRequired,
  loadingHome: PropTypes.bool.isRequired,
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ApiLogin);
