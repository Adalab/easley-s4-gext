import React, { Component, Fragment } from "react";
import { Link } from 'react-router-dom';
import PropTypes from "prop-types";
import ReactLoading from 'react-loading';

let keywords = [];
let eraseMoustache;
let presentation;
let eraseTripleMoustache;

class Fill extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loadingForm: true,
      moustachesArray: [],
      newName: '',
      presentationIdCopy: '',
      tripleMoustachesArray: []
    }

    this.loadSlidesApi = this.loadSlidesApi.bind(this);
    this.listSlides = this.listSlides.bind(this);
    this.execute = this.execute.bind(this);
    this.loadSlidesReplace = this.loadSlidesReplace.bind(this);
    this.handleNewDocument = this.handleNewDocument.bind(this);
  }

  componentDidMount() {
    this.loadSlidesApi();
  }

  loadSlidesApi() {
    if (this.props.presentationId !== '') {
      presentation = this.props.presentationId;
      window.gapi.client.load('slides', 'v1').then(this.listSlides);
    }
  }

  listSlides() {
    window.gapi.client.slides.presentations.get({
      presentationId: this.props.presentationId
    }).then(response => {
      let presentation = response.result;
      let moustaches = JSON.stringify(presentation).match(/(?<!{){{\s*[\w]+\s*}}(?!})/g);
      let tripleMoustaches = JSON.stringify(presentation).match(/(?<!{){{{\s*[\w.]+\s*}}}(?!})/g);
      if (moustaches.length > 0) {
        eraseMoustache = moustaches.map(item => item.replace('{{', '').replace('}}', ''));
        let moustachesNoDup = [...new Set([...keywords, ...eraseMoustache])];
        this.setState({ moustachesArray: moustachesNoDup });
      }

      console.log('array sin duplicados', this.state.moustachesArray);
      this.props.handleInitInputs(this.state.moustachesArray);
      if (tripleMoustaches.length > 0) {
        console.log('he entrado en el triple');
        eraseTripleMoustache = tripleMoustaches.map(item => item.replace('{{{', '').replace('}}}', ''));
        let tripleMoustachesNoDup = [...new Set([...keywords, ...eraseTripleMoustache])];
        this.setState({ tripleMoustachesArray: tripleMoustachesNoDup });
      }
      this.props.handleImagesInputs(this.state.tripleMoustachesArray);
    });
  }

  loadSlidesReplace() {
    if (this.props.presentationId !== '') {
      window.gapi.client.load('slides', 'v1').then(f => {
        window.gapi.client.load('drive', 'v2').then(execute => {
          this.execute()
        })
      }).catch(error => { console.log(error) });
    }
  }

  execute() {
    return window.gapi.client.drive.files.copy({
      "title": this.state.newName,
      "fileId": presentation,
      "resource": {}
    })
      .then((response) => {
        let newId = response.result.id;
        this.props.handleCopyId(newId);
      },
        function (err) { console.error("Execute error", err); })
      .catch(err => { console.log(err); })
  }

  paintForm() {
    const { handleInputs, handleChangeFile, fileInput } = this.props;
      return (
        <form>
          {this.state.moustachesArray.map(item => {
            return (
              <div key={item} className="form-group">
                <label htmlFor={item}>{item.toUpperCase()}:</label>
                <input className="form-control " id={item} type="text" onKeyUp={handleInputs} />
              </div>
            );
          })
          }

          {this.state.tripleMoustachesArray.map(item=>{
            return (
              <div key={item} className="form-group">
                    <label htmlFor={item}>{item.toUpperCase()}:</label>
                    <input className="form-control " id={item} type="file" ref={fileInput} onChange={handleChangeFile} />
                  </div>
            );
          })
          }
        </form>
      )
  }

  handleNewDocument(e){
    let query = e.currentTarget.value;
    this.setState({
      newName: query
    })
  }

  render() {
    const { selectedTemplate } = this.props;

    if (this.state.moustachesArray.length>0 || this.state.tripleMoustachesArray.length>0 ) {
      return (
        <div className="fill-page">
          <div className="fill-template__result">
            <div id="result">{selectedTemplate}</div>
            <div className="fill-page__btn back-btn">
              <button type="button" className="btn btn-light"><Link to="/steps/choose">Choose another template</Link></button>
            </div>
          </div>
          <div className="input-name">
                <label htmlFor="copyName">New document name: </label>
                <input className="input-name" id= "copyName" type="text" onKeyUp={this.handleNewDocument} />
              </div>
          <div className="fill-page__form">
          {this.paintForm()}
          </div>
          <div className="row d-flex justify-content-around">
            <div className="fill-page__btn back-btn">
              <Link to="/steps/choose"><button type="button" className="btn btn-light">Back</button></Link>
              <div className="fill-page__btn next-btn">
                <Link to="/steps/success"><button type="button" className="btn btn-light" onClick={this.loadSlidesReplace}>Next</button></Link>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <Fragment>
          <ReactLoading type={'spinningBubbles'} color={'#990099'} height={100} width={100} />
          <div className="errorMessage">If the page does not refresh automatically in a minute, please check if your template has any keywords. Please review our 'How to use' section if necessary.</div>
        </Fragment>
        )
    }
  }
}

Fill.propTypes = {
  handleInitInputs: PropTypes.func,
  handleImagesInputs: PropTypes.func,
  handleInputs: PropTypes.func,
  handleTripleMoustaches: PropTypes.func,
  inputs: PropTypes.array,
  selectedTemplate: PropTypes.string
};

export default Fill;

