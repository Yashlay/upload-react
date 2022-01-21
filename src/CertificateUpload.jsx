import React from "react";
import {Document, Page, pdfjs} from "react-pdf";
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import DragDrop from "./DragDrop";


class CertificateUpload extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            pageNumber: 1,
            file: "",
            result: []
        };
        pdfjs.GlobalWorkerOptions.workerSrc =
            `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

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
        this.setState({
            result: ['sdc']
        });
    }

    clear() {
        this.setState({
            file: "",
            result: []
        })
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
                    {!this.state.file ?
                        <div>
                            <div className="uploadTitle">Select the certificate (PDF) you want to compare</div>
                            <DragDrop handleDrop={this.handleDrop}>
                                <div style={{
                                    height: 200,
                                    width: 325,
                                    backgroundColor: "#f8ceec",
                                    backgroundImage: "linear-gradient(180deg, #f8ceec 0%, #a88beb 74%)",
                                    border: "2px dashed purple",
                                    borderRadius: "10px"
                                }}>
                                    <div style={{"marginTop": "45px", "marginBottom": "20px"}}>Drag and drop files here
                                    </div>
                                    <div style={{"marginBottom": "20px"}}>or</div>
                                    <label htmlFor="dragFileUpload" className="custom-file-upload">
                                        Browse files
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
                                <p>Page {this.state.pageNumber} of {this.state.numPages}</p>
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
                        Result Set
                        <div>
                            <table style={{"margin": "auto"}} className="resultTable">
                                <tbody>
                                <tr>
                                    <th>Company</th>
                                    <th>Contact</th>
                                    <th>Country</th>
                                </tr>
                                <tr>
                                    <td>Alfreds Futterkiste</td>
                                    <td>Maria Anders</td>
                                    <td>Germany</td>
                                </tr>
                                <tr>
                                    <td>Centro comercial Moctezuma</td>
                                    <td>Francisco Chang</td>
                                    <td>Mexico</td>
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