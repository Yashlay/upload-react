import React from "react";
import {Document, Page, pdfjs} from "react-pdf";
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import DragDrop from "./DragDrop";
import api from './appApi';
import Request from 'axios-request-handler';
const INITIATE_PROCESSING_URL = window.location.protocol + '//' + window.location.hostname + "/listing/";
const POLLING_INTERVAL = 10000;

class CertificateUpload extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            pageNumber: 1,
            file: "",
            result: [],
            vendor: 1,
            fileId: -1
        };
        pdfjs.GlobalWorkerOptions.workerSrc =
            `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

    }

    componentDidMount() {
        this.setState({
            vendor: 1
        });
    }

    onDocumentLoadSuccess({numPages}) {
        this.setState({
            numPages: numPages
        });
    }

    extract() {
        if (!this.state.file) {
            window.alert("No file selected. Please upload file.");
            return;
        }

        api.upload({
            file: this.state.file,
            type: this.state.vendor
        }).then((response) => {
            if (response.status === 200) {
                this.setState({
                    fileId: response.data.fileID
                });
                this.startProcessing(response.data.fileID).then((response) => {
                    console.log("" + JSON.stringify(response));
                    // todo process the received data.
                    this.setState({
                        result: ['sdc']
                    });
                }).catch((err) => alert(err));
          /*      api.startProcessing().then((response) => {
                    console.log("" + response);
                    this.setState({
                        result: ['sdc']
                    });
                }).catch((err) => alert(err));*/
            } else {
                alert("Error uploading the file.");
            }
        }).catch((error) => {
            alert(error.response.data.errorMessage);
        });
    }

    // initiateProcessing(fileID) {
    //     return api.initiateProcessing(fileID)
    //         .then((response) => {
    //             if (response.status === 200) {
    //                 if (response.data.status === "Processed") {
    //                     return Promise.resolve(response.data.data);
    //                 } else {
    //                     return Promise.resolve()
    //                         .then(this.initiateProcessing(fileID)).
    //                 }
    //             } else {
    //                 alert("Error initiating the process the file.");
    //             }
    //         })
    // }

    clear() {
        this.setState({
            file: "",
            result: []
        })
    }

    startProcessing(fileId) {
        return new Promise((resolve, reject) => {
            let data = {};
            let dataReceived = false;
            const initProcessing = new Request(INITIATE_PROCESSING_URL + fileId);
            initProcessing.poll(POLLING_INTERVAL).get((res) => {
                if (res.data.status === "Processed") {
                    dataReceived = true;
                    data = res.data.data;
                    return false;
                }
            });
            if (dataReceived) {
                resolve(data);
            }
        });
    }

    handleDrop = (files) => {
        if (files.length === 1) {
            if (files[0].type === "application/pdf") {
                this.setState({file: files[0]})
            } else {
                alert('Please upload pdf files only.');
            }
        } else {
            alert('Please upload only 1 file.');
        }
    }

    previousPage() {
        this.changePage(-1);
    }

    onChangeOfSelect(e) {
        this.setState({
            vendor: Number(e.target.value)
        });
    }

    nextPage() {
        this.changePage(1);
    }

    changePage(offset) {
        const pageNumber = this.state.pageNumber;
        this.setState({
            pageNumber: pageNumber + offset
        });
    }

    render() {
        return (
            <div className="App">
                <div style={{'borderBottom': '1px solid grey', 'marginBottom': '10px'}}>
                    <img src='https://www.gerab.com/images/logo.png' width='75px' height='75px' className='App-logo'
                         alt="logo"/>
                </div>
                <div className="flex flex-col creds">
                    <div className="title">Digital Certificate - MDM</div>
                    <div className="subTitle">
                        <div>
                            Welcome to Digital Certification Application
                        </div>
                    </div>
                </div>

                <div className="uploadSegment">
                        <div>
                            <div className="uploadTitle">Select Vendor</div>
                            <div>
                                <select id='vendorSelect' onChange={(e) =>
                                    this.onChangeOfSelect(e)
                                }>
                                    <option value={1}>Tenaris</option>
                                    <option value={2}>Heng Yang</option>
                                </select>
                            </div>
                        </div>
                    {!this.state.file ?
                        <div>
                            <div className="uploadTitle">Select the certificate (PDF) you want to compare</div>
                            <DragDrop handleDrop={this.handleDrop}>
                                <div style={{
                                    height: 200,
                                    width: 325,
                                    backgroundColor: "#D30803",
                                    backgroundImage: "linear-gradient(180deg, #D30803 0%, #FEB2B0 74%)",
                                    border: "2px dashed red",
                                    borderRadius: "10px"
                                }}>
                                    <div style={{"marginTop": "45px", "marginBottom": "20px", "color": "white"}}>Drag and drop files here
                                    </div>
                                    <div style={{"marginBottom": "20px", "color": "white"}}>- OR -</div>
                                    <label htmlFor="dragFileUpload" className="custom-file-upload">
                                        Browse file
                                    </label>
                                    <input id="dragFileUpload"
                                           onChange={(fileChangeEvent) => {
                                               this.setState({
                                                   file: fileChangeEvent.target.files[0]
                                               })
                                           }}
                                           accept="application/pdf"
                                           type="file"
                                    />
                                </div>
                            </DragDrop>
                        </div>
                        : ""
                    }

                    <div className="previewPdf">
                        <Document
                            file={this.state.file}
                            onLoadSuccess={this.onDocumentLoadSuccess.bind(this)}
                        >
                            <Page pageNumber={this.state.pageNumber}/>
                        </Document>
                        {this.state.file ?
                            <div>
                                <div className="buttonc">
                                    <button
                                        type="button"
                                        disabled={this.state.pageNumber <= 1}
                                        onClick={this.previousPage.bind(this)}
                                        className="Pre"
                                    >
                                        Previous
                                    </button>
                                    <button
                                        type="button"
                                        disabled={this.state.pageNumber >= this.state.numPages}
                                        onClick={this.nextPage.bind(this)}
                                    >
                                        Next
                                    </button>
                                </div>
                                <p className="text">Page {this.state.pageNumber} of {this.state.numPages}</p>
                            </div>
                            : ""}
                    </div>
                </div>
                <div style={{"borderTop": "1px solid grey", "borderBottom": "1px solid grey"}}>
                    <button style={{"margin": "15px"}}
                            onClick={this.extract.bind(this)}>
                        Extract
                    </button>
                </div>
                {this.state.result.length > 0 ?
                    <div style={{"marginTop": "15px", "paddingBottom": "15px", "borderBottom": "1px solid grey"}}>
                        <p className="text">Result Set</p>
                        <div>
                            <table style={{"margin": "auto"}} className="resultTable">
                                <tbody>
                                <tr>
                                    <th>Key</th>
                                    <th>Value</th>
                                </tr>
                                <tr>
                                    <td>Number / Numero:</td>
                                    <td>01-19-14826</td>
                                </tr>
                                <tr>
                                    <td>Date / Data:</td>
                                    <td>December 19, 2019</td>
                                </tr>
                                <tr>
                                    <td>Page / Pagina:</td>
                                    <td>1/8</td>
                                </tr>
                                <tr>
                                    <td>Dimensions / Dimensioni:</td>
                                    <td>@ 24.000" O.D. x .969" W.T.<br/>@610.00mm O.D. x 24.61mm W."</td>
                                </tr>
                                <tr>
                                    <td>Schedule / Schedula:</td>
                                    <td>60</td>
                                </tr>
                                <tr>
                                    <td>Length / Lunghezza:</td>
                                    <td>34.449 ft + 38.714 ft<br/>10500 mm + 11800 mm</td>
                                </tr>
                                <tr>
                                    <td>Standard or Specification / Norme o specifica:</td>
                                    <td>See note nr.1<br/>Vedi nota nr.1 ae BS</td>
                                </tr>
                                <tr>
                                    <td>Manufacture Process / Processo di fabbricazione:</td>
                                    <td>NORMALIZED<br/>NORMALIZZATI</td>
                                </tr>
                                <tr>
                                    <td>Product Type / Tipo di prodotto:</td>
                                    <td>SEAMLESS LINE PIPES (WITH EXTRA REQUIREMENTS)<br/>TUBI S.S. LINE PIPE (CON RICHIESTE SUPPLEMENTARI)</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>

                        <button style={{"margin": "15px"}} onClick={this.clear.bind(this)}>Clear</button>
                    </div> : ""}
            </div>
        );
    }
}

export default CertificateUpload;